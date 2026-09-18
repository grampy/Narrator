export class List_ extends Array {
    constructor() {
        super();
    }
    add(obj) {
        this.push(obj);
    }
    get Names() {
        return this.join(',');
    }
}