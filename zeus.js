const request = require('request');
const fs = require('fs');
const moment = require('moment');
const FeedParser = require('feedparser');
const crypto = require('crypto');
const Electron = require('electron');

var Main = Electron.remote.require('./main.js');
var Zeus = {};

Zeus.podcasts = [];

/**
 * Logs with a timestamp
 * @param tag {STRING}
 * @param message {STRING}
 */
Zeus.log = function(tag, message) {
  var timestamp = moment.utc().format('YYYY-mm-dd HH:mm:ss');
  var tag = '';
  switch (tag) {
    case 'request':
      tag = '{REQUEST}'
      break;
    case 'file':
      tag = '{FILE}';
      break;
    case 'error':
      tag = '{ERROR}';
      break;
    default:
      tag = '';
  }

  console.log(`${timestamp} ${tag} ${message}`);
};

/**
 * Creates an MD5 hash for a given input
 * @param input {STRING}
 */
Zeus.md5 = function (input) {
  var hash = crypto.createHash('md5').update(input).digest('hex');
  return hash;
};

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

  Zeus.podcasts = data;
  return callback(data);
//   fs.readFile('userdata/podcasts.json', function (err, data) {
//     if (err) {
//       Zeus.log('error', 'No podcast file found');
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
    Zeus.log('file', 'Read settings file');
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
  // Zeus.log('file', 'Saved user settings');

  fs.writeFile(`userdata/settings.json`, JSON.stringify(data), (err) => {
    if (err) {
      throw err;
    }

    Zeus.log('file', 'Saved user settings');
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

    podcast.podcasts[i].podcastLength = Zeus.formatSecondsToHoursMinutesSeconds(podcast.podcasts[i]['itunes:duration']['#']);
    podcast.podcasts[i].podcastLengthParsed = Zeus.formatSecondsToWords(podcast.podcasts[i]['itunes:duration']['#']);
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
  // Zeus.log('file', `Wrote podcast data to podcasts.json, ${Zeus.podcasts.length}`);

  fs.writeFile(`userdata/podcasts.json`, JSON.stringify(Zeus.podcasts), (err) => {
    if (err) {
      throw error;
    }

    Zeus.log('file', `Wrote podcast data to podcasts.json, ${Zeus.podcasts.length}`);
  });
};

/**
 * Downloads the .mp3 from the server
 * @param podcast {PODCAST}
 */
Zeus.downloadPodcast = function (podcast, callback) {
  var url = podcast['rss:enclosure']['@'].url;
  var file = fs.createWriteStream(`userdata/podcasts/${Zeus.md5(podcast.guid)}.mp3`);

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
  });

  file.on('end', function () {
    console.log('Finished downloading the file!');
  });
};

Zeus.formatSecondsToWords = function (seconds) {
  var d = moment.duration(parseInt(seconds), 'seconds');
  var response = `${d.hours()} hr ${d.minutes()} min`;
  return response;
};

Zeus.formatSecondsToHoursMinutesSeconds = function (seconds) {
  var d = moment.duration(parseInt(seconds), 'seconds');
  var response = `${d.hours()}:${d.minutes()}:${d.seconds()}`;
  return response;
};
