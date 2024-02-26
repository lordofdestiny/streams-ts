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