/**
 * Returns the index of the end of the current streak in the array.
 * Returns -1 if the streak doesn't exist.
 * @param numbers The numbers to check.
 * @param maxGap The maximum gap between numbers.
 *
 * @example
 * ```ts
 * const numbers = [10, 15, 24, 25, 36, 37, 38, 39]
 * const streakAmount = streak(numbers, 10) // 3
 * ```
 */
export function streak(numbers: number[], maxGap: number): number {
	// If there are no numbers, return -1
	if (numbers.length === 0) return -1;

	// If there is one number, the index of the streak is 0
	if (numbers.length === 1) return 0;

	// The amount of numbers in a row
	let streakAmount = 0;

	for (let i = 0; i < numbers.length; i++) {
		// If the next number is within the max gap, increase the streak amount
		if (numbers[i] - numbers[i + 1] <= maxGap) {
			streakAmount++;
		} else {
			// If the next number is not within the max gap, break the loop
			break;
		}
	}

	return streakAmount;
}
