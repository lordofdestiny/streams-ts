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