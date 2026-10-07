import {Enum} from './utils.js';

export class Enum_ {
	constructor(id, _class) {
		this._ID = id || '';
		this._Class = _class;
	}

	get ID() { return this._ID; }
	toString() { return Enum(this._Class,this._ID)}
}
