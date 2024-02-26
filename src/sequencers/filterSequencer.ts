import {Sequencer} from "~/sequencer";

export class FilterSequencer<T> extends Sequencer<T> {
    private readonly sequencer: Sequencer<T>;
    private readonly predicate: (x: T) => boolean;

    constructor(sequencer: Sequencer<T>, predicate: (x: T) => boolean) {
        super();
        this.sequencer = sequencer;
        this.predicate = predicate;
    }

    protected* iterate() {
        for (const x of this.sequencer) {
            if (this.predicate(x)) yield x;
        }
    }
}