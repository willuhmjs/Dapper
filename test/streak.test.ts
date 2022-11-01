import { streak } from "../src/lib/streak";

test('empty streak returns 0', () => {
	expect(streak([], 1)).toBe(0);
});

test('single-element streak returns 1', () => {
	expect(streak([431434], 1)).toBe(1);
});

test('streak can count normally', () => {
	const numbers = [10, 15, 24, 25, 36, 37, 38, 39]
	expect(streak(numbers, 10)).toBe(4)
});

test('early ending streak returns 1', () => {
	const numbers = [10, 16, 24, 25, 36, 37, 38, 39]
	expect(streak(numbers, 5)).toBe(1)
});