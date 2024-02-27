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
        expect(s2.isSortedBy((a, b) => b - a, true)).toEqual(true);
    })

    it("should check if the stream is sorted by comparator", () => {
        let s1 = Stream.from([{x: 1}, {x: 2}, {x: 3}]);
        let s2 = Stream.from([{x: 3}, {x: 2}, {x: 1}]);
        expect(s1.isSortedBy((a, b) => a.x - b.x)).toEqual(true);
        expect(s2.isSortedBy((a, b) => a.x - b.x)).toEqual(false);
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

describe("Stream.join()", () => {
    it("should join the elements", () => {
        let s = Stream.from(["a", "b", "c"]);
        expect(s.join()).toEqual("abc");
    })

    it("should join the elements with a separator: ' '", () => {
        let s = Stream.from(["a", "b", "c"]);
        expect(s.join(" ")).toEqual("a b c");
    })

    it("should join the elements with a separator ', '", () => {
        let s = Stream.from(["a", "b", "c"]);
        expect(s.join(", ")).toEqual("a, b, c");
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