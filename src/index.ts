import {EmptyStreamReductionError, ArgumentCountError, ValueError} from "~/errors";
import {Sequencer} from "~/sequencer";


export type Iterableify<T> = { [K in keyof T]: Iterable<T[K]> }

export class Stream<T> extends Sequencer<T> {
    protected readonly sequencer: Sequencer<T>;

    protected constructor(sequencer: Sequencer<T>) {
        super(sequencer);
        this.sequencer = sequencer;
    }

    public static from<T>(iterable: Iterable<T>) {
        return new Stream<T>(new Sequencer(iterable));
    }

    public static of<T>(...values: T[]) {
        return new Stream<T>(new Sequencer(values));
    }

    public static range(stop: number): Stream<number>;
    public static range(start: number, stop: number, step?: number): Stream<number>;
    public static range(bound1: number, bound2: number = Infinity, step = 1) {
        if (arguments.length < 1 || arguments.length > 3) {
            throw new ArgumentCountError(this, arguments.length);
        }

        if (step == 0) {
            throw new ValueError("Stream.range(): step must not be zero")
        }

        if (arguments.length === 1) {
            return new Stream<number>(new Sequencer((function* range(): Generator<number> {
                for (let i = 0; i < bound1; i++) yield i;
            })()));
        }

        return new Stream<number>(new Sequencer((function* range() {
            if (bound1 < bound2) {
                for (let val = bound1; val < bound2; val += step) yield val;
            } else {
                for (let val = bound1; val > bound2; val += step) yield val;
            }
        })()));
    }

    public static empty<T>() {
        return new Stream<T>(new Sequencer([]));
    }

    public static repeat<T>(value: T) {
        return new Stream<T>(new Sequencer((function* repeat() {
            while (true) yield value;
        })()));
    }

    public toArray() {
        return [...this.sequencer];
    }

    public toMap<K, V>(this: Stream<[K, V]>) {
        const iterator = this.sequencer.iterator();
        const {value, done} = iterator.next();
        if (done) return new Map<K, V>();
        console.assert(value instanceof Array, "Stream.toMap() requires a stream of key-value pairs");
        return new Map<K, V>(Stream.of(value).chain(iterator));
    }

    public toSet() {
        return new Set(this.sequencer);
    }

    public skip(n: number) {
        const iterator = this.sequencer.iterator();
        return new Stream(new Sequencer((function* skip() {
            while (n-- > 0) iterator.next();
            yield* iterator;
        })()));
    }

    public take(n: number) {
        const iterator = this.sequencer.iterator();
        return new Stream(new Sequencer((function* take() {
            while (n-- > 0) {
                const {value, done} = iterator.next();
                if (done) return;
                yield value;
            }
        })()))
    }

    public takeWhile(predicate: (x: T) => boolean) {
        const {sequencer} = this;
        return new Stream(new Sequencer((function* takeWhile() {
            for (const x of sequencer) {
                if (!predicate(x)) return;
                yield x;
            }
        })()));
    }

    public enumerate(): Stream<[number, T]> {
        const {sequencer} = this;
        return new Stream(new Sequencer((function* enumerate() {
            let i = 0;
            for (const x of sequencer) yield [i++, x];
        })()));
    }

    public map<U>(fn: (x: T) => U) {
        const {sequencer} = this;
        return new Stream(new Sequencer((function* map() {
            for (const x of sequencer) yield fn(x);
        })()));
    }

    public filter(predicate: (x: T) => boolean) {
        const {sequencer} = this;
        return new Stream(new Sequencer((function* filter() {
            for (const x of sequencer) {
                if (predicate(x)) yield x;
            }
        })()));
    }

    public fold<U>(initial: U, fn: (acc: U, x: T) => U) {
        let acc = initial;
        for (const x of this.sequencer) {
            acc = fn(acc, x);
        }
        return acc;
    }

    public flatten<U>(this: Stream<Iterable<U>>) {
        const {sequencer} = this;
        return new Stream(new Sequencer((function* flatten() {
            for (const iterable of sequencer) {
                yield* iterable;
            }
        })()));
    }

    public static zip<T extends Array<any>>(...iterables: Iterableify<T>): Stream<T> {
        return new Stream(new Sequencer((function* zip() {
            const iterators = iterables.map(iterable => iterable[Symbol.iterator]());
            while (true) {
                const values = iterators.map(iterator => iterator.next());
                if (values.some(({done}) => done)) return;
                yield values.map(({value}) => value) as T;
            }
        })()));
    }

    public chunk(this: Stream<T>, n: number) {
        if (n <= 0) throw new ValueError("Stream.chunk(): n must be greater than zero");
        const {sequencer} = this;
        return new Stream(new Sequencer((function* chunk() {
            let buffer: T[] = [];
            for (const x of sequencer) {
                buffer.push(x);
                if (buffer.length === n) {
                    yield buffer;
                    buffer = [];
                }
            }
            if (buffer.length > 0) yield buffer;
        })()));
    }

