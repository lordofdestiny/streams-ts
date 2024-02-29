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


describe("Stream.compare()", () => {
    it("should compare empty streams", () => {
        let s1 = Stream.from([]);
        const s2 = Stream.from([]);
        expect(s1.compare(s2)).toEqual(0);
    })

    it("should compare empty streams", () => {
        let s1 = Stream.from([]);
        const s2 = Stream.from([1]);
        expect(s1.compare(s2)).toBeLessThan(0);
    })

    it("should compare empty streams", () => {
        let s1 = Stream.from([1]);
        const s2 = Stream.from([]);
        expect(s1.compare(s2)).toBeGreaterThan(0);
    })

    it("should compare the numbers", () => {
        let numbers1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let numbers2 = [2, 3, 4, 5, 6, 7, 8, 9, 10];

        let s1 = Stream.from(numbers1)
            .map(x => x * 2)
            .take(4);
        const s2 = Stream.from(numbers2)
            .filter(x => x % 2 === 0)
            .take(4);
        expect(s1.compare(s2)).toEqual(0);
    })

    it("should compare strings", () => {
        let s1 = Stream.from("hello");
        const s2 = Stream.from("world");
        expect(s1.compare(s2)).toBeLessThan(0);
    })

    it("should compare strings", () => {
        let s1 = Stream.from("world");
        const s2 = Stream.from("hello");
        expect(s1.compare(s2)).toBeGreaterThan(0);
    })
})

describe("Stream.compareBy()", () => {
    it("should compare objects by key", () => {
        let s1 = Stream.from([{x: 1}, {x: 2}, {x: 3}]);
        const s2 = Stream.from([{x: 3}, {x: 2}, {x: 1}]);
        expect(s1.compareBy(s2, (x: { x: number }) => x.x)).toBeLessThan(0);
    })

    it("should objects by key", () => {
        let s1 = Stream.from([{x: 1}, {x: 2}, {x: 3}]);
        const s2 = Stream.from([{x: 3}, {x: 2}, {x: 1}]);
        expect(s2.compareBy(s1, (x: { x: number }) => x.x)).toBeGreaterThan(0);
    })

    it("should compare objects by key", () => {
        let s1 = Stream.from([{x: 1}, {x: 2}, {x: 3}]);
        const s2 = Stream.from([{x: 1}, {x: 2}, {x: 3}]);
        expect(s1.compareBy(s2, (x: { x: number }) => x.x)).toEqual(0);
    })
});

describe('Stream.{eq, ne, lt, le, gt, ge}()', () => {
    it('should compare streams', () => {
        let s1 = Stream.from([1, 2, 3]);
        let s2 = Stream.from([1, 2, 3]);
        let s3 = Stream.from([1, 2, 4]);

        expect(s1.eq(s2)).toEqual(true);
        expect(s1.eq(s3)).toEqual(false);

        expect(s1.ne(s2)).toEqual(false);
        expect(s1.ne(s3)).toEqual(true);

        expect(s1.lt(s2)).toEqual(false);
        expect(s1.lt(s3)).toEqual(true);

        expect(s1.le(s2)).toEqual(true);
        expect(s1.le(s3)).toEqual(true);

        expect(s1.gt(s2)).toEqual(false);
        expect(s1.gt(s3)).toEqual(false);
        expect(s3.gt(s1)).toEqual(true);
        expect(s3.gt(s3)).toEqual(false);

        expect(s1.ge(s2)).toEqual(true);
        expect(s1.ge(s3)).toEqual(false);
        expect(s3.ge(s1)).toEqual(true);
        expect(s3.ge(s3)).toEqual(true);
    })
});

