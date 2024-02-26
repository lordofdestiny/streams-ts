export class Sequencer<T> implements Iterable<T> {
    protected readonly source: Iterable<T>;

    constructor(iterable: Iterable<T>) {
        this.source = iterable;
    }

    public iterator() {
        return this.iterate();
    }

    protected *iterate(): Generator<T, any, unknown> {
        for(const value of this.source) {
            yield value;
        }
    }

    *[Symbol.iterator](): Iterator<T> {
        yield* this.source;
    }
}