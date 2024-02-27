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

export class ArgumentCountError extends Error {
    private readonly function: Function;
    constructor(fun: Function, num_args: number) {
        super(`invalid number of arguments (${num_args}) when calling ${fun.name}()`);
        this.function = fun;
    }
}

export class ValueError extends Error {
    constructor(message: string) {
        super(message);
    }
}