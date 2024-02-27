# streams-ts

TypeScript implementation of the Streams API for Node.js. Inspired by the
[Java 8 Stream API](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html)
and Rust's [Iterator](https://doc.rust-lang.org/std/iter/trait.Iterator.html).

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

Documentation is not yet hosted. You can check the tests for examples.
You can also generate documentation from the source code by using:

```npm run docs```

After that, you can open `docs/index.html` in your browser.

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

const stream = Stream.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

const result = stream
    .filter(x => x % 2 === 0)
    .map(x => x * 2)
    .toArray();

console.log(result); // [4, 8, 12, 16, 20]

const result2 = stream
    .filter(x => x % 2 === 0)
    .map(x => x * 2)
    .reduce((acc, x) => acc + x, 0);

console.log(result2); // 60

const result3 = stream
    .filter(x => x % 2 === 0)
    .map(x => x * 2)
    .findFirst();

console.log(result3); // 4

const result4 = stream
    .slide(2)
    .toMap()

console.log(result4); // Map { 1 => 2, 3 => 4, 5 => 6, 7 => 8, 9 => 10 }
```

For mor examples, check the tests or the documentation.