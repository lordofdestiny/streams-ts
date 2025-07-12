/* istanbul ignore file */

/**
 * StreamError is the base class for all errors that are thrown by the Stream class
 * */
export class StreamError extends Error {
    protected readonly origin: Function;

    constructor(message: string, fun: Function) {
        super(`Stream.${fun.name}(): ${message}`);
        this.origin = fun;
    }
}

/**
 * Error that is thrown when a Stream method is called with an invalid number of arguments
 * */
export class ArgCountError extends StreamError {
    /**
     * The function that was called with the wrong number of arguments
     * */
    public get function(): Function {
        return this.origin;
    }

    constructor(fun: Function, num_args: number) {
        super(`invalid number of arguments; expected ${fun.length} but received ${num_args}`, fun);
    }
}


/**
 * Error that is thrown when a Stream method is called with an argument
 * whose value is not valid
 * */
export class ArgValueError extends StreamError {
    constructor(message: string, fun: Function) {
        super(message, fun);
    }
}


/**
 * Error that is thrown when a Stream method is called with an argument of the wrong type
 * */
export class ArgTypeError extends StreamError {
    constructor(message: string, fun: Function) {
        super(`${message}`, fun);
    }
}