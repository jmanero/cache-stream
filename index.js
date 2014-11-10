var Crypto = require('crypto');
var Stream = require('stream');
var Util = require('util');

var DEBUG = require('debug')('cache-stream');
var CHUNK = 8 * 1024;

var Cache = module.exports = function() {
  Stream.Writable.call(this);
  var cache = this;

  this.complete = false;
  this.data = Buffer(0);
  this.consumers = {};
  this._md5 = Crypto.createHash('md5');
  this._sha = Crypto.createHash('sha1');
  this._sha256 = Crypto.createHash('sha256');

  this.on('finish', function() {
    cache.complete = true;
    DEBUG('Finish: ' + cache.length + ' bytes');

    // Digest hashes
    cache.md5 = cache._md5.digest('base64');
    delete cache._md5;
    DEBUG('MD5: ' + cache.md5);

    cache.sha = cache._sha.digest('base64');
    delete cache._sha;
    DEBUG('SHA: ' + cache.sha);

    cache.sha256 = cache._sha256.digest('base64');
    delete cache._sha256;
    DEBUG('SHA256: ' + cache.sha256);
  });
};
Util.inherits(Cache, Stream.Writable);

Object.defineProperty(Cache.prototype, 'length', {
  get: function() {
    return this.data.length;
  }
});

Cache.prototype._write = function(chunk, encoding, callback) {
  var consumers = this.consumers;
  setImmediate(callback);

  // Store chunk and push to consumers
  this.data = Buffer.concat([this.data, chunk]);
  for (var id in consumers) consumers[id].chunk(chunk);

  // Update hashes
  this._md5.update(chunk);
  this._sha.update(chunk);
  this._sha256.update(chunk);
};

/**
 * Return a chunk of the cached object
 */
Cache.prototype.chunk = function(position, length) {
  return this.data.slice(position, position + length);
};

/**
 * Create a new readable stream and pipe it to the consumer
 */
Cache.prototype.pipe = function(consumer) {
  var cache = this;
  var reader = new CacheReader(this);
  DEBUG('Pipe: ' + reader.id + ', completed ' + this.complete);

  this.consumers[reader.id] = reader;
  reader.on('end', function() {
    delete cache.consumers[reader.id];
  });

  reader.pipe(consumer);
};

/**
 * Readable stream for a consumer
 */
var CacheReader = function(cache) {
  Stream.Readable.call(this);
  var reader = this;

  this.id = Crypto.randomBytes(16).toString('base64');
  this.cache = cache;
  this.position = 0;
  this.flowing = true;
};
Util.inherits(CacheReader, Stream.Readable);

CacheReader.prototype._read = function() {
  var cache = this.cache;
  this.flowing = true;

  // Push chunks to the consumer until the stream buffer fills
  //  or we reach the end of the cache's buffer
  while (this.flowing && this.position < cache.length) {
    // DEBUG('Read ' + this.id + ': chunk ' + this.position);
    var chunk = cache.chunk(this.position, CHUNK);
    this.position += chunk.length;
    this.flowing = this.push(chunk);
  }

  // If the cache is completed and the whole buffer has been read,
  //  send EOF to the consumer
  if (this.position >= cache.length && cache.complete) {
    DEBUG('End ' + this.id);
    this.flowing = false;
    this.push(null);
  }
};

/**
 * Receive chunks directly from the producer once
 * we've reached the end of the cache's buffer
 */
CacheReader.prototype.chunk = function(chunk) {
  if (this.flowing) {
    // DEBUG('Chunk ' + this.id + ': chunk ' + this.position);
    this.position += chunk.length;
    this.flowing = this.push(chunk);
  }
};
