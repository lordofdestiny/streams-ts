import { Stream, errors } from "~/index";
const { ArgCountError, ArgTypeError } = errors;

describe("Stream.toArray()", () => {
    it("should throw with invalid number of arguments", () => {
        expect(() => {
            // @ts-expect-error
            Stream.from([]).toArray(5);
        }).toThrow(ArgCountError);
    });

    let small_arr = [1, 2, 3];

    it("should return an array", () => {
        expect(Stream.from(small_arr).toArray()).toEqual(small_arr);
    });

    it("should return a new array", () => {
        expect(Stream.from(small_arr).toArray()).not.toBe(small_arr);
    });

    it("should be the same as the spread operator", () => {
        let s = Stream.from(small_arr);
        expect(s.toArray()).toEqual([...s]);
    });

});

describe("Stream.toMap()", () => {
    it("should throw with invalid number of arguments", () => {
        expect(() => {
            // @ts-expect-error
            Stream.from([]).toMap(5);
        }).toThrow(ArgCountError);
    });

    let arr: Array<[number, string]> = [[1, "one"], [2, "two"], [3, "three"]];

    it("should work with empty streams", () => {
        let s = Stream.from([])
            .toMap();
        expect(s).toBeInstanceOf(Map);
        expect(s).toEqual(new Map());
    });

    it("should convert to a Map", () => {
        let s = Stream.from(arr)
            .toMap();
        expect(s).toBeInstanceOf(Map);
        expect(s).toEqual(new Map(arr));
    });

    it("should not compile with a non-tuple type", () => {
        expect(() => {
            // @ts-expect-error
            Stream.from([1, 2, 3]).toMap();
        }).toThrow();
    });

    it("should throw an error if the stream is not a tuple", () => {
        expect(() => {
            // @ts-expect-error
            Stream.from([1, 2, 3]).toMap();
        }).toThrow(ArgTypeError);
    });

    it("should be constructable from a complex stream", () => {
        const orgArr: [string, number][] = arr.map(([k, v]) => [v, k]);

        const map = new Map(orgArr);
        const result = Stream.from(map)
            .filter(([_, v]) => v % 2 == 0)
            .map(([k, v]): [string, number] => [k, 2 * v])
            .toMap();
        expect(result).toEqual(new Map([["two", 4]]));
    });
});

describe("Stream.toSet()", () => {
    let arr = [1, 2, 3, 1, 2, 3];

    it("should throw with invalid number of arguments", () => {
        expect(() => {
            // @ts-expect-error
            Stream.from([]).toSet(5);
        }).toThrow(ArgCountError);
    });

    it("should work with empty streams", () => {
        let s = Stream.from([])
            .toSet();
        expect(s).toBeInstanceOf(Set);
        expect(s).toEqual(new Set());
    });

    it("should convert to a Set", () => {
        let s = Stream.from(arr)
            .toSet();
        expect(s).toBeInstanceOf(Set);
        expect(s).toEqual(new Set(arr));
    });

    it("should be the same as the using Set constructor", () => {
        let s = Stream.from(arr);
        expect(s.toSet()).toEqual(new Set(s));
    });
});

describe("Stream.join()", () => {
    it("should throw with invalid number of arguments", () => {
        expect(() => {
            // @ts-expect-error
            Stream.from([]).join(2, 4);
        }).toThrow(ArgCountError);
    });

    it("should throw with invalid type of arguments", () => {
        expect(() => {
            // @ts-expect-error
            Stream.from([]).join(2);
        }).toThrow(ArgTypeError);
    });

    it("should return an empty string for an empty stream", () => {
        let s = Stream.from([]);
        expect(s.join()).toEqual("");
        expect(s.join(", ")).toEqual("");
    });

    it("should join the elements", () => {
        let s = Stream.from(["a", "b", "c"]);
        expect(s.join()).toEqual("abc");
    });

    it("should join the elements with a separator: ' '", () => {
        let s = Stream.from(["a", "b", "c"]);
        expect(s.join(" ")).toEqual("a b c");
    });

    it("should join the elements with a separator ', '", () => {
        let s = Stream.from(["a", "b", "c"]);
        expect(s.join(", ")).toEqual("a, b, c");
    });
});