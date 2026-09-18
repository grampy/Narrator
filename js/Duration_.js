export class Duration_ {
	#age;
	#regexp = /((<|>)? *((\d+)y)? *((\d+)m)? *((\d+)d)?)|(stillborn|child|infant)?/i;

	constructor(age) {
		this.#age = this.#regexp.exec(age || '') || [];
	}

	get Approximation() { return this.#age[2] || ''; }
	get Years() { return this.#age[4] || ''; }
	get Months() { return this.#age[6] || ''; }
	get Days() { return this.#age[8] || ''; }
	get Weeks() { return this.Days ? Math.trunc(this.Days / 7) : ''; }
}
