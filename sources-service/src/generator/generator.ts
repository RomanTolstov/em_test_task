const SOURCE_DATA_ALLOWED_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const SOURCE_DATA_RANDOM_STRING_LENGTH_DEFAULT = 10;
const SOURCE_DATA_RANDOM_NUMBER_FROM_DEFAULT = 0;
const SOURCE_DATA_RANDOM_NUMBER_TO_DEFAULT = 100000;
const SOURCE_DATA_MAX_ITEMS_COUNT = 1000;

/**
 * Class to generate random data
 */
export class Generator {

	/**
	 * Returns random generated string with length equal to numeric parameter.
	 * @param length Result string length. If not specified SOURCE_DATA_RANDOM_STRING_LENGTH_DEFAULT is used.
	 */
	private random_string(
		length?: number
	): string {
		length = length ?? SOURCE_DATA_RANDOM_STRING_LENGTH_DEFAULT;
		let result = '';
		while (result.length < length) {
			result += SOURCE_DATA_ALLOWED_CHARS.charAt(Math.floor(Math.random() * SOURCE_DATA_ALLOWED_CHARS.length));
		}
		return result;
	}

	/**
	 * Returns random generated integer.
	 * @param from Minimal result value. If not specified SOURCE_DATA_RANDOM_NUMBER_FROM_DEFAULT is used.
	 * @param to Maximal result value. If not specified SOURCE_DATA_RANDOM_NUMBER_TO_DEFAULT is used.
	 */
	private random_number(
		from?: number,
		to?: number
	): number {
		from = from ?? SOURCE_DATA_RANDOM_NUMBER_FROM_DEFAULT;
		to = to ?? SOURCE_DATA_RANDOM_NUMBER_TO_DEFAULT;
		return Math.floor(Math.random() * (to - from)) + from;
	}

	/**
	 * Returns random generated boolean.
	 */
	private random_bool(): boolean {
		return Math.random() * 2 > 1;
	}

	/**
	 * Generates data.
	 * @param count Number of data items to be generated. If not specified SOURCE_DATA_RANDOM_NUMBER_FROM_DEFAULT is used.
	 * @returns generated SourceDataItem array.
	 */
	generate_data(
		count: number,
		offset: number
	): any[] {
		const result: any[] = [];
		for (let i = 0; i < SOURCE_DATA_MAX_ITEMS_COUNT - offset && i < count; i++) {
			result.push({
				string_value: this.random_string(),
				number_value: this.random_number(),
				boolean_value: this.random_bool()
			});
		}
		return result;
	}
}