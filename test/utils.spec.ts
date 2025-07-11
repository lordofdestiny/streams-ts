import {isIterable, UnequalIterableLengthError, zip_equal} from "~/util";

describe("zip_equal()", () => {
    it("should throw an error if the iterables are not of equal length", () => {
        expect(() => {
            for (let _ of zip_equal([1, 2, 3], [4, 5])) {
            }
        }).toThrow(UnequalIterableLengthError);
    })

    it("should zip the iterables", () => {
        let zipped = Array.from(zip_equal([1, 2, 3], [4, 5, 6]));
        expect(zipped).toEqual([
            [1, 4],
            [2, 5],
            [3, 6]
        ]);
    })
})

describe("isIterable()", () => {
    it("should return true for iterables", () => {
        expect(isIterable([1, 2, 3])).toBe(true);
        expect(isIterable("abc")).toBe(true);
        expect(isIterable(new Set([1, 2, 3]))).toBe(true);
    })

    it("should return false for non-iterables", () => {
        expect(isIterable(5)).toBe(false);
        expect(isIterable({})).toBe(false);
        expect(isIterable({
            [Symbol.iterator]: 5
        })).toBe(false);
        expect(isIterable(null)).toBe(false);
        expect(isIterable(undefined)).toBe(false);
    })
})