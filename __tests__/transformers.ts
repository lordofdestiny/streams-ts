import {ValueError} from "~/errors";
import {Stream} from "~/index"

describe("Stream.map()", () => {
    let numbers = [1, 2, 3];

    it("should map values", () => {
        let s = Stream.from(numbers)
            .map(x => x * 2);
        expect([...s]).toEqual([2, 4, 6]);
    })

    it("should map values with a different type", () => {
        let s = Stream.from(numbers)
            .map(x => x.toString());
        expect([...s]).toEqual(["1", "2", "3"]);
    })

    it("should behave like a normal map", () => {
        let s = Stream.from(numbers)
            .map(x => x * 2);
        expect([...s]).toEqual(numbers.map(x => x * 2));
    })

    it("should be chainable", () => {
        let s = Stream.from(numbers)
            .map(x => x * 2)
            .map(x => x.toString());
        expect([...s]).toEqual(["2", "4", "6"]);
    })
});

describe("Stream.filter()", () => {
    let numbers = [1, 2, 3, 4, 5, 6];

    it("should filter odd numbers", () => {
        let s = Stream.from(numbers)
            .filter(x => x % 2 === 0);
        expect([...s]).toEqual([2, 4, 6]);
    })

    it("should filter even numbers", () => {
        let s = Stream.from(numbers)
            .filter(x => x % 2 !== 0);
        expect([...s]).toEqual([1, 3, 5]);
    })

    it("should be chainable", () => {
        let s = Stream.from(numbers)
            .filter(x => x % 2 === 0)
            .filter(x => x % 3 === 0);
        expect([...s]).toEqual([6]);
    })

    it("should be chainable with map", () => {
        let s = Stream.from(numbers)
            .filter(x => x % 2 === 0)
            .map(x => x * 2);
        expect([...s]).toEqual([4, 8, 12]);
    });
});

describe("Stream.skip()", () => {
    let numbers = [1, 2, 3, 4, 5, 6];

    it("should skip the first 3 numbers", () => {
        let s = Stream.from(numbers)
            .skip(3);
        expect([...s]).toEqual([4, 5, 6]);
    })

    it("should skip the first 0 numbers", () => {
        let s = Stream.from(numbers)
            .skip(0);
        expect([...s]).toEqual(numbers);
    })

    it("should skip all the numbers", () => {
        let s = Stream.from(numbers)
            .skip(numbers.length);
        expect([...s]).toEqual([]);
    })

    it("should be chainable", () => {
        let s = Stream.from(numbers)
            .skip(3)
            .skip(2);
        expect([...s]).toEqual([6]);
    })
})

describe("Stream.enumerate()", () => {
    let numbers = [1, 2, 3, 4, 5, 6];

    it("should enumerate the numbers", () => {
        let s = Stream.from(numbers)
            .enumerate();
        expect([...s])
            .toEqual([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]);
    })

    it("should be chainable", () => {
        let s = Stream.from(numbers)
            .enumerate()
            .map(([i, x]) => i * x);
        expect([...s]).toEqual([0, 2, 6, 12, 20, 30]);
    })
})

describe("Stream.flatten()", () => {
    let numbers = [[1, 2], [3, 4], [5, 6]];

    it("should flatten the numbers", () => {
        let s = Stream.from(numbers)
            .flatten();
        expect([...s]).toEqual([1, 2, 3, 4, 5, 6]);
    })

    it("should be chainable", () => {
        let s = Stream.from(numbers)
            .flatten()
            .map(x => x * 2);
        expect([...s]).toEqual([2, 4, 6, 8, 10, 12]);
    })

    it("should flatten stream of streams", () => {
        let s = Stream.from(numbers)
            .map(x => Stream.from(x))
            .flatten();
        expect([...s]).toEqual([1, 2, 3, 4, 5, 6]);
    })
})

describe("Stream.chain()", () => {
    let numbers = [1, 2, 3];
    let letters = ["a", "b", "c"];

    it("should chain the numbers and letters", () => {
        let s = Stream.from(numbers)
            .chain(letters);
        expect([...s]).toEqual([1, 2, 3, "a", "b", "c"]);
    })

    it("should be chainable", () => {
        let s = Stream.from(numbers)
            .chain(letters)
            .map(x => x.toString());
        expect([...s]).toEqual(["1", "2", "3", "a", "b", "c"]);
    })
})

describe("Stream.chunk()", () => {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    it("should throw when n <= 0", () => {
        expect(() => Stream.from(numbers).chunk(0)).toThrow(ValueError);
        expect(() => Stream.from(numbers).chunk(-1)).toThrow(ValueError);
    })

    it("should chunk the numbers (n=1)", () => {
        const s = Stream.from(numbers).chunk(1);
        expect([...s]).toEqual([[1], [2], [3], [4], [5], [6], [7], [8], [9]]);
    })

    it("should chunk the numbers (n=2)", () => {
        const s = Stream.from(numbers).chunk(2);
        expect([...s]).toEqual([[1, 2], [3, 4], [5, 6], [7, 8], [9]]);
    })

    it("should chunk the numbers (n=3)", () => {
        const s = Stream.from(numbers).chunk(3);
        expect([...s]).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    })

    it("should be chainable", () => {
        let s = Stream.from(numbers).chunk(3).map(x => x.join(""));
        expect([...s]).toEqual(["123", "456", "789"]);
    })
})

describe("Stream.slide()", () => {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    it("should throw when n <= 0", () => {
        expect(() => Stream.from(numbers).slide(0)).toThrow(ValueError);
        expect(() => Stream.from(numbers).slide(-1)).toThrow(ValueError);
    })

    it("should slide the numbers (n=1)", () => {
        const s = Stream.from(numbers).slide(1);
        expect([...s]).toEqual([[1], [2], [3], [4], [5], [6], [7], [8], [9]]);
    })

    it("should slide the numbers (n=2)", () => {
        const s = Stream.from(numbers).slide(2);
        expect([...s]).toEqual([
            [1, 2], [2, 3], [3, 4], [4, 5],
            [5, 6], [6, 7], [7, 8], [8, 9]
        ]);
    })

    it("should slide the numbers (n=3)", () => {
        const s = Stream.from(numbers).slide(3);
        expect([...s]).toEqual([
            [1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6],
            [5, 6, 7], [6, 7, 8], [7, 8, 9]
        ]);
    })

    it("should be chainable", () => {
        let s = Stream.from(numbers).slide(3).map(x => x.join(""));
        expect([...s]).toEqual(["123", "234", "345", "456", "567", "678", "789"]);
    })

    it("should slide the numbers (n=4)", () => {
        const s = Stream.from(numbers).slide(4);
        expect([...s]).toEqual([
            [1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6],
            [4, 5, 6, 7], [5, 6, 7, 8], [6, 7, 8, 9]
        ]);
    })

    it("should return empty stream if source is shorter than n", () => {
        const s = Stream.from([1, 2, 3]).slide(4);
        expect([...s]).toEqual([]);
    })
})
