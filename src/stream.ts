import {ArgumentCountError, ValueError} from "~/errors";
import {
    chunk,
    enumerate,
    filter,
    flatten, iterate,
    map,
    rangeStartStopStep,
    rangeZeroToN,
    repeat,
    skip, slide,
    take,
    takeWhile, zip
} from "~/generators";
import {Sequencer} from "~/sequencer";
import type {Predicate, Function, BiFunction, Comparator, BiOperator, Consumer, UnaryOperator} from "~/types";


/** A Stream is a sequence of values that can be manipulated using a variety of methods. Streams are
 * created from iterables, arrays, or using the `range`, `repeat` and other factory methods.
 * Streams are lazy, meaning that they do not evaluate their elements until they are consumed by a
 * method that requires it, so-called terminal operations.
 * This allows for efficient processing of large or infinite sequences
 *
 * @typeParam T The type of the elements in the Stream
 *
 * @groupDescription Factories
 * Factories are methods that create new Streams from existing values or iterables.
 *
 * @groupDescription Collectors
 * Collectors are methods that consume the Stream and produce a new value.
 *
 * @groupDescription Transformers
 * Transformers are methods that create a new Stream from the original Stream
 * by transforming the elements in some way.
 *
 * */
export class Stream<T> extends Sequencer<T> {
    /**
     * @internal
     *
     * The underlying Sequencer object that provides the elements of the Stream
     * */
    protected readonly sequencer: Sequencer<T>;

    /**
     * @internal
     * */
    protected constructor(sequencer: Sequencer<T>) {
        super(sequencer);
        this.sequencer = sequencer;
    }

    /**
     * Create a Stream from an iterable.
     *
     * @typeParam T The type of the elements in the iterable and the
     * resulting Stream.
     *
     * @param iterable
     *
     * @example Create a Stream from an array
     * ```ts
     * const s = Stream.from([1, 2, 3, 4, 5]);
     * console.log(s.toArray()) // [1, 2, 3, 4, 5]
     *```
     *
     * @example Create a Stream from a string
     * ```ts
     *  const s = Stream.from("hello");
     *  console.log(s.toArray()); // ["h", "e", "l", "l", "o"]
     * ```
     *
     * @example Create a Stream from a Set
     * ```ts
     *  const s = Stream.from(new Set([1, 2, 3, 4, 5]));
     *  console.log(s.toArray()); // [1, 2, 3, 4, 5]
     * ```
     *
     * @example Create a Stream from a Map
     * ```ts
     * const s = Stream.from(new Map([["a", 1], ["b", 2], ["c", 3]]));
     * console.log(s.toArray()); // [["a", 1], ["b", 2], ["c", 3]]
     * ```
     *
     * @example Create a Stream from an iterable
     * ```ts
     * const s = Stream.from({
     *      *[Symbol.iterator]() {
     *          yield 1; yield 2; yield 3;
     *      }
     *  });
     *  console.log(s.toArray()); // [1, 2, 3]
     * ```
     *
     * @example Create a Stream from a generator function
     * ```ts
     * function* gen() {
     *      for (let i = 0; i < 5; i++) {
     *          yield i;
     *      }
     * }
     *
     * const s = Stream.from(gen());
     * console.log(s.toArray()); // [0, 1, 2, 3, 4]
     * ```
     *
     * @see
     * - {@link toArray} - collect Stream elements into an Array
     *
     * @group Factories
     * */
    public static from<T>(iterable: Iterable<T>) {
        return new Stream<T>(new Sequencer(iterable));
    }

    /**
     * Creates a stream from the variadic arguments.
     *
     * @typeParam T The type of the elements in the Stream
     *
     * @param values The values to create the Stream from
     *
     * @example Create a Stream from variadic arguments
     * ```ts
     * const s = Stream.of(1, 2, 3, 4, 5);
     * console.log(s.toArray()); // [1, 2, 3, 4, 5]
     * ```
     *
     * @example Create a Stream with spread syntax
     * ```ts
     * const s = Stream.of(..."hello");
     * console.log(s.toArray()); // ["h", "e", "l", "l", "o"]
     * ```
     *
     * @group Factories
     *
     * @see
     * - {@link Stream.toArray} - collect Stream elements into an Array
     * */
    public static of<T>(...values: T[]) {
        return new Stream<T>(new Sequencer(values));
    }

    /**
     * @param stop The end of the range
     *
     * @returns A Stream of numbers from 0 to `stop` (exclusive)
     *
     * @example Create a Stream of numbers in range [0, 5)
     * ```ts
     * const s = Stream.range(5);
     * console.log(s.toArray()); // [0, 1, 2, 3, 4]
     * ```
     *
     * @group Factories
     *
     * @see
     * - {@link Stream.toArray} - collect Stream elements into an Array
     * */
    public static range(stop: number): Stream<number>;
    /**
     * @param start The start of the range
     * @param stop The end of the range
     * @param step The step between each number in the range
     *
     * @throws ValueError if `step` is zero
     *
     * @returns
     * - A Stream of numbers from `start` to `stop` (exclusive) with a step of `step`,
     * if step is positive.
     *
     * - A Stream of numbers from `stop` down to `start` (exclusive) with a step of `step`,
     * if step is negative.
     *
     * - Empty Stream if `start` and `stop` are equal.
     *
     * @example Create a Stream of numbers in range [1, 6)
     *
     * ```ts
     * const s = Stream.range(1, 6);
     * console.log(s.toArray()); // [1, 2, 3, 4, 5]
     * ```
     *
     * @example Create a Stream of numbers in range [1, 6) with a step of 2
     * ```
     * const s = Stream.range(1, 6, 2);
     * console.log(s.toArray()); // [1, 3, 5]
     * ```
     *
     * @example Create a Stream of numbers in range [5, 0)
     * ```ts
     * const s = Stream.range(5, 0, -1);
     * console.log(s.toArray()); // [5, 4, 3, 2, 1]
     * ```
     *
     * @example Stream would be empty without the step
     * ```ts
     * const s = Stream.range(5, 0);
     * console.log(s.toArray()); // []
     * ```
     *
     * @group Factories
     * */
    public static range(start: number, stop: number, step?: number): Stream<number>;
    public static range(bound1: number, bound2: number = Infinity, step = 1) {
        if (arguments.length < 1 || arguments.length > 3) {
            throw new ArgumentCountError(this.range, arguments.length);
        }

        if (step == 0) {
            throw new ValueError("Stream.range(): step must not be zero")
        }

        if (arguments.length === 1) {
            return new Stream<number>(new Sequencer(rangeZeroToN(bound1)));
        }

        return new Stream<number>(new Sequencer(rangeStartStopStep(bound1, bound2, step)));
    }

