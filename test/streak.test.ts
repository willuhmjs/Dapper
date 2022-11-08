import { streak } from "../src/lib/streak";

test("empty streak returns -1", () => {
	expect(streak([], 1)).toBe(-1);
});

test("single-element streak returns -1", () => {
	expect(streak([431434], 0)).toBe(-1);
});

test("streak can count normally", () => {
	const numbers = [39, 38, 37, 36, 25, 24, 15, 10];
	expect(streak(numbers, 10)).toBe(3);
});

test("early ending streak returns 0th index", () => {
	const numbers = [50, 38, 37, 36, 25, 24, 16, 10];
	expect(streak(numbers, 5)).toBe(0);
});

test("streak should not exist for more than a month", () => {
	const data = [1667490974895, 1667490624189, 1664812225776];

	expect(streak(data, 1000 * 60 * 60 * 24)).toBe(1);
});
