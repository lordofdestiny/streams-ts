import {Stream} from "~/index"

// noinspection JSUnusedLocalSymbols
function* zip(...iterables: Iterable<any>[]) {
    const iterators = iterables.map(i => i[Symbol.iterator]());
    while (true) {
        const results = iterators.map(i => i.next());
        if (results.some(r => r.done)) {
            break;
        }
        yield results.map(r => r.value);
    }
}

function* zip_equal(...iterables: Iterable<any>[]) {
    const iterators = iterables.map(i => i[Symbol.iterator]());
    while (true) {
        const results = iterators.map(i => i.next());
        const all = results.every(r => r.done);
        if (all) {
            break;
        }
        if (!all && results.some(r => r.done)) {
            throw new Error("Iterables are not of equal length");
        }
        yield results.map(r => r.value);
    }
}

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
        let arr = [1, 2, 3];
        expect([...Stream.from(arr)]).toEqual(arr);
    })
})

describe("Stream.toArray()", () => {
    let small_arr = [1, 2, 3];

    it("should return an array", () => {
        expect(Stream.from(small_arr).toArray()).toEqual(small_arr);
    })

    it("should return a new array", () => {
        expect(Stream.from(small_arr).toArray()).not.toBe(small_arr);
    })

    it("should be the same as the spread operator", () => {
        let s = Stream.from(small_arr);
        expect(s.toArray()).toEqual([...s]);
    })

});


describe("Stream.toMap()", () => {
    let arr: Array<[number, string]> = [[1, "one"], [2, "two"], [3, "three"]];

    it("should work with empty streams", () => {
        let s = Stream.from([])
            .toMap();
        expect(s).toBeInstanceOf(Map);
        expect(s).toEqual(new Map());
    })

    it("should convert to a Map", () => {
        let s = Stream.from(arr)
            .toMap();
        expect(s).toBeInstanceOf(Map);
        expect(s).toEqual(new Map(arr));
    })

    it("should not compile with a non-tuple type", () => {
        expect(() => {
            // @ts-expect-error
            Stream.from([1, 2, 3]).toMap();
        }).toThrow(TypeError)
    })
});

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