    /**
     * @typeParam T The type of the elements in the Stream
     *
     * @returns An empty Stream
     *
     * @group Factories
     *
     * @example
     * ```ts
     * console.log(Stream.empty().toArray()); // []
     * */
    public static empty<T>() {
        return new Stream<T>(new Sequencer([]));
    }

    public static repeat<T>(value: T) {
        /**
         * Repeats a value indefinitely. The Stream will never be exhausted.
         * If try to consume the Stream, it will run forever. You can use the {@link Stream.take} method to
         * limit the number of elements.
         *
         * @typeParam T The type of the elements in the Stream
         *
         * @param value The value to repeat
         *
         * @returns A Stream of the repeated value
         *
         * @example Infinite Stream of 1s
         * ```ts
         * for(const x of Stream.repeat(1)) {
         *    console.log(x);
         * }
         * // Output: 1 1 1 1 1 ...
         * ```
         *
         * @example Take the first 5 elements of the infinite Stream
         * ```ts
         * const s = Stream.repeat(5).take(5);
         * console.log(s.toArray()); // [5, 5, 5, 5, 5]
         *```
         *
         * @see
         * - {@link Stream.take} - take up to `n` of elements first elements of the Stream
         *
         * @group Factories
         * */
        return new Stream<T>(new Sequencer(repeat(value)));
    }

    /**
     * Generates a Stream by applying a function to the previous value,
     * starting with the initial value. The Stream will never be exhausted.
     *
     * If try to consume the Stream, it will run forever. You can use the {@link Stream.take}
     * method to limit the number of elements.
     *
     * @typeParam T The type of the elements in the Stream
     * @param init The initial value
     * @param fn The function to apply to the previous value to get the next value
     *
     * @returns A Stream of the generated values
     *
     * @group Factories
     *
     * @example Infinite Stream of powers of 2
     * ```ts
     * for(const x of Stream.iterate(1, (x) => x * 2)) {
     *      console.log(x);
     *      if (x > 100) break;
     * }
     * // Output: 1 2 4 8 16 32 64 128
     * ```
     * */
    public static iterate<T>(init: T, fn: UnaryOperator<T>) {
        return new Stream<T>(new Sequencer(iterate(init, fn)));
    }

    /**
     * Converts the Stream to an array. This will consume the Stream.
     * If the Stream is infinite, this will produce an infinite loop.
     *
     * @returns An array of the elements in the Stream
     *
     * @example Convert a Stream to an array
     * ```ts
     * const s = Stream.range(5);
     * console.log(s.toArray()); // [0, 1, 2, 3, 4]
     * ```
     *
     * @group Collectors
     * */
    public toArray() {
        return [...this.sequencer];
    }

    /**
     * Converts the stream to a Map. This will consume the Stream.
     *
     * If the Stream is infinite, this will produce an infinite loop.
     *
     * The Stream element type
     * must be a tuple of key-value pairs. Since there is no explicit tuple type in JavaScript/TypeScript,
     * Typescript tuples are expected, that is, an array of length 2,
     * where the first element is the key and the second element is the value.
     *
     * If the Stream element type is not a tuple, a TypeError will be thrown during consumption.
     *
     * @typeParam K The type of the keys in the Map
     * @typeParam V The type of the values in the Map
     *
     * @throws TypeError if the Stream element type is not a tuple
     * This is only enforced in compile time if the Stream is typed properly.
     * The runtime check is not done prior to consumption.
     * so the error will be thrown during consumption. Use with caution with
     * {@link Stream.chain}, as it enables chaining streams of different types.
     *
     * @returns A Map constructed from the elements in the Stream
     *
     * @group Collectors
     *
     * @example Convert a Stream of key-value pairs to a Map
     * ```ts
     * const s = Stream.from([["a", 1], ["b", 2], ["c", 3]]);
     * console.log(s.toMap()); // Map(3) { 'a' => 1, 'b' => 2, 'c' => 3 }
     * ```
     * */
    public toMap<K, V>(this: Stream<[K, V]>) {
        try {
            return new Map(this.sequencer);
        } catch (e) {
            if (e instanceof TypeError) {
                throw new TypeError("Stream.toMap() requires a stream of key-value pairs");
            }
            /* istanbul ignore next */
            throw e;
        }
    }

    /**
     * Converts the Stream to a Set. This will consume the Stream.
     *
     * If the Stream is infinite, this will produce an infinite loop.
     *
     * @returns A Set constructed from the elements in the Stream
     *
     * @group Collectors
     *
     * @example Convert a Stream to a Set
     * ```ts
     * const s = Stream.range(5);
     * console.log(s.toSet()); // Set(5) { 0, 1, 2, 3, 4 }
     * ```
     * */
    public toSet() {
        return new Set(this.sequencer);
    }

