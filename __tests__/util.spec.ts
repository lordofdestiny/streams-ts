import {UnequalIterableLengthError, zip, zip_equal} from '~/util'

describe('zip', () => {
    it('should zip two arrays', () => {
        const a = [1, 2, 3];
        const b = ['a', 'b', 'c'];
        const result = Array.from(zip(a, b));
        expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
    });

    it('should zip three arrays', () => {
        const a = [1, 2, 3];
        const b = ['a', 'b', 'c'];
        const c = [true, false, true];
        const result = Array.from(zip(a, b, c));
        expect(result).toEqual([[1, 'a', true], [2, 'b', false], [3, 'c', true]]);
    });
})

describe('zip_equal', () => {
    it('should zip two arrays', () => {
        const a = [1, 2, 3];
        const b = ['a', 'b', 'c'];
        const result = Array.from(zip_equal(a, b));
        expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
    });
    it('should throw an error when zipping arrays of different lengths', () => {
        const a = [1, 2, 3];
        const b = ['a', 'b'];
        expect(() => Array.from(zip_equal(a, b)))
            .toThrow(UnequalIterableLengthError);
    });
    it('should zip three arrays', () => {
        const a = [1, 2, 3];
        const b = ['a', 'b', 'c'];
        const c = [true, false, true];
        const result = Array.from(zip_equal(a, b, c));
        expect(result).toEqual([[1, 'a', true], [2, 'b', false], [3, 'c', true]]);
    });
})