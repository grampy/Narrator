import $tree from '../FamilyTree.json' with {type:'json'};
import $dictionary from './Dictionary.json' with {type:'json'};
import { Individual, Family, Event, Place, handleLayout,buildTreeIndex, parseText,renderTree } from './index.js';

globalThis.$tree = $tree;
globalThis.$dictionary = $dictionary;

const Events = new Map();
Events.set('-', new Event('-'));
const Families = new Map();
Families.set('-', new Family('-'));  // dummy empty family
const Individuals = new Map();
Individuals.set('-', new Individual('-'));  // dummy empty individual

for (const [key, value] of Object.entries($tree.ind)) {
	Individuals.set(key, new Individual(key));
}

for (const [key, value] of Object.entries($tree.fam)) {
	Families.set(key, new Family(key));
}

for (const [key, value] of Object.entries($tree.evt)) {
	Events.set(key, new Event(key));
}
const Organisations = new Map();
const Places = new Map();
Places.set('-', new Place('-'));
for (const [key, value] of Object.entries($tree.pla)) {
	Places.set(key, new Place(key));
}
const Roles = new Map();
const Sources = new Map();
 
for (const [key, rel] of Object.entries($tree.rel)) {
	if (rel.k) {
		if (rel.k == 'B') {
			Individuals.get(`${rel.ind}`).Family = Families.get(`${rel.fam}`);
			Families.get(`${rel.fam}`).Children.add(Individuals.get(`${rel.ind}`));
		} else if (rel.k == 'M') {
			// TODO: Handle multiple birth relationships
		}
	} else {
		Individuals.get(`${rel.ind}`).Families.push( Families.get(`${rel.fam}`));
		if (Individuals.get(`${rel.ind}`).Gender.ID === 'M') {
			Families.get(`${rel.fam}`).Husband.add(Individuals.get(`${rel.ind}`));
		} else {
			Families.get(`${rel.fam}`).Wife.add(Individuals.get(`${rel.ind}`));
		}
	}
}
Individuals.forEach((i,id) => {
	i.Father = i.Family.Husband[0] || Individuals.get('-');
	i.Mother = i.Family.Wife[0] || Individuals.get('-');
	i.Birth = i.Events.find(e => e.Kind=== 'birt') || i.Birth;
	if (!Object.hasOwn(i.Birth,'Assistant')) {
		i.Birth.Assistant = i.Birth.Agent;
	}
	i.BirthCeremony = i.Events.find(e => e.Kind=== 'bapt' || e.Kind=== 'bapm' || e.Kind=== 'chr' || e.Kind=== 'barM') || i.BirthCeremony;
	i.Death = i.Events.find(e => e.Kind=== 'deat') || i.Death;
	i.Death.Cause = i.Death.Type.charAt(0) == '$' ? Enum(i.Death.Type.slice(1),'CauseOfDeath') : parseText(i, i.Death.Type);
	if (i.Death.ID !== '-') {
		i.IsDead = true;
	}
});
export const Trees = {};

Trees['Individuals'] = buildTreeIndex(Individuals);
Trees['Families'] = buildTreeIndex(Families);

document.addEventListener("DOMContentLoaded",function(){
    handleLayout();

});

export {Events, Individuals, Families, Organisations, Places, Roles, Sources };