    /**
     * Creates a new Stream with the first `n` elements of the original Stream skipped.
     * If the number of elements in the Stream is less than `n`, the new Stream will be empty.
     *
     * @param n The number of elements to skip
     *
     * @returns A new Stream with the first `n` elements of the original Stream skipped.
     *
     * @group Transformers
     *
     * @example Skip the first 3 elements of a Stream
     *
     * ```ts
     * const s = Stream.range(5).skip(3);
     * console.log(s.toArray()); // [3, 4]
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.take} - take the first `n` elements of the Stream
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *   - {@link Stream.toArray} - collect Stream elements into an Array
     * */
    public skip(n: number) {
        return new Stream(new Sequencer(skip(this.sequencer, n)));
    }

    /**
     * Creates a new Stream with the first `n` elements of the original Stream.
     *
     * @param n The number of elements to take
     *
     * @returns A new Stream with the first `n` elements of the original Stream.
     *
     * @group Transformers
     *
     * @example Take the first 3 elements of a Stream
     * ```ts
     * const s = Stream.range(5).take(3);
     * console.log(s.toArray()); // [0, 1, 2]
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.skip} - skip the first `n` elements of the Stream
     *   - {@link Stream.takeWhile} - take elements while a predicate is true
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *   - {@link Stream.toArray} - collect Stream elements into an Array
     * */
    public take(n: number) {
        return new Stream(new Sequencer(take(this.sequencer, n)));
    }

    /**
     * Creates a new Stream that contains all the elements of the original Stream,
     * before the first element that does not satisfy the predicate.
     *
     * @callback predicate
     * @param predicate Function used to test each element in the Stream
     *
     * @returns A new Stream that contains all the elements of the original Stream,
     *
     * @group Transformers
     *
     * @example Take the elements of a Stream while they are less than 3
     * ```ts
     * const s = Stream.range(5).(x => x < 3);
     * console.log(s.toArray()); // [0, 1, 2]
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.take} - take the first `n` elements of the Stream
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *   - {@link Stream.toArray} - collect Stream elements into an Array
     * */
    public takeWhile(predicate: Predicate<T>) {
        return new Stream(new Sequencer(takeWhile(this.sequencer, predicate)));
    }

    /**
     * Enumerates the elements in the Stream.
     * This is useful for getting the index of each element.
     *
     * Transforms the Stream of elements into a Stream of tuples,
     * where the first element of the tuple is the index
     *
     * @returns A new Stream of tuples, where the first element of the tuple is the index
     *
     * @group Transformers
     *
     * @example Enumerate the elements in a Stream
     * ```ts
     * const s = Stream.from('abc').enumerate();
     * console.log(s.toArray()); // [[0, "a"], [1, "b"], [2, "c"]]
     * ```
     *
     * @see
     * - {@link Stream.range} - create a Stream of numbers
     * - {@link Stream.toArray} - collect Stream elements into an Array
     * */
    public enumerate(): Stream<[number, T]> {
        return new Stream(new Sequencer(enumerate(this.sequencer)));
    }

    /**
     * Creates a new Stream where each element is the result of
     * applying the function `fn` to each element in the original Stream.
     *
     * @typeParam U The type of the elements in the new Stream
     *
     * @param fn The function to apply to each element in the Stream
     *
     * @returns A new Stream where each element of type `U`
     *
     * @group Transformers
     *
     * @example Map the elements in a Stream
     * ```ts
     * const s = Stream.range(5).map(x => x * 2);
     * console.log(s.toArray()); // [0, 2, 4, 6, 8]
     * ```
     *
     * @example Map the elements in a Stream of strings
     * ```ts
     * const s = Stream.from("hello").map(x => x.toUpperCase());
     * console.log(s.toArray()); // ["H", "E", "L", "L", "O"]
     * ```
     *
     * @see
     * - {@link Stream.range} - create a Stream of numbers
     * - {@link Stream.from} - create a Stream from an iterable
     * - {@link Stream.toArray} - collect Stream elements into an Array
     */
    public map<U>(fn: Function<T, U>) {
        return new Stream(new Sequencer(map(this.sequencer, fn)));
    }

    /**
     * Creates a new Stream containing only the elements of the original Stream
     * that satisfy the predicate.
     *
     * @typeParam U The type of the elements in the new Stream
     *
     * @param predicate The function to apply to each element in the Stream
     *
     * @returns A new Stream where each element of type `U`
     *
     * @group Transformers
     *
     * @example Map the elements in a Stream with index
     * ```ts
     * const s = Stream.range(5).filter(x => x % 2 === 0);
     * console.log(s.toArray()); // [0, 2, 4]
     * ```
     *
     * @see
     * - {@link Stream.range} - create a Stream of numbers
     * - {@link Stream.toArray} - collect Stream elements into an Array
     */
    public filter(predicate: Predicate<T>) {
        return new Stream(new Sequencer(filter(this.sequencer, predicate)));
    }

    /**
     * Performs a reduction on the elements of the Stream using the `fn` function.
     *
     * @typeParam U The type of the accumulator
     *
     * @param initial The initial value of the accumulator
     * @param fn The function to apply to each element in the Stream and the accumulator.
     * For each element, the function is called with the accumulator and the element as arguments.
     *
     * @returns The result of the reduction
     *
     * @remarks
     *
     * This is a terminal operation, meaning that it consumes the Stream.
     * If the Stream is infinite, this will produce an infinite loop.
     *
     * @group Terminators
     *
     * @example Sum the elements in a Stream
     * ```ts
     * const s = Stream.range(5);
     * console.log(s.fold(0, (acc, x) => acc + x)); // 10
     * ```
     *
     * @example Multiply the elements in a Stream
     * ```ts
     * const s = Stream.range(1, 6);
     * console.log(s.fold(1, (acc, x) => acc * x)); // 120
     * ```
     *
     * @example Aggregate key-value pairs in a Stream into an object
     * ```ts
     * const s = Stream.from([["a", 1], ["b", 2], ["c", 3]]);
     * console.log(s.fold({}, (acc, [k, v]) => ({...acc, [k]: v}))); // { a: 1, b: 2, c: 3 }
     * ```
     * @see
     * - Similar operations
     *   - {@link Stream.reduce} - Similar to 'fold' but without an initial value
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *   - {@link Stream.from} - create a Stream from an iterable
     *
     * */
    public fold<U>(initial: U, fn: BiFunction<U, T, U>) {
        let acc = initial;
        for (const x of this.sequencer) {
            acc = fn(acc, x);
        }
        return acc;
    }

