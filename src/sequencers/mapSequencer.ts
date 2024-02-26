import {Sequencer} from "~/sequencer";

export class MapSequencer<T, U> extends Sequencer<U> {
    private readonly sequencer: Sequencer<T>;
    private readonly fn: (x: T) => U;

    constructor(sequencer: Sequencer<T>, fn: (x: T) => U) {
        super();
        this.sequencer = sequencer;
        this.fn = fn;
    }

    protected* iterate(): Generator<U, any, unknown> {
        for (const x of this.sequencer) {
            yield this.fn(x);
        }
    }
}