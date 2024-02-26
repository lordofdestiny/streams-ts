import {EmptyStreamReductionError} from "~/errors";
import {Sequencer} from "~/sequencer";

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

    public static empty<T>() {
        return new Stream<T>(new Sequencer([]));
    }

    public static repeat<T>(value: T) {
        return new Stream<T>(new Sequencer({
            [Symbol.iterator]: () => ({
                next: () => ({value, done: false})
            })
        }));
    }

    public toArray() {
        return [...this.sequencer];
    }

    public toMap<K, V>(this: Stream<[K, V]>) {
        const first = this.sequencer.iterator().next();
        if (first.done) return new Map<K, V>();
        console.assert(first.value instanceof Array, "Stream.toMap() requires a stream of key-value pairs");
        return new Map<K, V>([first.value, ...this.sequencer]);
    }

    public toSet() {
        return new Set(this.sequencer);
    }

    public skip(n: number) {
        let {sequencer} = this;
        return new Stream(new Sequencer({
            * [Symbol.iterator]() {
                const iterator = sequencer.iterator();
                for (let i = 0; i < n; i++) {
                    iterator.next();
                }
                yield* iterator;
            }
        }));
    }

    public take(n: number) {
        const that = this;
        return new Stream(new Sequencer({
                * [Symbol.iterator]() {
                    while (n-- > 0) {
                        const {value, done} = that.sequencer.iterator().next();
                        if (done) return;
                        yield value;
                    }
                }
            }
        ))
    }

    public enumerate(): Stream<[number, T]> {
        const {sequencer} = this;
        return new Stream(new Sequencer({
            * [Symbol.iterator]() {
                let i = 0;
                for (const x of sequencer) {
                    yield [i++, x];
                }
            }
        }));
    }

    public map<U>(fn: (x: T) => U) {
        const {sequencer} = this;
        return new Stream(new Sequencer({
            * [Symbol.iterator]() {
                for (const x of sequencer) {
                    yield fn(x);
                }
            }
        }));
    }

    public filter(predicate: (x: T) => boolean) {
        const {sequencer} = this;
        return new Stream(new Sequencer({
            * [Symbol.iterator]() {
                for (const x of sequencer) {
                    if (predicate(x)) yield x;
                }
            }
        }));
    }

    public fold<U>(initial: U, fn: (acc: U, x: T) => U) {
        let acc = initial;
        for (const x of this.sequencer) {
            acc = fn(acc, x);
        }
        return acc;
    }

    public static zip2<T, U>(first: Iterable<T>, second: Iterable<U>): Stream<[T, U]> {
        return new Stream(new Sequencer({
            * [Symbol.iterator]() {
                const a = first[Symbol.iterator]();
                const b = second[Symbol.iterator]();
                while (true) {
                    const {value: x, done: doneX} = a.next();
                    const {value: y, done: doneY} = b.next();
                    if (doneX || doneY) return;
                    yield [x, y];
                }
            }
        }));
    }

    public static zip3<T, U, V>(first: Iterable<T>, second: Iterable<U>, third: Iterable<V>): Stream<[T, U, V]> {
        return new Stream(new Sequencer({
            * [Symbol.iterator]() {
                const a = first[Symbol.iterator]();
                const b = second[Symbol.iterator]();
                const c = third[Symbol.iterator]();
                while (true) {
                    const {value: x, done: doneX} = a.next();
                    const {value: y, done: doneY} = b.next();
                    const {value: z, done: doneZ} = c.next();
                    if (doneX || doneY || doneZ) return;
                    yield [x, y, z];
                }
            }
        }));
    }

    public static zip_n(...iterables: Iterable<any>[]): Stream<any[]> {
        return new Stream(new Sequencer({
            * [Symbol.iterator]() {
                const iterators = iterables.map(iterable => iterable[Symbol.iterator]());
                while (true) {
                    const values = iterators.map(iterator => iterator.next());
                    if (values.some(({done}) => done)) return;
                    yield values.map(({value}) => value);
                }
            }
        }));
    }

    public chain<U>(iterable: Iterable<U>) {
        const {sequencer} = this;
        return new Stream(new Sequencer({
            * [Symbol.iterator]() {
                yield* sequencer;
                yield* iterable;
            }
        }));
    }

    public reduce(fn: (acc: T, x: T) => T) {
        const iterator = this.sequencer.iterator();
        const first = iterator.next();
        if (first.done) throw new EmptyStreamReductionError();
        return new Stream<T>(new Sequencer<T>({
            [Symbol.iterator]: () => ({
                next: () => iterator.next()
            })
        })).fold(first.value, fn);
    }

    public forEach(fn: (x: T) => void) {
        for (const x of this.sequencer) {
            fn(x);
        }
    }
}