    /**
     * Flattens a Stream of iterables into a single Stream.
     * This is useful for flattening a Stream of Streams, or a Stream of arrays.
     * The resulting Stream will contain all the elements of the original Stream of iterables.
     * The order of the elements is preserved.
     *
     * @typeParam U The type of the elements in the iterables
     *
     * @returns A new Stream containing all the elements of the original Stream of iterables
     *
     * @group Transformers
     *
     * @example Flatten a Stream of arrays
     * ```ts
     * const s = Stream.from([[1, 2], [3, 4], [5, 6]]);
     * console.log(s.flatten().toArray()); // [1, 2, 3, 4, 5, 6]
     * ```
     *
     * @example Flatten a Stream of Streams
     * ```ts
     * const s = Stream.range(3).map(x => Stream.range(x));
     * console.log(s.flatten().toArray()); // [0, 0, 1, 0, 1, 2]
     * ```
     *
     * @see
     * - {@link Stream.from} - create a Stream from an iterable
     * - {@link Stream.toArray} - collect Stream elements into an Array
     * */
    public flatten<U>(this: Stream<Iterable<U>>) {
        return new Stream(new Sequencer(flatten(this.sequencer)));
    }

    /**
     * Creates a new Stream by zipping together the elements of the iterables.
     *
     * The resulting Stream will contain tuples of the elements of the original iterables.
     * The resulting Stream will have the length of the shortest iterable.
     *
     * @typeParam T The type of the elements in the original Stream
     * @typeParam U The type of the elements in the other iterable
     *
     * @param iterables Iterables to zip together
     *
     * @returns A new Stream containing tuples of the elements of the original iterables
     *
     * @example Zip two Streams together
     * ```ts
     * const s1 = Stream.range(5);
     * const s2 = Stream.range(5, 10);
     * const s = Stream.zip(s1, s2);
     * console.log(s.toArray()); // [[0, 5], [1, 6], [2, 7], [3, 8], [4, 9]]
     * ```
     *
     * @see
     * - {@link Stream.toArray} - collect Stream elements into an Array
     *
     * @group Factories
     * */
    public static zip<T extends Array<any>>(...iterables: { [I in keyof T]: Iterable<T[I]> }): Stream<T> {
        return new Stream(new Sequencer(zip<T>(iterables)));
    }

    /**
     * Creates a new stream by chunking the elements of the original Stream into chunks of size `n`.
     * The resulting Stream will contain arrays of the elements of the original Stream.
     * The last chunk may contain fewer than `n` elements.
     *
     * @param n The size of each chunk
     *
     * @returns A new Stream containing arrays of the elements of the original Stream
     *
     * @group Transformers
     *
     *
     * @example Chunk a Stream into arrays of size 3
     * ```ts
     * const s = Stream.range(10).chunk(3);
     * console.log(s.toArray()); // [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]
     * ```
     *
     * @example Chunk a Stream into arrays of size 2
     * ```ts
     * const s = Stream.range(9).chunk(2);
     * console.log(s.toArray()); // [[0, 1], [2, 3], [4, 5], [6, 7], [8]]
     * ```
     *
     * @ see
     * - Similar operations
     *   - {@link Stream.slide}
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *   - {@link Stream.toArray} - collect Stream elements into an Array
     * */
    public chunk(this: Stream<T>, n: number) {
        if (n <= 0) throw new ValueError("Stream.chunk(): n must be greater than zero");
        return new Stream(new Sequencer(chunk(this.sequencer, n)));
    }

    /**
     * Creates a new Stream by sliding a window of size `n` over the elements of the original Stream,
     * with a step of `step`. The resulting Stream will contain arrays of the elements of the original Stream.
     *
     * @param n The size of the window
     *
     * @returns A new Stream containing arrays of the elements of the original Stream
     *
     * @group Transformers
     *
     * @example Slide a window of size 3 over a Stream
     * ```ts
     * const s = Stream.range(5).slide(3);
     * console.log(s.toArray()); // [[0, 1, 2], [1, 2, 3], [2, 3, 4]]
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.chunk}
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *   - {@link Stream.toArray} - collect Stream elements into an Array
     * */
    public slide(this: Stream<T>, n: number) {
        if (n <= 0) throw new ValueError("Stream.chunk(): n must be greater than zero");
        return new Stream(new Sequencer(slide(this, n)));
    }

    /**
     * Compares the elements of the Stream with the elements of another Stream.
     * The comparison is done lexicographically, that is, the first elements of each Stream are compared,
     * then the second elements, and so on.
     *
     * @typeParam U The type of the elements in the other Stream
     *
     * @param other The other Stream to compare with
     *
     * @returns
     * - 0 if this Stream is equal to the other Stream
     * - -1 if this Stream is less than the other Stream
     * - 1 if this Stream is greater than the other Stream
     *
     * @group Terminators
     *
     * @example Compare two equal Streams
     * ```ts
     * const s1 = Stream.range(5);
     * const s2 = Stream.range(5);
     * console.log(s1.compare(s2)); // 0
     * ```
     *
     * @example Compare two Streams of letters
     * ```ts
     * const s1 = Stream.from("aab");
     * const s2 = Stream.from("abb");
     * console.log(s1.compare(s2)); // -1
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.compareBy}
     *   - {@link Stream.eqBy}
     *   - {@link Stream.eq}
     *   - {@link Stream.ne}
     *   - {@link Stream.lt}
     *   - {@link Stream.le}
     *   - {@link Stream.gt}
     *   - {@link Stream.ge}
     * - Mention in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *   - {@link Stream.from} - create a Stream from an iterable
     * */
    public compare<U>(this: Stream<U>, other: Stream<U>) {
        const iterator1 = this.sequencer[Symbol.iterator]();
        const iterator2 = other.sequencer[Symbol.iterator]();
        while (true) {
            const {value: x1, done: done1} = iterator1.next();
            const {value: x2, done: done2} = iterator2.next();
            if (done1 && done2) return 0;
            if (done1) return -1;
            if (done2) return 1;
            if (x1 < x2) return -1;
            if (x1 > x2) return 1;
        }
    }

