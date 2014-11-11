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

## License
  The MIT License (MIT)

  Copyright (c) 2014 John Manero

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
