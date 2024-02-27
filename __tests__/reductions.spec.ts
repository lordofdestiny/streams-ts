import {Stream} from "~/index";

describe("Stream.fold()", () => {
    it("should sum first 10 numbers", () => {
        let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let s = Stream.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        let result = s.fold(0, (acc, x) => acc + x);
        let expected = numbers.reduce((acc, x) => acc + x, 0);
        expect(result).toEqual(expected);
    })

    it("should sum first 10 squares", () => {
        let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let s = Stream.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        let result = s.map(x => x ** 2)
            .fold(0, (acc, x) => acc + x);
        let expected = numbers.map(x => x ** 2).reduce((acc, x) => acc + x, 0);
        expect(result).toEqual(expected);
    });
})

describe("Stream.reduce()", () => {
    it("should return undefined for empty stream", () => {
        let s = Stream.from<number>([]);
        expect(s.reduce((acc, x) => acc + x)).toEqual(undefined);
    })

    it("should sum first 10 numbers", () => {
        let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let s = Stream.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        let result = s.reduce((acc, x) => acc + x);
        let expected = numbers.reduce((acc, x) => acc + x);
        expect(result).toEqual(expected);
    })

    it("should sum first 10 squares", () => {
        let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let s = Stream.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        let result = s.map(x => x ** 2)
            .reduce((acc, x) => acc + x);
        let expected = numbers.map(x => x ** 2).reduce((acc, x) => acc + x);
        expect(result).toEqual(expected);
    });
})

describe("Stream.forEach()", () => {
    const mockFn = jest.fn(
        (x) => void x
    );

    test("should call mockFn 10 times", () => {
        let s = Stream.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        s.forEach(mockFn);
        expect(mockFn.mock.calls.length).toBe(10);
    })

    test("should call mockFn with each number", () => {
        let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let s = Stream.from(numbers);
        s.forEach(mockFn);
        expect(mockFn.mock.calls.map(c => c[0])).toEqual(numbers);
    })
})