    /**
     * Compares the elements of the Stream with the elements of another Stream
     * using a key function to map the elements to a comparable value.
     *
     * Behaves like {@link Stream.compare}, but uses a key function to map the elements
     * to a comparable value.
     *
     * @typeParam U The type of the elements in the other Stream
     *
     * @param other The other Stream to compare with
     * @param fn The function to extract the key by which to compare the elements
     *
     * @returns
     * - 0 if this Stream is equal to the other Stream
     * - -1 if this Stream is less than the other Stream
     * - 1 if this Stream is greater than the other Stream
     *
     * @group Terminators
     *
     * @example Compare two Streams of strings by length
     * ```ts
     * const s1 = Stream.from(["a", "aa", "aaa"]);
     * const s2 = Stream.from(["aa", "aaa", "aaaa"]);
     * console.log(s1.compareBy(s2, x => x.length)); // -1
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.compare}
     *   - {@link Stream.eqBy}
     *   - {@link Stream.eq}
     *   - {@link Stream.ne}
     *   - {@link Stream.lt}
     *   - {@link Stream.le}
     *   - {@link Stream.gt}
     *   - {@link Stream.ge}
     * - Mentioned in examples
     *   - {@link Stream.from} - create a Stream from an iterable
     *   - {@link Stream.range} - create a Stream of numbers
     * */
    public compareBy<U>(this: Stream<T>, other: Stream<T>, fn: Function<T, U>) {
        return this.map(fn).compare(other.map(fn));
    }

    /**
     * Checks if the elements of the Stream are equal to the elements of another Stream.
     *
     * @param other The other Stream to compare with
     *
     * @returns `true` if the Streams are equal, `false` otherwise
     *
     * @group Terminators
     *
     * @example Check if two Streams are equal
     * ```ts
     * const s1 = Stream.range(5);
     * const s2 = Stream.range(5);
     * console.log(s1.eq(s2)); // true
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.compare}
     *   - {@link Stream.compareBy}
     *   - {@link Stream.eqBy}
     *   - {@link Stream.ne}
     *   - {@link Stream.lt}
     *   - {@link Stream.le}
     *   - {@link Stream.gt}
     *   - {@link Stream.ge}
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     * */
    public eq(other: Stream<T>) {
        return this.compare(other) === 0;
    }

    /**
     * Checks if the elements of the Stream are equal to the elements of another Stream
     * by comparing the elements using a key function.
     *
     * @param other The other Stream to compare with
     * @param fn The function to extract the key by which to compare the elements
     *
     * @returns `true` if the Streams are equal, `false` otherwise
     *
     * @group Terminators
     *
     * @example Check if two Streams of strings are equal by length
     * ```ts
     * const s1 = Stream.from(["a", "aa", "aaa"]);
     * const s2 = Stream.from(["aa", "aaa", "aaaa"]);
     * console.log(s1.eqBy(s2, x => x.length)); // false
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.compare}
     *   - {@link Stream.compareBy}
     *   - {@link Stream.eq}
     *   - {@link Stream.ne}
     *   - {@link Stream.lt}
     *   - {@link Stream.le}
     *   - {@link Stream.gt}
     *   - {@link Stream.ge}
     * - Mentioned in examples
     *   - {@link Stream.from} - create a Stream from an iterable
     * */
    public eqBy<U>(other: Stream<T>, fn: Function<T, U>) {
        return this.compareBy(other, fn) === 0;
    }

    /**
     * Checks if the elements of the Stream are not equal to the elements of another Stream.
     *
     * @param other The other Stream to compare with
     *
     * @returns `true` if the Streams are not equal, `false` otherwise
     *
     * @group Terminators
     *
     * @example Check if two Streams are not equal
     * ```ts
     * const s1 = Stream.range(5);
     * const s2 = Stream.range(5);
     * console.log(s1.ne(s2)); // false
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.compare}
     *   - {@link Stream.compareBy}
     *   - {@link Stream.eq}
     *   - {@link Stream.eqBy}
     *   - {@link Stream.lt}
     *   - {@link Stream.le}
     *   -  {@link Stream.gt}
     *   - {@link Stream.ge}
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     * */
    public ne(other: Stream<T>) {
        return this.compare(other) !== 0;
    }

    /**
     * Checks if the elements of the Stream are not equal to the elements of another Stream
     *
     * @param other The other Stream to compare with
     *
     * @returns `true` if the Streams are not equal, `false` otherwise
     *
     * @group Terminators
     *
     * @see
     * - Similar operations
     *   - {@link Stream.compare}
     *   - {@link Stream.compareBy}
     *   - {@link Stream.eqBy}
     *   - {@link Stream.eq}
     *   - {@link Stream.ne}
     *   - {@link Stream.le}
     *   - {@link Stream.gt}
     *   - {@link Stream.ge}
     */
    public lt(other: Stream<T>) {
        return this.compare(other) < 0;
    }

    /**
     * Checks if the elements of the Stream are less than or equal to the elements of another Stream
     *
     * @param other The other Stream to compare with
     *
     * @returns `true` if the Streams are less than or equal, `false` otherwise
     *
     * @group Terminators
     *
     * @see Similar operations
     * - {@link Stream.compare}
     * - {@link Stream.compareBy}
     * - {@link Stream.eqBy}
     * - {@link Stream.eq}
     * - {@link Stream.ne}
     * - {@link Stream.lt}
     * - {@link Stream.gt}
     * - {@link Stream.ge}
     *
     */
    public le(other: Stream<T>) {
        return this.compare(other) <= 0;
    }

