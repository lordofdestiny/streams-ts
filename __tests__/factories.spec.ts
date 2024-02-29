import {ArgumentCountError, ValueError} from "~/errors";
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

describe("Stream.range()", () => {
    it("should throw if number of arguments is less than 1", () => {
        // @ts-expect-error
        expect(() => Stream.range()).toThrow(ArgumentCountError);
    })

    it("should throw if number of arguments is more than 3", () => {
        // @ts-expect-error
        expect(() => Stream.range(1, 2, 3, 4))
            .toThrow(ArgumentCountError);
        try {
            // @ts-expect-error
            Stream.range()
        } catch (e) {
            expect(e).toBeInstanceOf(ArgumentCountError)
            if (e instanceof ArgumentCountError) {
                expect(e.function.name).toEqual("range");
            }
        }
    })

    it("should throw if the step is 0", () => {
        expect(() => Stream.range(1, 2, 0)).toThrow(ValueError);
    })

    it("should generate integers from 2 to 4", () => {
        expect([...Stream.range(2, 5)]).toEqual([2, 3, 4]);
    })

    it("should generate integers from 0 to 9", () => {
        expect([...Stream.range(10)]).toEqual([...Array(10).keys()]);
    })

    it("should generate even integers from 0 to 9", () => {
        expect([...Stream.range(0, 10, 2)]).toEqual([...Array(10).keys()].filter(x => x % 2 === 0));
    })

    it("should generate integers from 10 to 0", () => {
        const expected = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
        expect([...Stream.range(10, 0, -1)]).toEqual(expected);
    })

    it("should generate odd integers from 9 to 1", () => {
        const expected = [9, 7, 5, 3, 1];
        expect([...Stream.range(9, 0, -2)]).toEqual(expected);
    })

    it("should return empty stream if no step is provided", () => {
        expect([...Stream.range(5, 0)]).toEqual([]);
    })
})

describe("Stream.iterate()", () => {
    it("should generate the first 3 powers of 2", () => {
        const expected = [1, 2, 4];
        expect([...Stream.iterate(1, x => x * 2).take(3)]).toEqual(expected);
    })

    it("should generate odd integers from 1 to 9", () => {
        const expected = [1, 3, 5, 7, 9];
        expect([...Stream.iterate(1, x => x + 2).take(5)]).toEqual(expected);
    })

    it("should generate the alphabet", () => {
        const expected = "abcdefghijklmnopqrstuvwxyz";
        const result = Stream.iterate("a".charCodeAt(0), x => x + 1)
            .map(String.fromCharCode)
            .take(26)
            .join("");
        expect(result).toEqual(expected);
    })

    it("should generate powers of two less then 5000", () => {
        const expected = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
        expect([
            ...Stream.iterate(1, x => x * 2)
                .takeWhile(x => x < 5000)
        ]).toEqual(expected);
    });
})

describe("Stream.zip()", () => {
    let numbers = [1, 2, 3, 4, 5, 6];
    let letters = ["a", "b", "c", "d", "e", "f"];
    let booleans = [true, false, true, false, true, false];

    it("should zip the numbers and letters", () => {
        let s = Stream.zip(numbers, letters);
        expect([...s])
            .toEqual([[1, "a"], [2, "b"], [3, "c"], [4, "d"], [5, "e"], [6, "f"]]);
    })

    it("should be chainable", () => {
        let s = Stream.zip(numbers, letters)
            .map(([n, l]) => n + l);
        expect([...s]).toEqual(["1a", "2b", "3c", "4d", "5e", "6f"]);
    })

    it("should zip the numbers, letters and symbols", () => {
        let s = Stream.zip(numbers, letters, booleans);
        expect([...s])
            .toEqual([
                [1, "a", true],
                [2, "b", false],
                [3, "c", true],
                [4, "d", false],
                [5, "e", true],
                [6, "f", false]
            ]);
    })
})
