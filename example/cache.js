var Cache = require('../');
var FS = require('fs');
var Path = require('path');

var cache = new Cache();

// Initiating request
cache.pipe(FS.createWriteStream(Path.join(__dirname, 'dancey1.gif')));

// Pre-complete request
setImmediate(function() {
  cache.pipe(FS.createWriteStream(Path.join(__dirname, 'dancey2.gif')));
});

// Post-complete request
setTimeout(function() {
  cache.pipe(FS.createWriteStream(Path.join(__dirname, 'dancey3.gif')));
}, 1000);

// Start stream
FS.createReadStream(Path.join(__dirname, 'dancey.gif')).pipe(cache);
