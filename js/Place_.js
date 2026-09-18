import { Name_ } from './Name_.js';

export class Place_ {
	constructor(id) {
		this._id = id;
		this.Class = 'Place';
		this._pla = $tree.pla[id] || null;
		this._Name = this._pla ? new Name_(this._pla.n || {}, this.Class) : '';
	}

	get ID() { return this._id; }
	get Name() { return this._Name; }
}
