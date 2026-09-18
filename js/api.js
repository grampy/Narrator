class Date_ {
	constructor (date) {
		this._calendar = '';
		this._date = '';
		if (date) {
			Object.keys(date).forEach(function(key) {
				this._calendar = key;
				this._date = date[key];
			},this);
		}
		this._format = function (style) {
			var year, month, mon, day, date = this._date, prefix='';
			var months=['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			if ( date && /^[<>~]?(\d{4}|\d{6}|\d{8})$/.test(date)) {
				switch (date.length) {
				case 4:					//year only
				case 5:
					return date; break;
				case 9:
					prefix=date.substr(0,1);
					date=date.substr(1);
				case 8:
					style = style || Dic('Dates.FmtDateDefault.FmtYMD',{attr:'text'});
					if (style.indexOf('d') < 0) date = date.substr(0,6);
					style = style.replace('dd', date.substr(6,2)).replace('d', parseInt(date.substr(6,2)));
				case 7:
					if (date.length == 7) {
						prefix= date.substr(0,1);
						date=date.substr(1);
					}
				case 6:					//year and month
					month=months[parseInt('Dates.'+date.substr(4,2))];
					style = style || Dic('Dates.FmtDateDefault.FmtYMD',{attr:'text'});
					style = style.replace('dd','').replace('d','');
					if (style.indexOf('mmm') < 0 && style.indexOf('m') < 0) date=date.substr(0,4);
					style=style || Dic('Dates.FmtDateDefault.FmtYM',{attr:'text'});
					style = style.replace("y", date.substr(0,4))
					if (style.indexOf("mmm") >= 0) {
						/* In Dictionary, if month has a translation of short form, then entry for that abbreviated month
							will be a javascript object with property of 'text' for long form and property 'S' for short form
						*/
						return prefix+style.replace("mmm", Dic('Dates.Months.'+month,{attr:'text'}) || Dic('Dates.Months.'+month,{attr:false}));
					} else if (style.indexOf("m") >= 0) {
						return prefix+style.replace("m", Dic('Dates.Months.'+month,{attr:'S'}) || month);
					}
				}
			}
			return date;
		}
	}
	get Narrative() {return this._format()};
}
class Duration_ {
	#regexp;
	#age;
	constructor (age) {
		this.#age = ['','','','','','','','','',''];
		this.#regexp = /((<|>)? *((\d+)y)? *((\d+)m)? *((\d+)d)?)|(stillborn|child|infant)?/i;
		this.#age = this.#regexp.exec(age);;
		
	}
	get Approximation() {return this.#age[2] || ''};
	get Years() {return this.#age[4] || ''};
	get Months() {return this.#age[6] || ''};
	get Days() {return this.#age[8] || ''};
	get Weeks() {return this.#age[8] ? Math.trunc(this.#age[8]/7) : ''};
}
class Event_ {
	constructor(evt, id) {
		this._evt = evt ? $tree.evt[evt] : '';
		this._age = '';
		if (evt && evt.pri) {
			Object.keys(this._evt.pri).forEach(
				function(role) {
					if (role.ind && (role.ind == id) && role.age) this._age = role.age;
				}
			)
		}
		this._Age = new Duration_ (this._age);
		this._Date = new Date_ (this._evt ? (this._evt.w ? this._evt.w : ''):'');
		this._Place = new Place_ (this._evt ? (this._evt.pla ? this._evt.pla : '') : '');
		this._Type = this._evt ? (this._evt.q ? this._evt.q : ''):''
	}
	Role(role) {
		if (this._evt && this._evt.sec) {
			Object.keys(this._evt.sec).forEach(
				function(roleID) {
					if ($tree.rol[roleID].t == role) return this._evt.sec[roleID].ind;
				}
			)
		}
		return null;
	}
	get Age() {return this._Age};
	get Date() {return this._Date};
	get Place() {return this._Place};
	get Type() {return this._Type};
}
class Gender_ {
	constructor(id) {
		this._ID = id;
	}
	get ID() {return this._ID || ''};
	get $() {return $dictionary.Enumerations.Gender[this._ID];}
}
class Individual {
	constructor (id) {
		this.Class = 'Individual';
		this._ID = id || '';
		this._ind = id ? $tree.ind[id] : {};
		this._Gender = new Gender_ (this._ind.g || '');
		this._Name = new Name_ (this._ind.n || {} , this.Class, this._Gender);
		this._Events = this._ind.evt || {};
		this._Events.pri={};
		this._Events.sec={};
		// get list of events indexed by type
		
;		this._Birth = new Event_ (this._Events.birt ? this._Events.birt.pri : '');
		let tempEvt = '';
		if (this._Events.reli) {
			toArray(this._Events.reli.pri).forEach(
				function(evtID) {
					var evt = $tree.evt[evtID];
					if (evt.q && (evt.q == 'Baptism' || evt.q == 'Christening')) {
						tempEvt = new Event_(evtID, evt.q, id);
					}
			});
		}
		this._BirthCeremony = new Event_(tempEvt, id);

		if (this._ID != '#') Object.defineProperty(this._Birth, 'Assistant',{value: this._Birth.Role('Assistant') ? Ind(this._Birth.Role('Assistant')) : Ind('-')});
		if (this._ID != '#') Object.defineProperty(this._BirthCeremony, 'Officiator',{value: this._BirthCeremony.Role('Officiator') ? Ind(this._BirthCeremony.Role('Officiator')) : Ind('-')});
		Object.defineProperty(this._Birth, "Gestation", {value: this._Birth.Age});
	}
	Pronoun(type) {
		var gender = this._Gender.ID;
		if (this.Class == 'SocialEntity' && gender == '') gender = 'N';
		return Dic('Pn' + type + '_' + gender);
	}
	get ID() {return this._ID};
	get Name() {return this._Name};
	get Birth() {return this._Birth};
	get Gender() {return this._Gender};
	get BirthCeremony() {return this._BirthCeremony};
}
class Name_ {
		constructor (n, Class, gender) {
		// e.g. {"f": "Jesus","l": "Christ","p": "Baby"}
		this._name = null;
		this.Class = Class;
		this._gender = gender;
		if (n instanceof Array) {			// more than one name
			n.ForEach((name, index) => {
				if (name.k) {
					if (name.k == 'b') this._name = name;
				} else if (!_name) {
					this._name = name;
				}
			})
		} else {
			this._name = n;
		}
		this._knownAs = ((this._name.f || '')+ ' ').split(' ')[0];
		this.delimIt = txt => txt ? '"' + txt + '"' : '';		// wrap in quotes
	}
	get FirstMiddle()	{return this._name.f || '';}
	get First()			{return this._knownAs}
	get KnownAs()		{return this._knownAs}
	get Last()			{return this._name.l || '';}
	get Prefix()		{return this._name.p || '';}
	get Title()			{return this._name.p || '';}
	get Suffix()		{return this._name.s || '';}
	get Nick()			{return this._name.c || '';}
	get Possessive() 	{
		// todo: deal with possible NameDictionary entry (not implemented)
		const regexpT2 = Dic('ArticledName',{attr:'T2'});
		if (!regexpT2) { // i.e. not articled name or no specific rule for articled name
			const regexp_PPN = Dic('PossessiveProperNoun').replace(/=/g,':').split(':');
			let temp = this._knownAs;
			for (let i=0; i< regexp_PPN.length; i++) {  // apply regex transforms until match found or list exhausted
				temp = this._knownAs.replace(regexp_PPN[i], regexp_PPN[i+1]);
				if (temp != this._knownAs) break;
				i++;
			}
			return temp;
		} else {
			const articledName = this._name.d 	/* non-default definite article */ || 
							Dic('ArticledName',{attr: this._gender}); /* default */;
			articledName = articledName + this._knownAs;
			let temp = articledName;
			const regexp = regexpT2.replace(/=/g,':').split(':');
			for (let i=0; i< regexp.length; i++) {  // apply regex transforms until match found or list exhausted
				temp = articledName.replace(regexp[i], regexp[i+1]);
				if (temp != articledName) break;
				i++;
			}
			return temp;
		}
	}
	get $()		{return this._name.e ? this._name.e : [this._name.p,this._name.f,this.delimIt(this._name.c),this._name.l,this._name.s].filter(Boolean).join(' ');};
	get Narrative() 	{return this.Class == 'Place' ? [this._name.p,this._name.e].filter(Boolean).join(' ') : ''};
}
class Place_ {
	constructor(id) {
		this._id = id;
		this.Class = 'Place';
		this._pla = $tree.pla[id] || null;
		this._Name = new Name_ (this.pla && this._pla.n || {}, this.Class );
	}
	get ID() {return this._id};
	get Name() {return this._Name};
}
Dic = function(key,options) {
	// $dictionary lookup with default options.group of 'ReportGenerator' and options.attr 'T', 
	// key can be a Javascript object path e.g. key.subkey.subsubkey etc
	if (!key || key == '') return '';
	let attr = options?.attr || 'T'
	let group = options?.group  || (key.indexOf('.') == -1 ? 'ReportGenerator' : '');
	var path = (group ? group + '.' : '')+key+'.'+attr;
	const getDic = (obj, path) => path.split(".").reduce((o, key) => o && typeof o[key] !== 'undefined' ? o[key] : undefined, obj);
	var result = getDic($dictionary,path);
	//if (options.index && index > 0) result = result.split('|')[options.index-1];
	if (result == undefined) {
		console.log('not found ',key, group);
		return '';     // return original text if not found
	}
	return options && options.multi ? result.replace(/\$\$/g,options.multi) : result;
}
Ind = 	function(id) {
			// get Individual object instance, creating from model if does not already exist
			if (!$tree.ind[id].inst) {
				$tree.ind[id].inst = new Individual(id);
			}
			return $tree.ind[id].inst;
		}
toArray	= function(arr) {
	return arr instanceof Array ? arr : [arr];
}
