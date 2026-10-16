import { Ind, toArray, Dic, DicDate, Enum, Enum_, Name_, Event, List_ } from './index.js';

export class Family {
	#name=null
	constructor(id) {
		this.Class = 'Family';
		this.ID = id;
		this.raw = $tree.fam[id] ? $tree.fam[id] : {};
		this.FamilyLine = new Enum_(this.raw.s || '', 'FamilyLine');
		this.Parents = new List_();
		this.Husband = new List_();
		this.Wife = new List_();
		this.Children = new List_();
	}
	get Name() {
		if (!this.#name) {
			this.#name = new Name_(this);
		}
		return this.#name;
	}
}
