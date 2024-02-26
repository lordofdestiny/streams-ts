import {Stream} from "~/index";
import {zip_equal} from "~/util";

describe("Stream.from()", () => {
    let small_arr = [1, 2, 3];

    it("should be iterable", () => {
        expect(Symbol.iterator in Stream.from([])).toBe(true);
        expect(() => {
            for (const x of Stream.from(small_arr)) {
                expect(x).toBeLessThan(4);
            }
        }).not.toThrow();
    })

    it("should yield same values as the original iterable", () => {
        expect(() => {
            for (let [x, y] of zip_equal(Stream.from(small_arr), small_arr)) {
                expect(x).toBe(y);
            }
        }).not.toThrow();
    })

    it("should be able to expand into an array", () => {
        expect([...Stream.from(small_arr)]).toEqual(small_arr);
    })
})

describe("Stream.of()", () => {
    let small_arr = [1, 2, 3];

    it("should yield empty streams", () => {
        expect(Stream.of().toArray()).toEqual([]);
    })

    it("should yield the same values as the arguments", () => {
        expect(Stream.of(1, 2, 3).toArray()).toEqual(small_arr);
    })

    it("should be able to and from an array", () => {
        expect([...Stream.of(...small_arr)]).toEqual(small_arr);
    })
});

describe("Stream.empty()", () => {
    it("should yield empty streams", () => {
        expect(Stream.empty().toArray()).toEqual([]);
    })
});

describe("Stream.repeat() + Stream.take()", () => {
    test.each([
        [0, 0],
        [5, 5],
        [10, 10],
        [100, 100],
        [1000, 1000],
    ])("should yield the same value %i times", (n, expected) => {
        let obj = {};
        let arr = Stream.repeat(obj).take(n).toArray();
        expect(arr).toHaveLength(expected);
        expect(arr.every(x => x === obj)).toBe(true);
    })
});

describe("Stream.take()", () => {
    let small_arr = [1, 2, 3];

    it("should take the first 3 numbers", () => {
        let s = Stream.from(small_arr)
            .take(3);
        expect([...s]).toEqual(small_arr);
    })

    it("should take the first 0 numbers", () => {
        let s = Stream.from(small_arr)
            .take(0);
        expect([...s]).toEqual([]);
    })

    it("should take all the numbers", () => {
        let s = Stream.from(small_arr)
            .take(small_arr.length);
        expect([...s]).toEqual(small_arr);
    })

    it("should be chainable", () => {
        let s = Stream.from(small_arr)
            .take(2)
            .take(2);
        expect([...s]).toEqual([1, 2]);
    })

    it("should exit if the stream is exhausted", () => {
        let s = Stream.from(small_arr)
            .take(100);
        expect([...s]).toEqual(small_arr);
    })
})