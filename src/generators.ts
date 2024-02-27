export function* rangeZeroToN(stop: number): Generator<number> {
    for (let i = 0; i < stop; i++) yield i;
}

export function rangeStartStopStep(start: number, stop: number, step: number): Generator<number> {
    if (start < stop) {
        return rangeIncreasing(start, stop, step);
    } else {
        return rangeDecreasing(start, stop, step);
    }
}

function* rangeIncreasing(start: number, stop: number, step: number): Generator<number> {
    for (let val = start; val < stop; val += step) yield val;
}

function* rangeDecreasing(start: number, stop: number, step: number): Generator<number> {
    for (let val = start; val > stop; val += step) yield val;
}

export function* repeat<T>(value: T): Generator<T> {
    while (true) yield value;
}

export function* skip<T>(iterable: Iterable<T>, count: number): Generator<T> {
    let i = 0;
    for (const value of iterable) {
        if (i++ < count) continue;
        yield value;
    }
}

export function* take<T>(iterable: Iterable<T>, count: number): Generator<T> {
    let i = 0;
    for (const value of iterable) {
        if (i++ >= count) break;
        yield value;
    }
}

export function* takeWhile<T>(iterable: Iterable<T>, predicate: (x: T) => boolean): Generator<T> {
    for (const x of iterable) {
        if (!predicate(x)) return;
        yield x;
    }
}

export function* enumerate<T>(iterable: Iterable<T>): Generator<[number, T]> {
    let i = 0;
    for (const value of iterable) {
        yield [i++, value];
    }
}

export function* map<T, U>(iterable: Iterable<T>, func: (x: T) => U): Generator<U> {
    for (const value of iterable) {
        yield func(value);
    }
}

export function* filter<T>(iterable: Iterable<T>, predicate: (x: T) => boolean): Generator<T> {
    for (const x of iterable) {
        if (predicate(x)) yield x;
    }
}

export function* flatten<T>(iterable: Iterable<Iterable<T>>): Generator<T, void, undefined> {
    for (const inner of iterable) {
        yield* inner;
    }
}

export function* zip<T extends any[]>(iterables: { [I in keyof T]: Iterable<T[I]> }): Generator<T, void, undefined> {
    const iterators = iterables.map((iterable) => iterable[Symbol.iterator]());
    while (true) {
        const values = iterators.map((iterator) => iterator.next());
        if (values.some(({done}) => done)) return;
        yield values.map(({value}) => value) as T;
    }
}

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

export function* slide<T>(iterable: Iterable<T>, n: number, step = 1): Generator<T[], void, undefined> {
    let buffer: T[] = [];
    for (const x of iterable) {
        buffer.push(x);
        if (buffer.length === n) {
            yield buffer;
            buffer = buffer.slice(step);
        }
    }
}