    /**
     * Checks if the elements of the Stream are greater than the elements of another Stream
     *
     * @param other The other Stream to compare with
     *
     * @returns `true` if the Streams are greater, `false` otherwise
     *
     * @group Terminators
     *
     * @see Similar operations
     * - {@link Stream.compare}
     * - {@link Stream.compareBy}
     * - {@link Stream.eqBy}
     * - {@link Stream.eq}
     * - {@link Stream.ne}
     * - {@link Stream.lt}
     * - {@link Stream.le}
     * - {@link Stream.ge}
     */
    public gt(other: Stream<T>) {
        return this.compare(other) > 0;
    }

    /**
     * Checks if the elements of the Stream are greater than or equal to the elements of another Stream
     *
     * @param other The other Stream to compare with
     *
     * @returns `true` if the Streams are greater than or equal, `false` otherwise
     *
     * @group Terminators
     *
     * @see Similar operations
     * - {@link Stream.compare}
     * - {@link Stream.compareBy}
     * - {@link Stream.eqBy}
     * - {@link Stream.eq}
     * - {@link Stream.ne}
     * - {@link Stream.lt}
     * - {@link Stream.le}
     * - {@link Stream.gt}
     */
    public ge(other: Stream<T>) {
        return this.compare(other) >= 0;
    }

    /**
     * Checks if the elements of the Stream are sorted in ascending order.
     *
     * @param reverse If true, checks if the elements are sorted in descending order
     * @param key A function to extract the key by which to compare the elements
     *
     * @returns `true` if the elements are sorted, `false` otherwise
     *
     * @group Terminators
     *
     * @example Check if a Stream is sorted
     * ```ts
     * const s = Stream.range(5);
     * console.log(s.isSorted()); // true
     * ```
     *
     * @example Check if a Stream of strings is sorted by length
     * ```ts
     * const s = Stream.from(["a", "aa", "aaa"]);
     * console.log(s.isSortedBy(false, s=> s.length)); // true
     * ```
     *
     * @example Check if a Stream is sorted in descending order
     * ```ts
     * const s = Stream.range(5, 0, -1);
     * console.log(s.isSorted(true)); // true
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.isSortedBy}
     * - Mentioned in examples
     *   - {@link Stream.from} - create a Stream from an iterable
     * */
    public isSorted<U>(this: Stream<T>, reverse = false, key?: Function<T, U>): boolean {
        if (key) {
            return this.map(key).isSorted(reverse);
        }

        const iterator = this.sequencer[Symbol.iterator]();
        let {value, done} = iterator.next();
        if (done) return true;
        let prev = value;

        /* if (reverse) while(true) { ... } */
        while (reverse) {
            ({value, done} = iterator.next());
            if (done) return true;
            if (prev < value) return false;
            prev = value;
        }

        /* if (!reverse) while(true) { ... } */
        while (true) {
            ({value, done} = iterator.next());
            if (done) return true;
            if (prev > value) return false;
            prev = value;
        }
    }

    /**
     * Checks if the elements of the Stream are sorted in ascending order.
     *
     * @param reverse If true, checks if the elements are sorted in descending order
     * @param fn A function to compare the elements
     *
     * @returns `true` if the elements are sorted, `false` otherwise
     *
     * @group Terminators
     *
     * @example Check if a Stream is sorted
     * ```ts
     * const s = Stream.from(["a", "aa", "aaa"]);
     * console.log(s.isSortedBy(s=> s.length)); // true
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.isSorted}
     * - Mentioned in examples
     *   - {@link Stream.from} - create a Stream from an iterable
     * */
    public isSortedBy(this: Stream<T>, fn: Comparator<T>, reverse: boolean = false): boolean {
        const iterator = this.sequencer[Symbol.iterator]();
        let {value, done} = iterator.next();
        if (done) return true;
        let prev = value;

        /* if (reverse) while(true) { ... } */
        while (reverse) {
            ({value, done} = iterator.next());
            if (done) return true;
            if (fn(prev, value) < 0) return false;
            prev = value;
        }

        /* if (!reverse) while(true) {...} */
        while (true) {
            ({value, done} = iterator.next());
            if (done) return true;
            if (fn(prev, value) > 0) return false;
            prev = value;
        }
    }

    /**
     * Chains the elements of the Stream with the elements of another iterable.
     * The resulting Stream will contain all the elements of the original Stream,
     * followed by the elements of the other iterable.
     *
     * @typeParam U The type of the elements in the other iterable
     *
     * @param iterable The other iterable to chain with
     *
     * @returns A new Stream containing all the elements of the original Stream,
     * and the elements of the other iterable
     *
     * @group Transformers
     *
     * @example Chain a Stream with an array
     * ```ts
     * const s = Stream.range(3).chain([3, 4, 5]);
     * console.log(s.toArray()); // [0, 1, 2, 3, 4, 5]
     * ```
     *
     * @see
     * - {@link Stream.range} - create a Stream of numbers
     * - {@link Stream.toArray} - collect Stream elements into an Array
     *
     * */
    public chain<U>(iterable: Iterable<U>) {
        const {sequencer} = this;
        return new Stream(new Sequencer((function* chain() {
            yield* sequencer;
            yield* iterable;
        })()));
    }

