/**
 * Creates an array with numbers in a specified range, excluding some numbers.
 *
 * @param start The start of the range (inclusive).
 * @param end The end of the range (exclusive).
 * @param exclude An array of numbers to skip.
 *
 * @returns An array of numbers from start to end-1, excluding those in exclude.
 */
function range(start: number, end: number, exclude: number[] = []): number[] {
    return Array
        .from({ length: end - start }, (_, i): number => start + i)
        .filter((num): boolean => !exclude.includes(num));
}

export default {
    range,
};
