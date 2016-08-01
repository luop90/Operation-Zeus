var request = require('request');
var fs = require('fs');
var moment = require('moment');
var FeedParser = require('feedparser');

var Electron = require('electron');
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
    callback(null, podcast);
  });
};

Zeus.loadSavedPodcasts = function(callback) {

};

Zeus.loadSettings = function(callback) {
  fs.readFile(`userdata/settings.json`, (err, data) => {
    if (err) {
      Zeus.log('error', `Failed to read file, ${err}`);
      return callback({});
    }

    Zeus.log('file', 'Read settings file');
    data = JSON.parse(data);
    console.log(data);
    callback(data);
  });
};

Zeus.saveSettings = function(data, callback) {
  var data = JSON.stringify(data);

  fs.writeFile(`userdata/settings.json`, data, (err) => {
    if (err) {
      throw err;
    }

    Zeus.log('file', 'Saved user settings');
    callback ? callback(true) : false;
  });
};

Zeus.savePodcast = function(data) {

};

Zeus.removePodcast = function(data) {

};