    /**
     * Reduction operation that reduces the elements of the Stream to a single value.
     * It is similar to {@link Stream.fold}, but it does not require an initial value.
     * Instead, it uses the first element of the Stream as the initial value.
     *
     * @param fn The function to apply to each element in the Stream and the accumulator.
     * For each element, the function is called with the accumulator and the element as arguments.
     *
     * @returns
     * - The result of the reduction, if the Stream is not empty
     * - `undefined` if the Stream is empty
     *
     * @group Terminators
     *
     * @example Sum the elements in a Stream
     * ```ts
     * const s = Stream.range(5);
     * console.log(s.reduce((acc, x) => acc + x)); // 10
     * ```
     *
     * @example Factorial of n
     * ```ts
     * function factorial(n: number) {
     *      return Stream.range(n, 0, -1).reduce((acc, x) => acc * x);
     * }
     *
     * console.log(factorial(5)); // 120
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.fold} - Similar to 'reduce' but with an initial value
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     * */
    public reduce(fn: BiOperator<T>): T | undefined {
        const iterator = this.sequencer[Symbol.iterator]();
        const {value, done} = iterator.next();
        if (done) return undefined;

        let acc = value;

        while (true) {
            let {value, done} = iterator.next();
            if (done) return acc;
            acc = fn(acc, value);
        }
    }

    /**
     * Adds the elements of the Stream of numbers.
     *
     * @returns The sum of the elements in the Stream
     *
     * @group Terminators
     *
     * @example Sum the first 10 odd numbers
     *
     * ```ts
     * const s = Stream.range(1, 20, 2);
     * console.log(s.sum()); // 100
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.product}
     *   - {@link Stream.max}
     *   - {@link Stream.min}
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *
     *
     * */
    public sum(this: Stream<number>) {
        let acc = 0;
        for (const x of this.sequencer) {
            acc += x;
        }
        return acc;
    }

    /**
     * Multiplies the elements of the Stream of numbers.
     *
     * @returns The product of the elements in the Stream
     *
     * @group Terminators
     *
     * @example Multiply the first 5 numbers
     *
     * ```ts
     * const s = Stream.range(1, 6);
     * console.log(s.product()); // 120
     * ```
     * @see
     * - Similar operations
     *   - {@link Stream.sum}
     *   - {@link Stream.max}
     *   - {@link Stream.min}
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *
     * */
    public product(this: Stream<number>) {
        let acc = 1;
        for (const x of this.sequencer) {
            acc *= x;
        }
        return acc;
    }

    /**
     * Finds the maximum element in the Stream.
     *
     * @returns The maximum element in the Stream
     *
     * @group Terminators
     *
     * @example Find the maximum element in a Stream
     * ```ts
     * const s = Stream.range(5);
     * console.log(s.max()); // 4
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.sum}
     *   - {@link Stream.product}
     *   - {@link Stream.min}
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *
     * */
    public max(this: Stream<number>) {

        return this.reduce(Math.max);
    }

    /**
     * Finds the minimum element in the Stream.
     *
     * @returns The minimum element in the Stream
     *
     * @group Terminators
     *
     * @example Find the minimum element in a Stream
     * ```ts
     * const s = Stream.range(5);
     * console.log(s.min()); // 0
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.sum}
     *   - {@link Stream.product}
     *   - {@link Stream.max}
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *
     * */
    public min(this: Stream<number>) {
        return this.reduce(Math.min);
    }

    /**
     * Counts the elements in the Stream.
     *
     * @returns The number of elements in the Stream
     *
     * @group Terminators
     *
     * @example Count the elements in a Stream
     * ```ts
     * const s = Stream.range(5);
     * console.log(s.count()); // 5
     * ```
     *
     * @example Count the elements that satisfy a predicate
     * ```ts
     * const s = Stream.range(5).filter(x => x % 2 === 0);
     * console.log(s.count()); // 3
     * ```
     *
     * @see
     * - {@link Stream.range} - create a Stream of numbers
     * - {@link Stream.filter} - filter the elements in a Stream by a predicate
     * */
    public count() {
        return this.fold(0, (acc, _) => acc + 1);
    }

    /**
     * Joins the elements of the Stream into a single string,
     * similar to the `Array.prototype.join` method.
     *
     * @param separator The separator to use between the elements
     *
     * @returns A string containing the elements of the Stream
     *
     * @group Terminators
     *
     * @example Join the elements in a Stream
     * ```ts
     * const s = Stream.from(["a", "b", "c"]);
     * console.log(s.join()); // "abc"
     * ```
     *
     * @example Join the elements in a Stream with a separator
     * ```ts
     * const s = Stream.from(["a", "b", "c"]);
     * console.log(s.join("-")); // "a-b-c"
     * ```
     *
     * @see
     * - {@link Stream.from} - create a Stream from an iterable
     * */
    public join(this: Stream<string>, separator = "") {
        if (separator == "") {
            return this.reduce((acc, x) => acc + x) ?? "";
        }
        return this.reduce((acc, x) => acc + separator + x) ?? "";
    }

    /**
     * Calls a function for each element in the Stream.
     *
     * @param fn The function to call for each element in the Stream
     *
     * @group Terminators
     *
     * @example Print the elements in a Stream
     * ```ts
     * const s = Stream.range(5);
     * s.forEach(console.log);
     * // Output:
     * // 0
     * // 1
     * // 2
     * // 3
     * // 4
     * ```
     *
     * @see
     * - {@link Stream.range} - create a Stream of numbers
     * */
    public forEach(fn: Consumer<T>) {
        for (const x of this.sequencer) fn(x);
    }

    /**
     * Checks if all the elements in the Stream are `true`.
     * It is a short-circuiting operation, meaning that it will stop
     * as soon as it finds a `false` element.
     *
     * @returns
     * - `true` if the Stream is empty
     * - `true` if all the elements in the Stream are `true`, `false` otherwise
     *
     * @group Terminators
     *
     * @example Check if all the elements in an array are even
     * ```ts
     * const s = Stream.range(5)
     *      .filter(x => x % 2 === 0)
     *      .map(x => x % 2 === 0);
     * console.log(s.all()); // true
     * ```
     *
     * @see
     * - Similar operations
     *  - {@link Stream.allMap}
     *  - {@link Stream.any}
     *  - {@link Stream.anyMap}
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *   - {@link Stream.filter} - filter the elements in a Stream by a predicate
     *   - {@link Stream.map} - transform the elements in a Stream using a function
     * */
    public all(this: Stream<boolean>) {
        const iterator = this.sequencer[Symbol.iterator]();
        while (true) {
            const {value, done} = iterator.next();
            if (done) return true;
            if (!value) return false;
        }
    }

