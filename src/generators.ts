import {type Predicate, type Function, UnaryOperator} from './types';

/**
 * @internal
 * Create a new generator that yields numbers in the range [0, `stop`).
 *
 * @param stop - The upper bound of the range
 *
 * @returns A new generator that yields numbers in the range [0, `stop`).
 * */
export function* rangeZeroToN(stop: number): Generator<number> {
    for (let i = 0; i < stop; i++) yield i;
}

/**
 * @internal
 * Create a new generator that yields numbers in the range [`start`, `stop`) if `start` < `stop`,
 * and [`stop`, `start`] if `start` > `stop`, with a given `step`.
 *
 * @param start - The lower bound of the range
 * @param stop - The upper bound of the range
 * @param step - The step size
 *
 * @returns A new generator that yields numbers in the range [`start`, `stop`)
 * */
export function rangeStartStopStep(start: number, stop: number, step: number): Generator<number> {
    if (start < stop) {
        return rangeIncreasing(start, stop, step);
    } else {
        return rangeDecreasing(start, stop, step);
    }
}

/**
 * @internal
 *
 * Create a new generator that yields numbers in the range [`start`, `stop`) with a given `step`.
 *
 * @param start - The lower bound of the range
 * @param stop - The upper bound of the range
 * @param step - The step size, should be positive, otherwise the generator will not yield any values
 *
 * @returns A new generator that yields numbers in the range [`start`, `stop`)
 * */
function* rangeIncreasing(start: number, stop: number, step: number): Generator<number> {
    for (let val = start; val < stop; val += step) yield val;
}

/**
 * @internal
 *
 * Create a new generator that yields numbers in the range [`stop`, `start`) with a given `step`.
 *
 * @param start - The lower bound of the range
 * @param stop - The upper bound of the range
 * @param step - The step size, should be negative, otherwise the generator will not yield any values
 *
 * @returns A new generator that yields numbers in the range [`stop`, `start`)
 * */
function* rangeDecreasing(start: number, stop: number, step: number): Generator<number> {
    for (let val = start; val > stop; val += step) yield val;
}

/**
 * @internal
 *
 * Create a new generator that yields the same value indefinitely.
 *
 * @typeParam T The type of the value to yield
 *
 * @param value - The value to yield
 *
 * @returns A new generator that yields the `value` indefinitely.
* */
export function* repeat<T>(value: T): Generator<T> {
    while (true) yield value;
}

/**
 * @internal
 *
 * Create a new generator that yields values generated by applying the function to the previous value
 * starting with the initial value.
 *
 * @typeParam T The type of the value to yield
 *
 * @param init - Initial value
 * @param fn - Function to apply to the previous value to get the next value
 *
 * @returns A new generator that yields the `value` `n` times.
 *
 * @example
 * ```ts
 * const gen = iterate(1, (x) => x * 2);
 * console.log([...take(gen, 5)]); // [1, 2, 4, 8, 16]
 * ```
 * */
export function* iterate<T>(init: T, fn : UnaryOperator<T>): Generator<T> {
    let value = init;
    while (true) {
        yield value;
        value = fn(value);
    }
}


/**
 * @internal
 *
 * Create a new generator that ignores the first `n` elements of the input iterable.
 *
 * @typeParam T The element type of the input iterable
 *
 * @param iterable - The input iterable
 * @param count - The number of elements to skip
 *
 * @returns A new generator with the first `n` elements of the input iterable skipped.
 * */
export function* skip<T>(iterable: Iterable<T>, count: number): Generator<T> {
    let i = 0;
    for (const value of iterable) {
        if (i++ < count) continue;
        yield value;
    }
}

/**
 * @internal
 *
 * Create a new generator that yields the first `n` elements of the input iterable.
 *
 * @typeParam T The element type of the input iterable
 *
 * @param iterable - The input iterable
 * @param count - The number of elements to take
 *
 * @returns A new generator with the first `n` elements of the input iterable.
 * */
export function* take<T>(iterable: Iterable<T>, count: number): Generator<T> {
    let i = 0;
    for (const value of iterable) {
        if (i++ >= count) break;
        yield value;
    }
}

/**
 * @internal
 *
 * Create a new generator that yields elements from the input iterable as long as the predicate is true.
 *
 * @typeParam T The element type of the input iterable
 *
 * @param iterable - The input iterable
 * @param predicate - The predicate function
 *
 * @returns A new generator with elements from the input iterable as long as the predicate is true.
 * */
export function* takeWhile<T>(iterable: Iterable<T>, predicate: Predicate<T>): Generator<T> {
    for (const x of iterable) {
        if (!predicate(x)) return;
        yield x;
    }
}

