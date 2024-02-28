# streams-ts

![https://github.com/lordofdestiny/streams-ts](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![https://lordofdestiny.github.io/streams-ts/](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=GitHub%20Pages&logoColor=white)

TypeScript implementation of the Streams API for Node.js. Inspired by the
<a href="https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html" target="_blank">Java 8 Stream API</a>
and Rust's <a href="https://doc.rust-lang.org/std/iter/trait.Iterator.html" target="_blank">Iterator trait</a>.

Library is still in development and not yet ready for production use. It's mostly feature complete,
but there are still some missing methods and some methods, like `cycle` and `reverse`.

Library is written in TypeScript and is intended to be used with TypeScript. It's not yet published.

Focus of the library was more on the API design and less on performance.

All methods are lazy and return a new Stream object.

All methods are heavily tested with Jest.

## Installation

Library is not yet published. You can always download the source code and copy it to your project.

[comment]: <> (```npm install streams-ts```)

## Building

If you decide to clone the repository, you can build the library with:

```npm run build```

This will generate the build files in the `dist` directory.

If you want, you can also build the library in watch mode:

```npm run build:watch```

## Running tests

If you decide to clone the repository, you can run tests with:

```
npm install
npm test
```

Or you can run tests with watch mode:

```npm run test:watch```

After running tests, you can check the coverage with:

```npm run test:coverage```

This opens a browser with coverage report.

## Documentation

#### *_[Official documentation is avilable at here](https://streams-ts.github.io/streams-ts/)_*

You can also generate documentation from the source code by using:

```npm run docs```

After that, you can open `docs/index.html` in your browser or by running

```npm run docs:open```

You can check the tests for more examples.
   

## Clean build results

### Build results

```npm run clean:build```

### Documentation

```npm run clean:docs```

### Coverage

```npm run clean:coverage```

## Examples

```typescript
import { Stream } from 'streams-ts';

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const result = Stream.from(arr)
    .filter(x => x % 2 === 0)
    .map(x => x * 2)
    .toArray();

console.log(result); // [4, 8, 12, 16, 20]

const result2 = Stream.from(arr)
    .filter(x => x % 2 === 0)
    .map(x => x * 2)
    .reduce((acc, x) => acc + x, 0);

console.log(result2); // 60

const result3 = Stream.from(arr)
    .filter(x => x % 2 === 0)
    .map(x => x * 2)
    .findFirst();

console.log(result3); // 4

const result4 = Stream.from(arr)
    .slide(2)
    .toMap()

console.log(result4); // Map { 1 => 2, 3 => 4, 5 => 6, 7 => 8, 9 => 10 }
```

For mor examples, check the tests or the documentation.