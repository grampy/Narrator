import { Ind, toArray, Dic, DicDate, Enum, Enum_, Name_, Event_, List_ } from './index.js';

export class Family {
	constructor(id) {
		this.Class = 'Family';
		this._ID = id;
		this._fam = $tree.fam[id] ? $tree.fam[id] : {};
		this._familyline = new Enum_(this._fam.s || '', 'FamilyLine');
		this._Parents = new List_();
		this._Husband = new List_();
		this._Wife = new List_();
		this._Children = new List_();
	}
	get Children() { return this._Children; }
	set Children(children) { this._Children.add(children); }
	get Wife() { return this._Wife; }
	set Wife(wife) { this._Wife.add(wife); }
	get Husband() { return this._Husband; }
	set Husband(husband) { this._Husband.add(husband); }
	get Parents() { return this._Parents; }
	set Parents(parents) { this._Parents.add(parent); }
	get FamilyLine() { return this._familyline; }
}
