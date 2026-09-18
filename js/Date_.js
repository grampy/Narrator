import { Dic, DicDate } from './utils.js';

export class Date_ {
	constructor(date = {}) {
		this._calendar = Object.keys(date)[0] || '';
		this._date = date[this._calendar] || '';
	}

	_format(format) {
		let date = this._date;
		if (!date) return '';
		let approx ='', prefixes = [''], result = '', style;
		const days = ['','Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		if (!/^[<>~]?(\d{4}|\d{6}|\d{8})$/.test(date)) return date;

		if (/^[<>~]\d*/.test(date)){  // approximation
			approx = date[0];
			date = date.slice(1);
		}
		
			style =  DicDate('FmtDate'+(format || 'Default')+'.FmtY');
			if (date.length > 4) style =  DicDate('FmtDate'+(format || 'Default')+'.FmtYM');
			if (date.length > 6) style =  DicDate('FmtDate'+(format || 'Default')+'.FmtYMD');
		if (/^\[.*\]/.test(style)){ // style has an approximate date prefix
			prefixes = style.substring(1,style. indexOf(']')).split('|');
			style=style.substring(style.indexOf(']')+1);
		}
		const day = date.length > 6 ? days[parseInt(date.slice(7, 8))] : '';
		const month = date.length > 4 ? months[parseInt(date.slice(4, 6))] : '';
		date =style
			.replace('D', parseInt(date.slice(6, 8)))
			.replace('yyyy', date.slice(0, 4))
			.replace('MMMM', DicDate(`Months.${month}`))
			.replace('MMM', DicDate(`Months.${month}`,true) || month)
			.replace('dddd', DicDate(`Weekdays.${day}`) )
		let prefix = approx ? '~<>'.indexOf(approx)+1 : 0;
		if (prefixes[prefix]) date = ' '+prefixes[prefix] + date;
		return date;
	}

	get Narrative() {
		return this._format('Narrative');
	}
}
