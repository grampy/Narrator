import { Dic, Enum } from './utils.js';

export class EntityName_ {
	constructor(n, Class, gender) {
		this.Class = Class;
		this._gender = gender;
		this._name = Array.isArray(n)
			? n.find(name => name.k === 'b') || n[0]
			: n;
	}

	toString() {
		return this._name.e;
	}

	get Narrative() {
		return this._name.e != '' && this.Class === 'Place'  
			? ' '+[Enum('PlacePrefix', this._name.p ||'In'), this._name.e].filter(Boolean).join(' ')	
			: '';
	}
	// index{key,id,entry} key = sorting & tree index, id = individual ID, entry = display text
	get index() { return {key: this._name.e, id: this._id, entry: this._name.e}; }
}
