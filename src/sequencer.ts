export class Sequencer<T> implements Iterable<T> {
    protected readonly source: Iterable<T>;

    constructor(iterable: Iterable<T>) {
        this.source = iterable;
    }

    *[Symbol.iterator](): Iterator<T> {
        yield* this.source;
    }
}