describe("Stream.eqBy()", () => {
    it("should compare streams by key", () => {
        const arr1 = [{x: 1}, {x: 2}, {x: 3}];
        const arr2 = [{x: 1}, {x: 2}, {x: 4}];
        const s1 = Stream.from(arr1);
        const s2 = Stream.from(arr1);
        const s3 = Stream.from(arr2);
        expect(s1.eqBy(s2, (x: { x: number }) => x.x)).toEqual(true);
        expect(s1.eqBy(s3, (x: { x: number }) => x.x)).toEqual(false);
    })
})


describe("Stream.isSorted()", () => {
    test("if empty stream is sorted", () => {
        expect(Stream.of().isSorted()).toEqual(true);
    })

    it("should check if the stream is sorted", () => {
        let s1 = Stream.from([1, 2, 3]);
        let s2 = Stream.from([3, 2, 1]);
        expect(s1.isSorted()).toEqual(true);
        expect(s2.isSorted()).toEqual(false);
    })

    it("should check if the stream is reverse sorted", () => {
        let s1 = Stream.from([3, 2, 1]);
        let s2 = Stream.from([1, 2, 3]);
        expect(s1.isSorted(true)).toEqual(true);
        expect(s2.isSorted(true)).toEqual(false);
    })

    it("should check if the stream is sorted by key", () => {
        let s1 = Stream.from([{x: 1}, {x: 2}, {x: 3}]);
        let s2 = Stream.from([{x: 3}, {x: 2}, {x: 1}]);
        expect(s1.isSorted(false, (x: { x: number }) => x.x)).toEqual(true);
        expect(s2.isSorted(false, (x: { x: number }) => x.x)).toEqual(false);
    })

    it("should check if the stream is reverse sorted by key", () => {
        let s1 = Stream.from([{x: 3}, {x: 2}, {x: 1}]);
        let s2 = Stream.from([{x: 1}, {x: 2}, {x: 3}]);
        expect(s1.isSorted(true, (x: { x: number }) => x.x)).toEqual(true);
        expect(s2.isSorted(true, (x: { x: number }) => x.x)).toEqual(false);
    })
})

describe("Stream.isSortedBy()", () => {
    test("if empty stream is sorted", () => {
        expect(Stream.of<number>().isSortedBy((a, b) => a - b)).toEqual(true);
    })

    it("should check if the stream is sorted by comparator", () => {
        let s1 = Stream.from([1, 2, 3]);
        let s2 = Stream.from([3, 2, 1]);
        expect(s1.isSortedBy((a, b) => a - b)).toEqual(true);
        expect(s2.isSortedBy((a, b) => a - b, true)).toEqual(true);
    })

    it("should check if the stream is reverse sorted by comparator", () => {
        let s1 = Stream.from([3, 2, 1]);
        let s2 = Stream.from([1, 2, 3]);
        expect(s1.isSortedBy((a, b) => b - a)).toEqual(true);
        expect(s1.isSortedBy((a, b) => b - a, true)).toEqual(false);
        expect(s2.isSortedBy((a, b) => b - a)).toEqual(false);
        expect(s2.isSortedBy((a, b) => b - a, true)).toEqual(true);
    })

    it("should check if the stream is sorted by comparator", () => {
        let s1 = Stream.from([{x: 1}, {x: 2}, {x: 3}]);
        let s2 = Stream.from([{x: 3}, {x: 2}, {x: 1}]);
        expect(s1.isSortedBy((a, b) => a.x - b.x)).toEqual(true);
        expect(s1.isSortedBy((a, b) => a.x - b.x, true)).toEqual(false);
        expect(s2.isSortedBy((a, b) => a.x - b.x)).toEqual(false);
        expect(s2.isSortedBy((a, b) => a.x - b.x, true)).toEqual(true);
    })
})

