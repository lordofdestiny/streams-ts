import {EmptyStreamReductionError} from "~/errors";
import {Sequencer} from "~/sequencer";

type Iterableify<T> = { [K in keyof T]: Iterable<T[K]> }

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
        return new Stream<T>(new Sequencer((function* () {
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
        return new Stream(new Sequencer((function* () {
            while (n-- > 0) iterator.next();
            yield* iterator;
        })()));
    }

    public take(n: number) {
        const iterator = this.sequencer.iterator();
        return new Stream(new Sequencer((function* () {
            while (n-- > 0) {
                const {value, done} = iterator.next();
                if (done) return;
                yield value;
            }
        })()))
    }

    public enumerate(): Stream<[number, T]> {
        const {sequencer} = this;
        return new Stream(new Sequencer((function* () {
            let i = 0;
            for (const x of sequencer) yield [i++, x];
        })()));
    }

    public map<U>(fn: (x: T) => U) {
        const {sequencer} = this;
        return new Stream(new Sequencer((function* () {
            for (const x of sequencer) yield fn(x);
        })()));
    }

    public filter(predicate: (x: T) => boolean) {
        const {sequencer} = this;
        return new Stream(new Sequencer((function* () {
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

    public static zip<T extends Array<any>>(...iterables: Iterableify<T>): Stream<T> {
        return new Stream(new Sequencer((function* () {
            const iterators = iterables.map(iterable => iterable[Symbol.iterator]());
            while (true) {
                const values = iterators.map(iterator => iterator.next());
                if (values.some(({done}) => done)) return;
                yield values.map(({value}) => value) as T;
            }
        })()));
    }

    public chain<U>(iterable: Iterable<U>) {
        const {sequencer} = this;
        return new Stream(new Sequencer((function* () {
            yield* sequencer;
            yield* iterable;
        })()));
    }

    public reduce(fn: (acc: T, x: T) => T) {
        const iterator = this.sequencer.iterator();
        const first = iterator.next();

        if (first.done) throw new EmptyStreamReductionError();

        return new Stream<T>(new Sequencer<T>((function* () {
            yield* iterator
        })())).fold(first.value, fn);
    }

    public forEach(fn: (x: T) => void) {
        for (const x of this.sequencer) fn(x);
    }
}