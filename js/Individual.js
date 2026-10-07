import { Individuals, Families, Enum_, Name_, Event_, toArray, Dic, DicDate, Enum, List_ } from './index.js';

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
	constructor(id) {
		this.Class = 'Individual';
		this._ID = id;
		this._real = id !== '-';
		this._ind = $tree.ind[id] ? $tree.ind[id] : {};
		this._Gender = new Enum_(this._ind.g || '', 'Gender');
		this._Name = new Name_(this._ind.n || {}, this.Class, this._Gender);
		this._Events = { ...this._ind.evt, pri: {}, sec: {} };
		this._Birth = new Event_(this._Events?.birt?.pri || '', id);
		this._BirthCeremony = this.#findBaptismEvent(id);
		this._dummy = Individuals.get('-');
		if (id !== '-') {
			Object.defineProperty(this._Birth, 'Assistant', {
				value: this._Birth.Role('Assistant') 
				? Individuals.get(this._Birth.Role('Assistant')) 
				: this._dummy  // dummy individual
			});
			Object.defineProperty(this._BirthCeremony, 'Officiator', {
				value: this._BirthCeremony.Role('Officiator') 
				? Individuals.get(this._BirthCeremony.Role('Officiator')) 
				: this._dummy  // dummy individual
			});
			if (this._BirthCeremony.Type)  this._BirthCeremony.Type = Enum('CeremonyType', this._BirthCeremony.Type);
		}
		Object.defineProperty(this._Birth, 'Gestation', { value: this._Birth.Age });
		this._Death = new Event_(this._Events?.deat?.pri || '', id);
		this._Family = Families.get('-');
		this._Fathers = new List_();
		this._Mothers = new List_();
		this._Families = new List_();
		if (this._ind.ref && this._ind.ref.rel) {
			let rels = (this._ind.ref.rel instanceof Array ? this._ind.ref.rel : [this._ind.ref.rel])  // convert single ref to array
			let i=0, rel, type, types = { B:'_Biological', A:'_Adopted', F:'_Fostered'};
			while (rel = $tree.rel[rels[i++]]) {
				if (rel.k && types[rel.k]) {
					type = types[rel.k];
					if (!this._ind[type]) this._ind[type] = [];
					this._ind[type].push(`${rel.fam}`);  // add to list of biological, adoption or foster families he/she is a child in
				} else {
					this._Families.push(`${rel.fam}`); // add to list of families he/she is a parent/partner in
				}
			}
		}
	}

	Pronoun(type = "P", plural = false) {
		let gender = this._Gender.ID;
		if (this.Class === 'SocialEntity' && !gender) gender = 'N';
		return Dic(`Pn${type}_${gender}`,`${plural ? '{attr:"P' : '{}'}`);
	}

	get Birth() { return this._Birth; };
	get BirthCeremony() { return this._BirthCeremony; };
	get Death() { return this._Death; };
	get Family() { return this._Family; };
	set Family(family) { this._Family = family; };
	get Families() { return this._Families; };
	set Families(families) { this._Families.push(...families); };
	get Father() { return this._Family.Husband[0] || this._dummy; };
	get Fathers() { return this._Fathers; };
	get Gender() { return this._Gender; };
	get ID() { return this._ID; };
	get IsDead() { return this._Death._Extant; };
	get Link() { return this._real ? `<span class="individual-link" data-id="${this._ID}">${this._Name}</span>` : ''; };
	get LinkShort() { return this._real ? `<span class="individual-link" data-id="${this._ID}">${this._Name.KnownAs}</span>` : ''; };
	get Mother() { return this._Family.Wife[0] || this._dummy; };
	get Mothers() { return this._Mothers; };
	get Name() { return this._Name; };
	get Parents() { return [...this._Fathers, ...this._Mothers]; };
	get IsOrWas() { 
		const root = 'ToBe'+(this._Death._Extant ? '_Past' : '_Present')
		const tentative = Dic(root, {peek: true, gender: this._Gender.ID}); 
		return tentative ? tentative : Dic(root);
	};
}
