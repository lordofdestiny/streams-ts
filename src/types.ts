/**
 *  Type of function that takes a value of type T and returns a value of type U
 *
 *  @typeParam T - The type of the input to the function
 *  @typeParam U - The type of the output of the function
 * */
export type Function<T, U> = (value: T) => U;

/**
 * Type of function that takes a value of type T and returns a value of type U
 *
 * @typeParam T - The type of the first input to the function
 * @typeParam U - The type of the second input to the function
 * @typeParam R - The type of the output of the function
 * */
export type BiFunction<T, U, R> = (t: T, u: U) => R;

/**
 * Type of function that takes a value of type T and returns a boolean.
 * This function represents a predicate, which is a function that returns a boolean value,
 * if the input value satisfies some condition.
 *
 * @typeParam T - The type of the input to the function
 *
 * */
export type Predicate<T> = Function<T, boolean>;


/**
 * Type of function that takes a value of type T and returns void.
 * This function represents a consumer,
 * which is a function that takes a value and does something with it.
 *
 * @typeParam T - The type of the input to the function
 * */
export type Consumer<T> = Function<T, void>;


/**
 * Type of function that takes a value of type T and returns a number,
 * denoting the order of the input value.
 *
 * @typeParam T - The type of the input to the function
 *
 * @returns
 * - Zero if the first input value is equal to the second input value
 * - A negative number if the first input value is less than the second input value
 * - A positive number if the first input value is greater than the second input value
 *
 * @example
 * const compareNumbers: Comparator<number> = (a, b) => a - b; // ascending order
 * const compareStrings: Comparator<string> = (a, b) => a.localeCompare(b); // lexicographical order
 * */
export type Comparator<T> = BiFunction<T, T, number>;

/**
 * Type of function that takes two values of type T and returns a value of type T.
 *
 * @typeParam T - The type of the input to the function
 *
 * @example A bi-operator can be a function that represents binary operations such as addition,
 * ```ts
 * subtraction, multiplication, etc.
 * const add: BiOperator<number> = (a, b) => a + b;
 * const subtract: BiOperator<number> = (a, b) => a - b;
 * const multiply: BiOperator<number> = (a, b) => a * b;
 * const divide: BiOperator<number> = (a, b) => a / b;
 * const modulo: BiOperator<number> = (a, b) => a % b;
 * const power: BiOperator<number> = (a, b) => a ** b;
 * ```
 */
export type BiOperator<T> = BiFunction<T, T, T>;


/**
 * A function that takes a value of type T and returns a value of type T.
 * This function represents a unary operator, which is a function that takes a single value and returns a value of the same type.
 *
 * @typeParam T - The type of the input to the function
 *
 * @example A unary operator can be a function that represents unary operations such as negation, increment, decrement, etc.
 * ```ts
 * const negate: UnaryOperator<number> = (a) => -a;
 * const increment: UnaryOperator<number> = (a) => a + 1;
 * const decrement: UnaryOperator<number> = (a) => a - 1;
 * ```
 * */
export type UnaryOperator<T> = Function<T, T>;
