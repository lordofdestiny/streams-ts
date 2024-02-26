import * as console from "console";
import {FilterSequencer} from "~/sequencers/filterSequencer";
import {Sequencer, SimpleSequencer} from "~/sequencer";
import {MapSequencer} from "~/sequencers/mapSequencer";

export class Stream<T> extends Sequencer<T> {
    protected readonly sequencer: Sequencer<T>;

    protected constructor(sequencer: Sequencer<T>) {
        super();
        this.sequencer = sequencer;
    }

    protected* iterate() {
        yield* this.sequencer;
    }

    public static from<T>(iterable: Iterable<T>) {
        return new Stream(new SimpleSequencer(iterable));
    }

    public toArray() {
        return Array.from(this.sequencer);
    }

    public toMap<K, V>(this: Stream<[K, V]>) {
        const first = this.sequencer.iterator().next();
        if (first.done) return new Map<K, V>();
        console.assert(first.value instanceof Array, "Stream.toMap() requires a stream of key-value pairs");
        return new Map<K, V>([first.value, ...this.sequencer]);
    }

    public map<U>(fn: (x: T) => U) {
        return new Stream(new MapSequencer(this.sequencer, fn))
    }

    public filter(predicate: (x: T) => boolean) {
        return new Stream(new FilterSequencer(this.sequencer, predicate));
    }
}