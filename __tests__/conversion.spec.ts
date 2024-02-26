import {Stream} from "~/index"

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
        })
    })

    it("should be constructable from a complex stream", () => {
        const orgArr: [string, number][] = arr.map(([k, v]) => [v, k]);

        const map = new Map(orgArr);
        const result = Stream.from(map)
            .filter(([_, v]) => v % 2 == 0)
            .map(([k, v]): [string, number] => [k, 2 * v])
            .toMap()
        expect( result).toEqual(new Map([["two", 4]]));
    })
});

describe("Stream.toSet()", () => {
    let arr = [1, 2, 3, 1, 2, 3];

    it("should work with empty streams", () => {
        let s = Stream.from([])
            .toSet();
        expect(s).toBeInstanceOf(Set);
        expect(s).toEqual(new Set());
    })

    it("should convert to a Set", () => {
        let s = Stream.from(arr)
            .toSet();
        expect(s).toBeInstanceOf(Set);
        expect(s).toEqual(new Set(arr));
    })

    it("should be the same as the using Set constructor", () => {
        let s = Stream.from(arr);
        expect(s.toSet()).toEqual(new Set(s));
    })
});
