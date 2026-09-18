import { Duration_ } from './Duration_.js';
import { Date_ } from './Date_.js';
import { Place_ } from './Place_.js';
import { Ind } from './utils.js';

export class Event_ {
	constructor(evtID, id) {
		this._evt = evtID ? $tree.evt[evtID] : '';
		this._age = '';

		if (evtID && this._evt?.pri) {
			for (const role of Object.values(this._evt.pri)) {
				if (role.ind === id && role.age) {
					this._age = role.age;
				}
			}
		}

		this._Age = new Duration_(this._age);
		this._Date = new Date_(this._evt?.w || '');
		this._Place = new Place_(this._evt?.pla || '');
		this._Type = this._evt?.q || '';
		this._Extant = !!evtID; 
	}

	Role(role) {
		if (!this._evt?.sec) return null;

		for (const [roleID, roleData] of Object.entries(this._evt.sec)) {
			if ($tree.rol[roleID]?.t === role) {
				return roleData.ind;
			}
		}
		return null;
	}

	get Age() { return this._Age; };
	get Date() { return this._Date; };
	get Extant() {return this._Extant; };
	get Place() { return this._Place; };
	get Type() { return this._Type; };
	set Type(type) {this._Type = type};
}
