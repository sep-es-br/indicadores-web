export function roundToDecimalPlaces(number: number, decimalPlaces: number): number {
	const factor = Math.pow(10, decimalPlaces);
	return Math.round(number * factor) / factor;
}

export function formatNumber(number: number): string {
	if (number < 10) {
		return `0${number}`;
	}
	return number.toString();
}