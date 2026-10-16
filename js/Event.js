import { Date_, Duration_, Events, Individuals,  Organisations, Places } from './index.js';

export class Event {
	constructor(id) {
		this.obj = $tree.evt[id] ? $tree.evt[id] : {};
		this._dummy = id == '-' ? this : Events.get('-');
		// e.g. {"k": "asso","pri": {"1": {"ind": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]}},"sec":
		this.ID = id;
		this.Principals = [];
		this.Associates = [];
		if (this.obj.pri && !Array.isArray(this.obj.pri)) {
			this.obj.pri = [this.obj.pri];
			this.obj.pri.forEach(
				(role,idx)=>Object.keys(role).forEach(
					(key)=>Object.keys(role[key]).forEach(
						(k)=>{if (Array.isArray(role[key][k])) {
							role[key][k].forEach(indID => {
								this.Principals.push({Role: key, Individual: Individuals.get(indID+'')});
								Individuals.get(indID+'').Events.add(this);
							});
						} else {
							this.Principals.push({Role: key, Individual: Individuals.get(role[key][k]+'')});
							Individuals.get(role[key][k]+'').Events.add(this);
						}
					})
				)
			);
		}
		if (this.obj.sec && !Array.isArray(this.obj.sec)) {
			this.obj.sec = [this.obj.sec];
			this.obj.sec.forEach(
				(role,idx)=>Object.keys(role).forEach(
					(key)=>Object.keys(role[key]).forEach(
						(k)=>{if (Array.isArray(role[key][k])) {
							role[key][k].forEach(indID => {
								this.Associates.push({Role: key, Individual: Individuals.get(indID+'')});
								Individuals.get(indID+'').Events.add(this);
							});
						} else {
							this.Associates.push({Role: key, Individual: Individuals.get(role[key][k]+'')});
							Individuals.get(role[key][k]+'').Events.add(this);
						}
					})
				)
			);
		}

		this.Age = new Duration_(this._age);
		this.Date = new Date_(this.obj?.w || '');
		this.Kind = this.obj.k;
		this.Type = this.obj.q || '';
		this.Extant = !!this._ID;
	}
	get Place() {
		return Places.get(this.obj.pla || '-');
	}
}
