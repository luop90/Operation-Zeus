var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var moment = require('moment');

var Electron = require('electron');
var Main = Electron.remote.require('./main.js');

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

function addPodcast(url) {
  request(url, (error, response, body) => {
    if (error || response.statusCode != 200) {
      throw error;
    }

    
  });
}
