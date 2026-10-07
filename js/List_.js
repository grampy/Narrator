import { Dic } from './index.js';

export class List_ extends Array {
    constructor(...args) {
        super(...args);
    }
    add(obj) {
        this.push(obj);
    }
    get Names() {
        return this.join(',');
    }
    get Links() {
        return this.map(item => item.Link).join(', ').replace(/,([^,]*)$/, ' '+Dic("And")+ '$1');
    }
    get LinksShort() {
        return this.map(item => item.LinkShort).join(', ').replace(/,([^,]*)$/, ' '+Dic("And")+ '$1');
    }
    get AreAlive() {
        return this.every(item => !item.IsDead);
    }
    get AreDead() {
        return this.every(item => item.IsDead);
    }
    get AreOrWere() {
        if (this.length < 2) {
            return '';
        }
        const root = 'ToBe'+(this.every(item => item.IsDead) ? '_Past' : '_Present')
        const tentative = Dic(root, {peek: true, gender:'', attr: this.length > 1? 'P' : 'T'}); 
        return tentative ? tentative : Dic(root, {attr: this.length > 1? 'P' : 'T'})
    }
}
