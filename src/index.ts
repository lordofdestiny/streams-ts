export class Stream<T> {
    private readonly sequence: Iterable<T>;
    constructor(iterable: Iterable<T>) {
        this.sequence = iterable;
    }

    static from<T>(iterable: Iterable<T>)  {
        return new Stream<T>(iterable);
    }

    *[Symbol.iterator]() {
        yield *this.sequence;
    }
}