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