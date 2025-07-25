import { Stream, errors } from "~/index";
const { ArgCountError, ArgTypeError, ArgValueError } = errors;

describe("Stream.map()", () => {

    it("should throw with invalid number of arguments", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .map();
        }).toThrow(ArgCountError);

        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .map((x) => -x, 5);
        }).toThrow(ArgCountError);
    });

    it("should throw with invalid argument", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .map(5);
        }).toThrow(ArgTypeError);
    });

    let numbers = [1, 2, 3];

    it("should map values", () => {
        let s = Stream.from(numbers)
            .map(x => x * 2);
        expect([...s]).toEqual([2, 4, 6]);
    });

    it("should map values with a different type", () => {
        let s = Stream.from(numbers)
            .map(x => x.toString());
        expect([...s]).toEqual(["1", "2", "3"]);
    });

    it("should behave like a normal map", () => {
        let s = Stream.from(numbers)
            .map(x => x * 2);
        expect([...s]).toEqual(numbers.map(x => x * 2));
    });

    it("should be chainable", () => {
        let s = Stream.from(numbers)
            .map(x => x * 2)
            .map(x => x.toString());
        expect([...s]).toEqual(["2", "4", "6"]);
    });
});

describe("Stream.filter()", () => {
    it("should throw with invalid number of arguments", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .filter();
        }).toThrow(ArgCountError);

        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .filter((x) => x > 5, 5);
        }).toThrow(ArgCountError);
    });

    it("should throw with invalid argument", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .filter(5);
        }).toThrow(ArgTypeError);
    });

    let numbers = [1, 2, 3, 4, 5, 6];
    it("should filter odd numbers", () => {
        let s = Stream.from(numbers)
            .filter(x => x % 2 === 0);
        expect([...s]).toEqual([2, 4, 6]);
    });

    it("should filter even numbers", () => {
        let s = Stream.from(numbers)
            .filter(x => x % 2 !== 0);
        expect([...s]).toEqual([1, 3, 5]);
    });

    it("should be chainable", () => {
        let s = Stream.from(numbers)
            .filter(x => x % 2 === 0)
            .filter(x => x % 3 === 0);
        expect([...s]).toEqual([6]);
    });

    it("should be chainable with map", () => {
        let s = Stream.from(numbers)
            .filter(x => x % 2 === 0)
            .map(x => x * 2);
        expect([...s]).toEqual([4, 8, 12]);
    });
});

describe("Stream.skip()", () => {
    it("should throw with invalid number of arguments", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .skip();
        }).toThrow(ArgCountError);

        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .skip(1, 2);
        }).toThrow(ArgCountError);
    });

    it("should throw with invalid argument", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .skip("1");
        }).toThrow(ArgTypeError);

        expect(() => {
            Stream.range(10)
                .skip(-1);
        }).toThrow(ArgValueError);
    });

    let numbers = [1, 2, 3, 4, 5, 6];

    it("should skip the first 3 numbers", () => {
        let s = Stream.from(numbers)
            .skip(3);
        expect([...s]).toEqual([4, 5, 6]);
    });

    it("should skip the first 0 numbers", () => {
        let s = Stream.from(numbers)
            .skip(0);
        expect([...s]).toEqual(numbers);
    });

    it("should skip all the numbers", () => {
        let s = Stream.from(numbers)
            .skip(numbers.length);
        expect([...s]).toEqual([]);
    });

    it("should be chainable", () => {
        let s = Stream.from(numbers)
            .skip(3)
            .skip(2);
        expect([...s]).toEqual([6]);
    });
});

describe("Stream.take()", () => {
    let small_arr = [1, 2, 3];

    it("should throw with invalid number of arguments", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .take();
        }).toThrow(ArgCountError);
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .take(1, 2);
        }).toThrow(ArgCountError);
    });

    it("should throw if argument is not a number", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .take("1");
        }).toThrow(ArgTypeError);
        expect(() => {
            Stream.range(10)
                .take(NaN);
        });
    });

    it("should throw if number is negative", () => {
        expect(() => {
            Stream.range(10)
                .take(-1);
        }).toThrow(ArgValueError);
    });

    it("should take the first 3 numbers", () => {
        let s = Stream.from(small_arr)
            .take(3);
        expect([...s]).toEqual(small_arr);
    });

    it("should take the first 0 numbers", () => {
        let s = Stream.from(small_arr)
            .take(0);
        expect([...s]).toEqual([]);
    });

    it("should take all the numbers", () => {
        let s = Stream.from(small_arr)
            .take(small_arr.length);
        expect([...s]).toEqual(small_arr);
    });

    it("should be chainable", () => {
        let s = Stream.from(small_arr)
            .take(2)
            .take(2);
        expect([...s]).toEqual([1, 2]);
    });

    it("should exit if the stream is exhausted", () => {
        let s = Stream.from(small_arr)
            .take(100);
        expect([...s]).toEqual(small_arr);
    });
});

describe("Stream.enumerate()", () => {
    it("should throw with invalid number of arguments", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .enumerate(1);
        }).toThrow(ArgCountError);
    });

    let numbers = [1, 2, 3, 4, 5, 6];

    it("should enumerate the numbers", () => {
        let s = Stream.from(numbers)
            .enumerate();
        expect([...s])
            .toEqual([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]);
    });

    it("should be chainable", () => {
        let s = Stream.from(numbers)
            .enumerate()
            .map(([i, x]) => i * x);
        expect([...s]).toEqual([0, 2, 6, 12, 20, 30]);
    });
});

