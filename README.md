Cache Stream
============
Streaming object cache controller

## Cache
  Implements _Stream.Writable_

### Instance Properties
#### _Number_ **Cache#length**
  The current size, in bytes, of the cached object

#### _Boolean_ **Cache#complete**
  _true_ When object is fully cached (source stream has ended), and hashes have
  been calculated

#### _String_ **Cache#md5**
  MD5 sum of the cached object. Calculated after object is fully cached.

#### _String_ **Cache#sha1**
  SHA1 sum of the cached object. Calculated after object is fully cached.

#### _String_ **Cache#sha256**
  SHA256 sum of the cached object. Calculated after object is fully cached.

### Instance Methods
#### _Buffer_ **Cache#chunk(position, length)**
  Return a slice of the cached object

#### _CacheReader_ **Cache#pipe(writable)**
  Create a new CacheReader, piped to _writable_

## CacheReader
  Implements _Stream.Readable_

### Instance Properties
#### _String_ **CacheReader#id**
  Unique ID of the _CacheReader_ instance.

#### _Boolean_ **CacheReader#cache**
  _Cache_ instance being read.

#### _Boolean_ **CacheReader#flowing**
  Buffer state of the read stream.

#### _Number_ **CacheReader#position**
  Position of the cache's payload that has been pushed to the read stream.

### Instance Methods
#### **CacheReader#chunk(buffer)**
  Push chunk directly to read stream only if state is flowing.