    /**
     * Checks if all the elements in the Stream satisfy the predicate.
     * This is similar to {@link Stream.all}, but it uses a predicate to check the elements.
     * It is a short-circuiting operation, meaning that it will stop as soon as it finds an element
     * that does not satisfy the predicate.
     *
     * This operation is equivalent to calling {@link Stream.map} with and then {@link Stream.all}.
     *
     * @param fn The function to apply to each element in the Stream
     *
     * @returns
     * - `true` if the Stream is empty
     * - `true` if all the elements in the Stream satisfy the predicate, `false` otherwise
     *
     * @group Terminators
     *
     * @example Check if all the elements in a Stream are even
     * ```ts
     * const s = Stream.range(5).filter(x => x % 2 === 0);
     * console.log(s.allMap(x => x % 2 === 0)); // true
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.all}
     *   - {@link Stream.any}
     *   - {@link Stream.anyMap}
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *   - {@link Stream.filter} - filter the elements in a Stream by a predicate
     *   - {@link Stream.map} - transform the elements in a Stream using a function
     * */
    public allMap(this: Stream<T>, fn: (x: T) => boolean) {
        const iterator = this.sequencer[Symbol.iterator]();
        while (true) {
            const {value, done} = iterator.next();
            if (done) return true;
            if (!fn(value)) return false;
        }
    }

    /**
     * Checks if any of the elements in the Stream are `true`.
     * It is a short-circuiting operation, meaning that it will stop
     * as soon as it finds a `true` element.
     *
     * @returns
     * - `false` if the Stream is empty
     * - true` if any of the elements in the Stream are `true`, `false` otherwise
     *
     * @group Terminators
     *
     * @example Check if any of the elements in an array are even
     * ```ts
     * const s = Stream.range(5)
     *      .filter(x => x % 2 === 0)
     *      .map(x => x % 2 === 0);
     * console.log(s.any()); // true
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.all}
     *   - {@link Stream.allMap}
     *   - {@link Stream.anyMap}
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *   - {@link Stream.filter} - filter the elements in a Stream by a predicate
     *   - {@link Stream.map} - transform the elements in a Stream using a function
     * */
    public any(this: Stream<boolean>) {
        const iterator = this.sequencer[Symbol.iterator]();
        while (true) {
            const {value, done} = iterator.next();
            if (done) return false;
            if (value) return true;
        }
    }

    /**
     * Checks if any of the elements in the Stream satisfy the predicate.
     * This is similar to {@link Stream.any}, but it uses a predicate to check the elements.
     * It is a short-circuiting operation, meaning that it will stop as soon as it finds an element
     * that satisfies the predicate.
     *
     * This operation is equivalent to calling {@link Stream.map} with and then {@link Stream.any}.
     *
     * @param fn The function to apply to each element in the Stream
     *
     * @returns
     * - `false` if the Stream is empty
     * - `true` if any of the elements in the Stream satisfy the predicate, `false` otherwise
     *
     * @group Terminators
     *
     * @example Check if any of the elements in a Stream are odd
     * ```ts
     * const s = Stream.range(5).filter(x => x % 2 === 0);
     * console.log(s.anyMap(x => x % 2 === 0)); // false
     * ```
     *
     * @see
     * - Similar operations
     *   - {@link Stream.all}
     *   - {@link Stream.allMap}
     *   - {@link Stream.any}
     * - Mentioned in examples
     *   - {@link Stream.range} - create a Stream of numbers
     *   - {@link Stream.filter} - filter the elements in a Stream by a predicate
     * */
    public anyMap(this: Stream<T>, fn: (x: T) => boolean) {
        const iterator = this.sequencer[Symbol.iterator]();
        while (true) {
            const {value, done} = iterator.next();
            if (done) return false;
            if (fn(value)) return true;
        }
    }

    /**
     * Finds the first element in the Stream that satisfies the predicate.
     * If no element satisfies the predicate, returns `undefined`.
     *
     * @param predicate The function to apply to each element in the Stream
     *
     * @returns
     * The first element in the Stream that satisfies the predicate,
     * or `undefined` if no element satisfies the predicate
     *
     * @group Terminators
     *
     * @example Find the first prime number larger than 20
     * ```ts
     * const isPrime = require('is-prime-number'); // npm install is-prime-number
     * const x = Stream.range(20, Infinity).findFirst(isPrime);
     * console.log(x); // 23
     * ```
     *
     * @see
     * - {@link Stream.range} - create a Stream of numbers
     * - {@link https://www.npmjs.com/package/is-prime-number | `is-prime-number`} - prime number checker library
     * */
    public findFirst(predicate: (x: T) => boolean): T | undefined {
        for (const x of this.sequencer) {
            if (predicate(x)) return x;
        }
        return undefined;
    }

    /**
     * Finds the last element in the Stream that satisfies the predicate.
     * If no element satisfies the predicate, returns `undefined`.
     *
     * @param predicate The function to apply to each element in the Stream
     *
     * @returns
     * The last element in the Stream that satisfies the predicate,
     * or `undefined` if no element satisfies the predicate
     *
     * @group Terminators
     *
     * @example Find the last prime number smaller than 20
     * ```ts
     * const isPrime = require('is-prime-number'); // npm install is-prime-number
     * const x = Stream.range(20).findLast(isPrime);
     * console.log(x); // 19
     * ```
     *
     * @see
     * - {@link Stream.range} - create a Stream of numbers
     * */
    public findLast(predicate: (x: T) => boolean): T | undefined {
        let result: T | undefined = undefined;
        for (const x of this.sequencer) {
            if (predicate(x)) result = x;
        }
        return result;
    }
}