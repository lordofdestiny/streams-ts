/* istanbul ignore file */

export class UnequalIterableLengthError extends Error {
    constructor() {
        super("iterables are not of equal length");
    }
}

export function* zip_equal(...iterables: Iterable<any>[]) {
    const iterators = iterables.map(i => i[Symbol.iterator]());
    while (true) {
        const results = iterators.map(i => i.next());
        const all = results.every(r => r.done);
        if (all) {
            break;
        }
        if (!all && results.some(r => r.done)) {
            throw new UnequalIterableLengthError();
        }
        yield results.map(r => r.value);
    }
}

export function isIterable(obj: any) {
    return !!obj?.[Symbol.iterator] && typeof obj[Symbol.iterator] === "function";
}