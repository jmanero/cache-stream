Cache Stream
============
Streaming object cache controller

## What Does This Do?
It's a non-blocking read-through cache, implemented with streaming interfaces.
This means that all requests for an object are served in real-time, regardless
of the state of the cache. While the cache is building, data will be streamed
to new read requests first from the internal buffer, then as chunks are received
from the upstream source.

## API
### Cache
  Implements _Stream.Writable_

#### Instance Properties
##### _Number_ **Cache#length**
  The current size, in bytes, of the cached object

##### _Boolean_ **Cache#complete**
  _true_ When object is fully cached (source stream has ended), and hashes have
  been calculated

##### _String_ **Cache#md5**
  MD5 sum of the cached object. Calculated after object is fully cached.

##### _String_ **Cache#sha1**
  SHA1 sum of the cached object. Calculated after object is fully cached.

##### _String_ **Cache#sha256**
  SHA256 sum of the cached object. Calculated after object is fully cached.

#### Instance Methods
##### _Buffer_ **Cache#chunk(position, length)**
  Return a slice of the cached object

##### _CacheReader_ **Cache#pipe(writable)**
  Create a new CacheReader, piped to _writable_

### CacheReader
  Implements _Stream.Readable_

#### Instance Properties
##### _String_ **CacheReader#id**
  Unique ID of the _CacheReader_ instance.

##### _Cache_ **CacheReader#cache**
  _Cache_ instance being read.

##### _Boolean_ **CacheReader#flowing**
  Buffer state of the read stream.

##### _Number_ **CacheReader#position**
  Position of the reader in the cache's payload.

#### Instance Methods
##### **CacheReader#chunk(buffer)**
  Push chunk directly to read stream only if state is flowing.