/**
 * @internal
 *
 * Create a new generator that yields elements from the input iterable with their index.
 * New elements are tuples of the form `[index, value]`.
 *
 * @typeParam T The element type of the input iterable
 *
 * @param iterable - The input iterable
 *
 * @returns A new generator which has elements from the input iterable with their index.
 * */
export function* enumerate<T>(iterable: Iterable<T>): Generator<[number, T]> {
    let i = 0;
    for (const value of iterable) {
        yield [i++, value];
    }
}

/**
 * @internal
 *
 * Creates a new generator that yields results of the mapping function
 * applied to the elements of the input iterable.
 *
 * @param iterable iterable to transform
 * @param func mapping function
 *
 * @typeParam T The element type of the input iterable
 * @typeParam U The element type of the output iterable
 *
 * @returns A new generator that yields results of the mapping function
 */
export function* map<T, U>(iterable: Iterable<T>, func: Function<T, U>): Generator<U> {
    for (const value of iterable) {
        yield func(value);
    }
}

/**
 * @internal
 *
 * Create a new generator that yields elements from the input iterable that satisfy the predicate.
 *
 * @typeParam T The element type of the input iterable
 *
 * @param iterable - The input iterable
 * @param predicate - The predicate function
 *
 * @returns A new generator with elements from the input iterable that satisfy the predicate.
 * */
export function* filter<T>(iterable: Iterable<T>, predicate: Predicate<T>): Generator<T> {
    for (const x of iterable) {
        if (predicate(x)) yield x;
    }
}

/**
 * @internal
 *
 * Creates a new generator that flattens the input iterable.
 * Flattening means that the generator yields elements of the inner iterables, one level deep.
 *
 * @typeParam T The element type of the elements of iterables in the input iterable
 *
 * @param iterable - The input iterable
 *
 * @returns A new generator with elements from the iterables in the input iterable
 *
 * @example
 * ```typescript
 * const input = [[1, 2], [3, 4], [5, 6]];
 * const result = [...flatten(input)];
 *
 * console.log(result); // [1, 2, 3, 4, 5, 6]
 * ```
 * */
export function* flatten<T>(iterable: Iterable<Iterable<T>>): Generator<T, void, undefined> {
    for (const inner of iterable) {
        yield* inner;
    }
}

/**
 * @internal
 *
 * Returns a new generator that yields elements that are tuples of
 * respective elements from the input iterables.
 *
 * The generator stops when the shortest input iterable is exhausted.
 *
 * @param iterables - The input iterables
 *
 * @typeParam T The element types of the input iterables as a tuple, as well as the
 * type of the yielded tuples.
 *
 * @returns A new generator
 *
 * */
export function* zip<T extends any[]>(iterables: { [I in keyof T]: Iterable<T[I]> }): Generator<T, void, undefined> {
    const iterators = iterables.map((iterable) => iterable[Symbol.iterator]());
    while (true) {
        const values = iterators.map((iterator) => iterator.next());
        if (values.some(({done}) => done)) return;
        yield values.map(({value}) => value) as T;
    }
}

/**
 * @internal
 *
 * Returns a new generator that yields elements that are arrays of size `n`
 * grouped from the input iterable, by taking `n` elements at a time.
 *
 * The last group may have less than `n` elements.
 *
 * @typeParam T The element type of the input iterable
 *
 * @param iterable - The input iterable
 * @param n - The size of the groups
 *
 * Returns a new generator yielding arrays of size `n` grouped from the input iterable,
 * of type `T[]`.
 *
 * @example
 * ```typescript
 * const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
 * const result = [...chunk(input, 3)];
 * console.log(result); // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
 * ```
 * */
export function* chunk<T>(iterable: Iterable<T>, n: number): Generator<T[], void, undefined> {
    let buffer: T[] = [];
    for (const x of iterable) {
        buffer.push(x);
        if (buffer.length === n) {
            yield buffer;
            buffer = [];
        }
    }
    if (buffer.length > 0) yield buffer;
}


/**
 * @internal
 *
 * Returns a new generator that yields elements that are arrays of size `n`,
 * grouped from the input iterable, by moving the window by `step` elements at a time.
 *
 * @typeParam T The element type of the input iterable
 *
 * @param iterable - The input iterable
 * @param n - The size of the groups
 *
 * @returns A new generator yielding arrays of size `n` of type `T[]`,
 * grouped from the input iterable, by moving the window by `step` elements at a time.
 * */
export function* slide<T>(iterable: Iterable<T>, n: number): Generator<T[], void, undefined> {
    let buffer: T[] = [];
    for (const x of iterable) {
        buffer.push(x);
        if (buffer.length === n) {
            yield buffer;
            buffer = buffer.slice(1);
        }
    }
}