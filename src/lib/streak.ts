/**
 * Returns the amount of numbers in a row that are seperated by less than (or equal to) the max gap.
 * This only goes up to the first streak that is broken. For example, [1, 100, 101, 102, 103] with a max gap of 2 will return 0.
 * @param numbers The numbers to check.
 * @param maxGap The maximum gap between numbers.
 * 
 * @example
 * ```ts
 * const numbers = [10, 15, 24, 25, 36, 37, 38, 39]
 * const streakAmount = streak(numbers, 10) // 4
 * ```
 */
export function streak(numbers: number[], maxGap: number): number {
	// If there are no numbers, return 0
	if (numbers.length === 0) return 0

	// If there is one number, it counts as a streak of 1
	if (numbers.length === 1) return 1

	// The amount of numbers in a row
	let streakAmount = 0

	for (let i = 0; i < numbers.length; i++) {
		// If the next number is within the max gap, increase the streak amount
		if (numbers[i + 1] - numbers[i] <= maxGap) {
			streakAmount++
		} else {
			// If the next number is not within the max gap, break the loop
			break
		}
	}

	return streakAmount + 1;
}