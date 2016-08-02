const request = require('request');
const fs = require('fs');
const FeedParser = require('feedparser');
const moment = require('moment');
const Electron = require('electron');


var Main = Electron.remote.require('./main.js');
var api = Electron.remote.require('./api.js');
var Zeus = {};

Zeus.podcasts = [];

/**
 * Fetches the XML from an RSS feed
 * @param url {STRING}
 * @param callback {FUNCTION}
 */
Zeus.addPodcast = function(url, callback) {
  var req = request(url);
  var feedparser = new FeedParser();
  var podcast = {};
  podcast.podcasts = [];

  // Sometimes we'll get a 400 error without a user-agent
  req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
  req.setHeader('accept', 'text/html,application/xhtml+xml');

  req.on('error', (error) => {
    callback(error, null);
  });

  req.on('response', function (res) {
    var stream = this;

    if (res.statusCode != 200) {
      return callback(`Bad status code ${res.statusCode}`, null);
    }

    stream.pipe(feedparser);
  });

  feedparser.on('error', (error) => {
    callback(error, null);
  });

  feedparser.on('readable', function () {
    var stream = this;
    var meta = this.meta;
    var item;

    podcast.meta = meta;
    while (item = stream.read()) {
      podcast.podcasts.push(item);
    }
  });

  feedparser.on('error', (err) => {
    callback(err, null);
  });

  feedparser.on('end', () => {
    Zeus.savePodcast(podcast);
    callback(null, podcast);
  });
};

/**
 * Reads our podcasts from the JSON file
 * @param callback {FUNCTION}
 */
Zeus.loadSavedPodcasts = function(callback) {
  var data = [];
  if (fs.existsSync('userdata/podcasts.json')) {
    data = JSON.parse(fs.readFileSync('userdata/podcasts.json'));
  }

  for (var podcast = 0; podcast < data.length; podcast++) {
    for (var episode = 0; episode < data[podcast].podcasts.length; episode++) {
      data[podcast].podcasts[episode].hash = api.md5(data[podcast].podcasts[episode].guid);
      data[podcast].podcasts[episode].id = episode;
      data[podcast].podcasts[episode].isDownloaded = fs.existsSync(`userdata/podcasts/${data[podcast].podcasts[episode].hash}.mp3`);
    }
  }

  Zeus.podcasts = data;
  return callback(data);
//   fs.readFile('userdata/podcasts.json', function (err, data) {
//     if (err) {
//       api.log('error', 'No podcast file found');
//       Zeus.podcasts = [];
//       return callback([]);
//     }
//
//     data = JSON.parse(data);
//     Zeus.podcasts = data;
//     return callback(data);
//   });
};

/**
 * Reads our userdata settings
 * @param callback {FUNCTION}
 */
Zeus.loadSettings = function(callback) {
  var data = {};
  if (fs.existsSync('userdata/settings.json')) {
    api.log('file', 'Read settings file');
    data = JSON.parse(fs.readFileSync('userdata/settings.json'));
  }

  callback(data);
};

/**
 * Saves settings to a file
 * @param data {OBJECT}
 * @param callback {FUNCTION}
 */
Zeus.saveSettings = function(data, callback) {

  // fs.writeFileSync(`userdata/settings.json`, JSON.stringify(data));
  // api.log('file', 'Saved user settings');

  fs.writeFile(`userdata/settings.json`, JSON.stringify(data), (err) => {
    if (err) {
      throw err;
    }

    api.log('file', 'Saved user settings');
    callback ? callback(true) : false;
  });
};

/**
 * Saves a podcast to our array / file
 * @param podcast {PODCAST}
 */
Zeus.savePodcast = function(podcast) {
  for (var i = 0; i < podcast.podcasts.length; i++) {
    podcast.podcasts[i].pubDateParsed = moment(podcast.podcasts[i].pubDate).format('MMMM DD, YYYY');
    podcast.podcasts[i].id = i;

    if (podcast.podcasts[i]['itunes:duration']['#'].includes(':')) {
      podcast.podcasts[i].podcastLengthParsed = podcast.podcasts[i]['itunes:duration']['#'];
      continue;
    }

    podcast.podcasts[i].podcastLength = api.formatSecondsToHoursMinutesSeconds(podcast.podcasts[i]['itunes:duration']['#']);
    podcast.podcasts[i].podcastLengthParsed = api.formatSecondsToWords(podcast.podcasts[i]['itunes:duration']['#']);
  }

  Zeus.podcasts.push(podcast);
  podcast.id = Zeus.podcasts.indexOf(podcast);
  Zeus.updatePodcastFile();
};

/**
 * Removes a podcast from our array / file
 * @param podcast {PODCAST}
 */
Zeus.removePodcast = function(podcast) {
  Zeus.podcasts.splice(podcast.id, 1);
};

/**
 * Writes the podcasts file to JSON
 */
Zeus.updatePodcastFile = function () {
  // fs.writeFileSync(`userdata/podcasts.json`, JSON.stringify(Zeus.podcasts));
  // api.log('file', `Wrote podcast data to podcasts.json, ${Zeus.podcasts.length}`);

  fs.writeFile(`userdata/podcasts.json`, JSON.stringify(Zeus.podcasts), (err) => {
    if (err) {
      throw error;
    }

    api.log('file', `Wrote podcast data to podcasts.json, ${Zeus.podcasts.length}`);
  });
};

/**
 * Downloads the .mp3 from the server
 * @param podcast {PODCAST}
 */
Zeus.downloadPodcast = function (podcast, callback) {
  var url = podcast['rss:enclosure']['@'].url;
  var file = fs.createWriteStream(`userdata/podcasts/${podcast.hash}.mp3`);

  var req = request(url);
  // Sometimes we'll get a 400 error without a user-agent
  req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
  req.setHeader('accept', 'text/html,application/xhtml+xml');

  req.on('error', (error) => {
    console.log('Failed to download!');
    callback(error, null);
  });

  req.on('response', function (res) {
    var stream = this;

    if (res.statusCode != 200) {
      return callback(`Bad status code ${res.statusCode}`, null);
    }

    console.log('Piping download!');
    stream.pipe(file);

    var timesSame = 0;
    var previous = [];
    var fileWatcher = fs.watchFile(`userdata/podcasts/${podcast.hash}.mp3`, {  persistent: true, interval: 2000 }, (curr, prev) => {
      if (!previous) {
        previous = curr.ctime;
        return;
      }

      if (!moment(curr.ctime).isSame(moment(previous))) {
        api.log('file', `The time isn't the same yet! ${curr.ctime} ${prev.ctime}`);
        previous = curr.ctime;
        return;
      }

      console.log(`The time isn't the same yet! ${curr.ctime} ${previous}`);
      timesSame ++;
      if (timesSame > 4) {
        api.log('file', `Unwatching file...`);
        fs.unwatchFile(`userdata/podcasts/${podcast.hash}.mp3`);
        callback(null, true, 100);
      }
    });
  });
};

/**
 * Deletes the .mp3 from the client
 * @param podcast {PODCAST}
 */
Zeus.deletePodcast = function (podcast, callback) {
  fs.unlinkSync(`userdata/podcasts/${api.md5(podcast.guid)}.mp3`);

  callback(true);
  // fs.unlink(`userdata/podcasts/${api.md5(podcast.guid)}.mp3`, function (err) {
  //   if (err) {
  //     throw error;
  //   }
  //
  //   callback(success);
  // });
};
