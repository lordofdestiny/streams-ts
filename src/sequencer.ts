/**
 * @internal
 *
 * Base class for wrapping an iterable object.
 *
 * You should not use this class directly. Instead, always use Stream
 * factory functions.
 *
 * This class will probably be removed in the future.
 * */
export class Sequencer<T> implements Iterable<T> {
    protected readonly source: Iterable<T>;

    constructor(iterable: Iterable<T>) {
        this.source = iterable;
    }

    *[Symbol.iterator](): Iterator<T> {
        yield* this.source;
    }
}