import { Dic, Enum } from './index.js';

export class Name_ {
	constructor(n, Class, gender) {
		this.Class = Class;
		this._gender = gender;
		this._name = Array.isArray(n)
			? n.find(name => name.k === 'b') || n[0]
			: n;
		if (this.Class === 'Individual') {
			this._namesLast = Array.isArray(this._name.l) ? 
			(this._name.l[1] ? this._name.l[0] + ' (' + this._name.l.splice(1).join(', ') + ')' :
			 this._name.l[0] ):
			 this._name.l || '';
			this._knownAs = this._name.c ? this._name.c : Array.isArray(this._name.f) ? this._name.f[0] : this._name.f || '';
			this._firstMiddle = Array.isArray(this._name.f) ? this._name.f.join(' ') : this._name.f || '';
		} else {
			this._namesLast = '';
			this._knownAs = this._name.e || '';
			this._firstMiddle = '';
		}
		this.delimIt = txt => (txt ? `"${txt}"` : '');
	}

	get FirstMiddle() { return this._firstMiddle; }
	get First() { return this._knownAs; }
	get KnownAs() { return this._knownAs; }
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
		return this._name.e
			? this._name.e
			: [this._name.p, this._firstMiddle, this.delimIt(this._name.c), this._namesLast, this._name.s].filter(Boolean).join(' ');
	}

	get Narrative() {
		return this._name.e != '' && this.Class === 'Place'  
			? ' '+[Enum('PlacePrefix', this._name.p ||'In'), this._name.e].filter(Boolean).join(' ')	
			: '';
	}
	// index{key,id,entry} key = sorting & tree index, id = individual ID, entry = display text
	get index() { return {key: this._namesLast, id: this._id, entry: this._firstMiddle}; }
}