describe("Stream.scan()", () => {
    it("should throw with invalid number of arguments", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .scan(1);
        }).toThrow(ArgCountError);
    });

    it("should throw with invalid argument types", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .scan(1, 1);
        }).toThrow(ArgTypeError);
    });


    it("should produce sums of natural numbers up to number", () => {
        const data = Stream.range(1, 6)
            .scan(0, (a, b) => a + b)
            .toArray();
        expect(data).toEqual([0, ...Stream.range(1, 6)].map(n => n * (n + 1) / 2));
        expect(data).toEqual([0, 1, 3, 6, 10, 15]);
    });

    it("should produce a sequence of arrays", () => {
        const data = Stream.range(5)
            .scan([] as number[], (acc, elem) => [...acc, elem]);
        let size = 0;
        for (const arr of data) {
            expect(arr).toEqual([...Stream.range(size)]);
            size++;
        }
    });
});

describe("Stream.flatten()", () => {
    it("should throw with invalid number of arguments", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .flatten(1);
        }).toThrow(ArgCountError);
    });

    let numbers = [[1, 2], [3, 4], [5, 6]];

    it("should flatten the numbers", () => {
        let s = Stream.from(numbers)
            .flatten();
        expect([...s]).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should be chainable", () => {
        let s = Stream.from(numbers)
            .flatten()
            .map(x => x * 2);
        expect([...s]).toEqual([2, 4, 6, 8, 10, 12]);
    });

    it("should flatten stream of streams", () => {
        let s = Stream.from(numbers)
            .map(x => Stream.from(x))
            .flatten();
        expect([...s]).toEqual([1, 2, 3, 4, 5, 6]);
    });
});

describe("Stream.chain()", () => {
    it("should throw with invalid number of arguments", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .chain();
        }).toThrow(ArgCountError);
    });

    it("should throw with invalid argument", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .chain(5);
        }).toThrow(ArgTypeError);
    });

    let numbers = [1, 2, 3];
    let letters = ["a", "b", "c"];

    it("should chain the numbers and letters", () => {
        let s = Stream.from(numbers)
            .chain(letters);
        expect([...s]).toEqual([1, 2, 3, "a", "b", "c"]);
    });

    it("should be chainable", () => {
        let s = Stream.from(numbers)
            .chain(letters)
            .map(x => x.toString());
        expect([...s]).toEqual(["1", "2", "3", "a", "b", "c"]);
    });
});

describe("Stream.chunk()", () => {
    it("should throw with invalid number of arguments", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .chunk();
        }).toThrow(ArgCountError);
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .chunk(1, 2);
        });
    });

    it("should throw with invalid argument", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .chunk("1");
        }).toThrow(ArgTypeError);
    });

    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    it("should throw when n <= 0", () => {
        expect(() => Stream.from(numbers).chunk(0)).toThrow(ArgValueError);
        expect(() => Stream.from(numbers).chunk(-1)).toThrow(ArgValueError);
    });

    it("should chunk the numbers (n=1)", () => {
        const s = Stream.from(numbers).chunk(1);
        expect([...s]).toEqual([[1], [2], [3], [4], [5], [6], [7], [8], [9]]);
    });

    it("should chunk the numbers (n=2)", () => {
        const s = Stream.from(numbers).chunk(2);
        expect([...s]).toEqual([[1, 2], [3, 4], [5, 6], [7, 8], [9]]);
    });

    it("should chunk the numbers (n=3)", () => {
        const s = Stream.from(numbers).chunk(3);
        expect([...s]).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    });

    it("should be chainable", () => {
        let s = Stream.from(numbers).chunk(3).map(x => x.join(""));
        expect([...s]).toEqual(["123", "456", "789"]);
    });
});

describe("Stream.slide()", () => {
    it("should throw with invalid number of arguments", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .slide();
        }).toThrow(ArgCountError);
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .slide(1, 2);
        });
    });

    it("should throw with invalid argument", () => {
        expect(() => {
            Stream.range(10)
                // @ts-expect-error
                .slide("1");
        }).toThrow(ArgTypeError);
        expect(() => {
            Stream.range(10)
                .slide(-1);
        }).toThrow(ArgValueError);
    });

    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    it("should throw when n <= 0", () => {
        expect(() => Stream.from(numbers).slide(0)).toThrow(ArgValueError);
        expect(() => Stream.from(numbers).slide(-1)).toThrow(ArgValueError);
    });

    it("should slide the numbers (n=1)", () => {
        const s = Stream.from(numbers).slide(1);
        expect([...s]).toEqual([[1], [2], [3], [4], [5], [6], [7], [8], [9]]);
    });

    it("should slide the numbers (n=2)", () => {
        const s = Stream.from(numbers).slide(2);
        expect([...s]).toEqual([
            [1, 2], [2, 3], [3, 4], [4, 5],
            [5, 6], [6, 7], [7, 8], [8, 9]
        ]);
    });

    it("should slide the numbers (n=3)", () => {
        const s = Stream.from(numbers).slide(3);
        expect([...s]).toEqual([
            [1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6],
            [5, 6, 7], [6, 7, 8], [7, 8, 9]
        ]);
    });

    it("should be chainable", () => {
        let s = Stream.from(numbers).slide(3).map(x => x.join(""));
        expect([...s]).toEqual(["123", "234", "345", "456", "567", "678", "789"]);
    });

    it("should slide the numbers (n=4)", () => {
        const s = Stream.from(numbers).slide(4);
        expect([...s]).toEqual([
            [1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6],
            [4, 5, 6, 7], [5, 6, 7, 8], [6, 7, 8, 9]
        ]);
    });

    it("should return empty stream if source is shorter than n", () => {
        const s = Stream.from([1, 2, 3]).slide(4);
        expect([...s]).toEqual([]);
    });
});
