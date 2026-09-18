import { Name_ } from './Name_.js';
import { Event_ } from './Event_.js';
import { Ind, toArray, Dic, DicDate, Enum } from './utils.js';

export class Family {
	constructor(id) {
		this.Class = 'Family';
		this._ID = id;
		this._fam = $tree.fam[id] ? $tree.fam[id] : {};
		this._Parents = [];
		this._Husband = [];
		this._Wife = [];
		this.Children = []
	}
	get Wife() { return this._Wife; }
	set Wife(wife) { this._Wife.push(wife); }
	get Husband() { return this._Husband; }
	set Husband(husband) { this._Husband.push(husband); }
}
