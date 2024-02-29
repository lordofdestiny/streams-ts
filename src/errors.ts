/* istanbul ignore file */

/**
 * Error that is thrown when a Stream method is called with an invalid number of arguments
 * */
export class ArgumentCountError extends Error {
    private readonly origin: Function;

    /**
     * The function that was called with the wrong number of arguments
     *
     * */
    public get function(): Function {
        return this.origin;
    }

    constructor(fun: Function, num_args: number) {
        super(`invalid number of arguments (${num_args}) when calling ${fun.name}()`);
        this.origin = fun;
    }
}


/**
 * Error that is thrown when a Stream method is called with an invalid argument
 * */
export class ValueError extends Error {
    constructor(message: string) {
        super(message);
    }
}