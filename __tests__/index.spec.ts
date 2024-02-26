import {Stream} from "~/index"

describe("Stream", () => {
    it("should be iterable", () => {
        let arr = [1, 2, 3];

        const stream = Stream.from(arr)[Symbol.iterator]();

        for (const x of arr) {
            expect(x).toBe(stream.next().value);
        }

        expect(stream.next().done).toBe(true);
    })
})