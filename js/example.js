import { Individual, Dic, Date_ } from './index.js';

const person = new Individual('person123');
console.log('Name:', person.Name.First);
console.log('Gender:', person.Gender.ID);
console.log('Birth Date Narrative:', person.Birth.Date.Narrative);

const date = new Date_({ 'Gregorian': '19901225' });
console.log('Formatted Date:', date.Narrative);

console.log('Dictionary Lookup Example:', Dic('Dates.Months.Jan', { attr: 'text' }));
