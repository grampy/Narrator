import {Enum} from './utils.js';

export class Gender_ {
	constructor(id) {
		this._ID = id || '';
	}

	get ID() { return this._ID; }
	toString() { return Enum('Gender',this._ID)}
}
