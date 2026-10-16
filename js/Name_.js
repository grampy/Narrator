import { Dic, Enum, Parser } from './index.js';

export class Name_ {
	constructor(obj) {
		this.Class = obj.Class;
		this._gender = obj._gender;
		this._name = obj.raw.n || null;
		this.objID = obj.ID;
		switch(this.Class) {
			case 'Individual':
			this._name = Array.isArray(this._name)
				? this._name.find(name => name.k === 'b') || this._name[0]
				: this._name || {};
			this._namesLast = Array.isArray(this._name.l) ? 
			(this._name.l[1] ? this._name.l[0] + ' (' + this._name.l.splice(1).join(', ') + ')' :
			 this._name.l[0] ):
			 this._name.l || '';
			 this._key = this._namesLast;
			this._knownAs = this._name.c ?
				this._name.c : Array.isArray(this._name.f) ?
				this._name.f[0] : this._name.f || 
				(this._name.p ? this._name.p + ' ' : '')+(this._name.l ? this._name.l : '');
			this._firstMiddle = Array.isArray(this._name.f) ? this._name.f.join(' ') : this._name.f || '';
			this.FullName = [this._name.p, this._firstMiddle, (this._name.c ? `"${this._name.c}"` : ''), this._namesLast, this._name.s].filter(Boolean).join(' ');
			this._entry = this.FullName;
			break;
		case 'Place':
		case 'Organization':
			this._knownAs = this._name.e || '';
			this.FullName = this._knownAs;
			break;
		case 'Family':
			this._knownAs = Parser.Phrase(Dic("FmtHusbandAndWife"), [
				/*0*/obj.Husband[0]?.Name?.KnownAs || '',
				/*1*/obj.Wife[0]?.Name?.KnownAs || ''
			]);
			this.FullName = Parser.Phrase(Dic("FmtHusbandAndWife"), [
				/*0*/obj.Husband[0]?.Name?.FullName || '',
				/*1*/obj.Wife[0]?.Name?.FullName || ''
			]);
			break;
		}
	}

	get FirstMiddle() { return this._firstMiddle|| ''; }
	get First() { return this._knownAs || ''; }
	get KnownAs() { return this._knownAs || ''; }
	get Last() { return Array.isArray(this._name.l) ? this._name.l[0] : this._name.l || ''; }
	get Prefix() { return this._name.p || ''; }
	get Title() { return this._name.p || ''; }
	get Suffix() { return this._name.s || ''; }
	get Nick() { return this._name.c || ''; }

	get Possessive() {
		const known = this._knownAs;
		const articled = this._name.d || Dic('ArticledName', { attr: this._gender, peek:true });
		let base = articled ? articled + known : known;
		const regexpList = (Dic('ArticledName', { attr: 'T2' }) || Dic('PossessiveProperNoun')).replace(/=/g, ':').split(':');

		for (let i = 0; i < regexpList.length; i += 2) {
			const regex = new RegExp(regexpList[i]);
			if (regex.test(base)) {
				return base.replace(regex, regexpList[i + 1]);
			}
		}
		return base;
	}

	toString() {
		return this.FullName;
	}

	get Narrative() {
		return this._name.e != '' && this.Class === 'Place'  
			? ' '+[Enum('PlacePrefix', this._name.p ||'In'), this._name.e].filter(Boolean).join(' ')	
			: '';
	}
	// index{key,id,entry} key = sorting & tree index, id = object ID, entry = display text
	get index() { return {key: this._key, id: this.objID, entry: this._entry}; }
}
