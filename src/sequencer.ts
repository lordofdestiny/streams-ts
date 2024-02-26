export abstract class Sequencer<T> implements Iterable<T> {
    *[Symbol.iterator](): Iterator<T> {
        yield* this.iterate();
    }

    protected abstract iterate(): Generator<T>;

    iterator() {
        return this.iterate();
    }
}

export class SimpleSequencer<T> extends Sequencer<T> {
    private readonly source: Iterable<T>;

    constructor(iterable: Iterable<T>) {
        super();
        this.source = iterable;
    }

    protected* iterate(): Generator<T, any, unknown> {
        for (const x of this.source) {
            yield x;
        }
    }
}