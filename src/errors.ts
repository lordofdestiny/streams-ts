export abstract class StreamError extends Error {
    protected constructor(message: string) {
        super(message);
    }
}
export class EmptyStreamReductionError extends StreamError {
    constructor() {
        super("Stream.reduce() requires a non-empty stream");
    }
}