import {Stream} from "~/index"

function* zip(...iterables: Iterable<any>[]) {
    const iterators = iterables.map(i => i[Symbol.iterator]());
    while (true) {
        const results = iterators.map(i => i.next());
        if (results.every(r => r.done)) {
            break;
        }
        yield results.map(r => r.value);
    }
}

function* zip_equal(...iterables: Iterable<any>[]) {
    const iterators = iterables.map(i => i[Symbol.iterator]());
    while (true) {
        const results = iterators.map(i => i.next());
        if (results.some(r => r.done)) {
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
            for (let [x, y] of zip(Stream.from(small_arr), small_arr)) {
                expect(x).toBe(y);
            }
        }).not.toThrow();
    })
    it("should be able to expand into an array", () => {
        let arr = [1, 2, 3];
        expect([...Stream.from(arr)]).toEqual(arr);
    })
})

describe("Stream.map()", () => {
    let numbers = [1, 2, 3];
    it("should map values", () => {
        let s = Stream.from(numbers).map(x => x * 2);
        expect([...s]).toEqual([2, 4, 6]);
    })
    it("should map values with a different type", () => {
        let s = Stream.from(numbers).map(x => x.toString());
        expect([...s]).toEqual(["1", "2", "3"]);
    })
    it("should behave like a normal map", () => {
        let s = Stream.from(numbers).map(x => x * 2);
        expect([...s]).toEqual(numbers.map(x => x * 2));
    })
    it("should be chainable", () => {
        let s = Stream.from(numbers).map(x => x * 2).map(x => x.toString());
        expect([...s]).toEqual(["2", "4", "6"]);
    })
});

describe("Stream.filter()", () => {
    let numbers = [1, 2, 3, 4, 5, 6];
});