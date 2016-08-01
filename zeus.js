var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var moment = require('moment');
var FeedParser = require('feedparser');

var Electron = require('electron');
var Main = Electron.remote.require('./main.js');

var podcasts = [];

function log(tag, message) {
  var timestamp = moment.utc().format('YYYY-mm-dd HH:mm:ss');
  var tag = '';
  switch (tag) {
    case 'request':
      tag = '{REQUEST}'
      break;
    default:

  }

  console.log(`${timestamp} ${tag} ${message}`);
}

function addPodcast(url, callback) {
  var req = request(url);
  var feedparser = new FeedParser();
  var podcast = {};
  podcast.podcasts = [];

  // Sometimes we'll get a 400 error without a user-agent
  req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
  req.setHeader('accept', 'text/html,application/xhtml+xml');

  req.on('error', (error) => {
    throw error;
  });

  req.on('response', function (res) {
    var stream = this;

    if (res.statusCode != 200) {
      return this.emit('error', new Error(`Bad status code ${res.statusCode}`));
    }

    stream.pipe(feedparser);
  });

  feedparser.on('error', (error) => {
    throw error;
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

  // request(url, (error, response, body) => {
  //   if (error || response.statusCode != 200) {
  //     throw error;
  //   }
  //
  //   var $ = cheerio.load(body, {
  //     xmlMode: true
  //   });
  //   var hasMorePodcasts = true;
  //   var podcast = {};
  //   var tempPodcast = {};
  //   var i = 0;
  //
  //   podcast.name = $('channel > title').text();
  //   podcast.externalLink = $('channel > link').text();
  //   podcast.author = $('channel > itunes:author').text();
  //   podcast.description = $('channel > description').text();
  //   podcast.imageURL = $('channel > itunes:image').attr('href');
  //
  //   podcast.podcasts = [];
  //
  //   while (hasMorePodcasts) {
  //     if (!$('item').eq(i)) {
  //       hasMorePodcasts = false;
  //       break;
  //     }
  //
  //     tempPodcast = {};
  //     tempPodcast.name = $('item').eq(i).
  //   }
  // });
}