    public slide(this: Stream<T>, n: number, step = 1) {
        if (n <= 0) throw new ValueError("Stream.chunk(): n must be greater than zero");
        const {sequencer} = this;

        return new Stream(new Sequencer((function* slide() {
            let buffer: T[] = [];
            for (const x of sequencer) {
                buffer.push(x);
                if (buffer.length === n) {
                    yield buffer;
                    buffer = buffer.slice(step);
                }
            }
        })()));
    }

    public compare<U>(this: Stream<U>, other: Stream<U>) {
        const iterator1 = this.sequencer.iterator();
        const iterator2 = other.sequencer.iterator();
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

    public compareBy<U>(this: Stream<T>, other: Stream<T>, fn: (x: T) => U) {
        return this.map(fn).compare(other.map(fn));
    }

    public eq(other: Stream<T>) {
        return this.compare(other) === 0;
    }

    public eqBy<U>(other: Stream<T>, fn: (x: T) => U) {
        return this.compareBy(other, fn) === 0;
    }

    public ne(other: Stream<T>) {
        return this.compare(other) !== 0;
    }

    public lt(other: Stream<T>) {
        return this.compare(other) < 0;
    }

    public le(other: Stream<T>) {
        return this.compare(other) <= 0;
    }

    public gt(other: Stream<T>) {
        return this.compare(other) > 0;
    }

    public ge(other: Stream<T>) {
        return this.compare(other) >= 0;
    }

    public isSorted<U>(this: Stream<T>, reverse = false, key?: (x: T) => U): boolean {
        if (key) {
            return this.map(key).isSorted(reverse);
        }

        const iterator = this.sequencer.iterator();
        let {value, done} = iterator.next();
        if (done) return true;
        let prev = value

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

    public isSortedBy(this: Stream<T>, fn: (x: T, y: T) => number, reverse: boolean = false): boolean {
        const iterator = this.sequencer.iterator();
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

    public chain<U>(iterable: Iterable<U>) {
        const {sequencer} = this;
        return new Stream(new Sequencer((function* chain() {
            yield* sequencer;
            yield* iterable;
        })()));
    }

    public reduce(fn: (acc: T, x: T) => T) {
        const iterator = this.sequencer.iterator();
        const first = iterator.next();

        if (first.done) throw new EmptyStreamReductionError();

        return new Stream<T>(new Sequencer<T>((function* reduceUnary() {
            yield* iterator
        })())).fold(first.value, fn);
    }

    public sum(this: Stream<number>) {
        let acc = 0;
        for (const x of this.sequencer) {
            acc += x;
        }
        return acc;
    }

    public product(this: Stream<number>) {
        let acc = 1;
        for (const x of this.sequencer) {
            acc *= x;
        }
        return acc;
    }

    public max(this: Stream<number>) {

        return this.reduce(Math.max);
    }

    public min(this: Stream<number>) {
        return this.reduce(Math.min);
    }

    public count() {
        return this.fold(0, (acc, _) => acc + 1);
    }

    public join(this: Stream<string>, separator = "") {
        return this.reduce((acc, x) => acc + separator + x);
    }

    public forEach(fn: (x: T) => void) {
        for (const x of this.sequencer) fn(x);
    }

    public all(this: Stream<boolean>) {
        const iterator = this.sequencer.iterator();
        while (true) {
            const {value, done} = iterator.next();
            if (done) return true;
            if (!value) return false;
        }
    }

    public allMap(this: Stream<T>, fn: (x: T) => boolean) {
        const iterator = this.sequencer.iterator();
        while (true) {
            const {value, done} = iterator.next();
            if (done) return true;
            if (!fn(value)) return false;
        }
    }

    public any(this: Stream<boolean>) {
        const iterator = this.sequencer.iterator();
        while (true) {
            const {value, done} = iterator.next();
            if (done) return false;
            if (value) return true;
        }
    }

    public anyMap(this: Stream<T>, fn: (x: T) => boolean) {
        const iterator = this.sequencer.iterator();
        while (true) {
            const {value, done} = iterator.next();
            if (done) return false;
            if (fn(value)) return true;
        }
    }

    public findFirst(predicate: (x: T) => boolean): T | undefined {
        for (const x of this.sequencer) {
            if (predicate(x)) return x;
        }
        return undefined;
    }

    public findLast(predicate: (x: T) => boolean): T | undefined {
        let result: T | undefined = undefined;
        for (const x of this.sequencer) {
            if (predicate(x)) result = x;
        }
        return result;
    }
}