import {Sequencer, SimpleSequencer} from "~/sequencer";
import {MapSequencer} from "~/sequencers/mapSequencer";

export class Stream<T> extends Sequencer<T> {
    protected readonly sequencer: Sequencer<T>;

    private constructor(sequencer: Sequencer<T>) {
        super();
        this.sequencer = sequencer;
    }

    protected *iterate(){
        yield* this.sequencer;
    }

    public static from<T>(iterable: Iterable<T> ) {
        return new Stream(new SimpleSequencer(iterable));
    }

    public map<U>(fn: (x: T) => U) {
        return new Stream(new MapSequencer(this.sequencer, fn))
    }
}

