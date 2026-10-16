import { Individuals, Families, Enum_, Name_, Events, toArray, Dic, DicDate, Enum, List_ } from './index.js';

export class Individual {
	#findBaptismEvent(id) {
		let tempEvt = '';
		if (this._Events.reli) {
			toArray(this._Events.reli.pri).forEach(evtID => {
				const evt = $tree.evt[evtID];
				if (evt.q === 'Baptism' || evt.q === 'Christening') {
					tempEvt = evtID;
				}
			});
		}
	return new Event_(tempEvt, id);
	}
	#dummy;
	constructor(id) {
		this.raw = $tree.ind[id] ? $tree.ind[id] : {};
		this.#dummy = id == '-' ? this : Individuals.get('-');
		this.Class = 'Individual';
		this.ID = id;
		this.IsReal = id !== '-';
		this.Gender = new Enum_(this.raw.g || '', 'Gender');
		this.Name = new Name_(this);
		this.Mother = this.#dummy;
		this.Father = this.#dummy;
		this.Birth = Events.get('-');
		this.BirthCeremony = Events.get('-');
		this.Birth.Assistant = this.#dummy;
		this.Birth.Gestation = this.Birth.Age
		this.BirthCeremony.Officiator = this.#dummy;
		this.Death = Events.get('-');
		this.Death.Cause = '';
		this.IsDead = false;
		this.Family = Families.get('-');
		this.Fathers = new List_();
		this.Mothers = new List_();
		this.Families = new List_();
		this.Parents = new List_();
		this.Events = new List_();
		if (this.raw.ref && this.raw.ref.rel) {
			let rels = (this.raw.ref.rel instanceof Array ? this.raw.ref.rel : [this.raw.ref.rel])  // convert single ref to array
			let i=0, rel, type, types = { B:'_Biological', A:'_Adopted', F:'_Fostered'};
			while (rel = $tree.rel[rels[i++]]) {
				if (rel.k && types[rel.k]) {
					type = types[rel.k];
					if (!this.raw[type]) this.raw[type] = [];
					this.raw[type].push(`${rel.fam}`);  // add to list of biological, adoption or foster families he/she is a child in
				} else {
					this.Families.push(`${rel.fam}`); // add to list of families he/she is a parent/partner in
				}
			}
		}
	}

	Pronoun(type = "P", plural = false) {
		let gender = this.Gender.ID;
		if (this.Class === 'SocialEntity' && !gender) gender = 'N';
		return Dic(`Pn${type}_${gender}`,`${plural ? '{attr:"P' : '{}'}`);
	}

	get Link() { return this.IsReal ? `<span class="individual-link" data-id="${this.ID}">${this.Name}</span>` : ''; };
	get LinkShort() { return this.IsReal ? `<span class="individual-link" data-id="${this.ID}">${this.Name.KnownAs}</span>` : ''; };
	get IsOrWas() { 
		const root = 'ToBe'+(this.IsDead ? '_Past' : '_Present')
		const tentative = Dic(root, {peek: true, gender: this.Gender.ID}); 
		return tentative ? tentative : Dic(root);
	};
}
