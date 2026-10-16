import { Name_ } from './Name_.js';

export class Place {
	constructor(id) {
		this._id = id;
		this.Class = 'Place';
		this.raw = $tree.pla[id] || null;
		this._Name = this.raw ? new Name_(this || {}) : '';
	}

	get ID() { return this._id; }
	get Name() { return this._Name; }
	get Link() { return this._Name ? `<span class="place-link" data-id="${this.ID}">${this.Name}</span>` : ''; };

}