describe('Stream.{sum, product, min, max}()', () => {
    it('should sum the numbers', () => {
        let s = Stream.range(1, 6);
        expect(s.sum()).toEqual(15);
    })

    it('should sum the numbers', () => {
        const fact = (n: number) => Stream.range(n, 0, -1).product();
        expect(fact(5)).toEqual(120);
    })

    it("should return the minimum value", () => {
        let s = Stream.from(new Set([3, 2, 1, 4, 5]));
        expect(s.min()).toEqual(1);
    })

    it("should return the maximum value", () => {
        let s = Stream.from(new Set([3, 2, 1, 4, 5]));
        expect(s.max()).toEqual(5);
    })
});

describe('Stream.count()', () => {
    it("should return 0 for empty stream", () => {
        expect(Stream.of().count()).toEqual(0);
    })

    it("should return the number of elements", () => {
        let s = Stream.range(1, 6);
        expect(s.count()).toEqual(5);
    })

    it("should return the number of elements", () => {
        let s = Stream.range(1, 6);
        expect(s.filter(x => x % 2 === 0).count()).toEqual(2);
    })

    it("should return the number of elements", () => {
        let arr = [1, 2, 3, 4, 5, 6];
        let s = Stream.from(arr);
        expect(s.count()).toEqual(arr.length);
    })
})

describe("Stream.{all, any, allMap, anyMap}()", () => {
    test("that Stream.all() works as expected", () => {
        expect(Stream.of(true, true, true).all()).toEqual(true);
        expect(Stream.of(true, false, true).all()).toEqual(false);
        expect(Stream.of(false, false, false).all()).toEqual(false);
    })

    test("that Stream.any() works as expected", () => {
        expect(Stream.of(true, true, true).any()).toEqual(true);
        expect(Stream.of(true, false, true).any()).toEqual(true);
        expect(Stream.of(false, false, false).any()).toEqual(false);
    })

    it("should check if all elements are even", () => {
        expect(Stream.range(1, 6)
            .allMap(x => x % 2 === 0)
        ).toEqual(false);
        expect(Stream.range(1, 6)
            .filter(x => x % 2 === 0)
            .allMap(x => x % 2 === 0)
        ).toEqual(true);
    })

    it("should check if any element is even", () => {
        expect(Stream.range(1, 6)
            .anyMap(x => x % 2 === 0)
        ).toEqual(true);
        expect(Stream.range(1, 6)
            .filter(x => x % 2 === 0)
            .anyMap(x => x % 2 === 1)
        ).toEqual(false);
        expect(Stream.range(1, 6)
            .filter(x => x % 2 === 0)
            .chain(Stream.of(1))
            .anyMap(x => x % 2 === 1)
        ).toEqual(true);
    })
})

describe("Stream.findFirst()", () => {
    it("should find the first even number greater than 3", () => {
        let s = Stream.range(1, 6)
            .findFirst(x => x % 2 === 0 && x > 3);
        expect(s).toEqual(4);
    })

    it("should return undefined if no element is found", () => {
        let s = Stream.range(1, 6)
            .findFirst(x => x > 6);
        expect(s).toEqual(undefined);
    })
})

describe("Stream.findLast()", () => {
    it("should find the last even number greater than 3", () => {
        let s = Stream.range(1, 10)
            .findLast(x => x % 2 === 0 && x > 3);
        expect(s).toEqual(8);
    })

    it("should return undefined if no element is found", () => {
        let s = Stream.range(1, 6)
            .findLast(x => x > 6);
        expect(s).toEqual(undefined);
    })
})

describe('Stream.takeWhile()', () => {
    it("should return an empty stream", () => {
        let s = Stream.range(1, 6)
            .takeWhile(x => x > 6);
        expect([...s]).toEqual([]);
    })

    it('should take elements while the predicate is true', () => {
        let s = Stream.range(1, 10)
            .takeWhile(x => x < 6);
        expect([...s]).toEqual([1, 2, 3, 4, 5]);
    })

    it('should take elements while the predicate is true', () => {
        let s = Stream.range(1, 10)
            .takeWhile(x => x < 6)
            .takeWhile(x => x % 2 === 1);
        expect([...s]).toEqual([1]);
    })
});