import $tree from '../FamilyTree.json' with {type:'json'};
import $dictionary from './Dictionary.json' with {type:'json'};
import { Individual, Family, handleLayout,buildTreeIndex, renderTree, setupSearch } from './index.js';

globalThis.$tree = $tree;
globalThis.$dictionary = $dictionary;

const Individuals = new Map();
const Families = new Map();
 
document.addEventListener("DOMContentLoaded",function(){
    handleLayout();

    Individuals.set('-', new Individual('-'));  // dummy empty individual
	Families.set('-', new Family('-'));  // dummy empty family
    for (const [key, value] of Object.entries($tree.ind)) {
        Individuals.set(key, new Individual(key));
    }
    for (const [key, value] of Object.entries($tree.fam)) {
        Families.set(key, new Family(key));
    }

	for (const [key, rel] of Object.entries($tree.rel)) {
        if (rel.k) {
			if (rel.k == 'B') {
				Individuals.get(`${rel.ind}`).Family = Families.get(`${rel.fam}`);
			} else if (rel.k == 'M') {
				// TODO: Handle multiple birth relationships
			}
		} else {
			console.log(`Adding family ${rel.fam} to individual ${rel.ind}`);
			Individuals.get(`${rel.ind}`).Families.push( Families.get(`${rel.fam}`));
            if (Individuals.get(`${rel.ind}`).Gender.ID === 'M') {
                Families.get(`${rel.fam}`).Husband.push(Individuals.get(`${rel.ind}`));
            } else {
                Families.get(`${rel.fam}`).Wife.push(Individuals.get(`${rel.ind}`));
            }
        }
	}
		// Setup expand/collapse all buttons (only once)
		const expandAllBtn = document.getElementById('expandAllBtn');
		const collapseAllBtn = document.getElementById('collapseAllBtn');
		
		expandAllBtn.onclick = () => {
			document.querySelectorAll('.letter-header').forEach(header => {
				header.classList.remove('collapsed');
			});
			document.querySelectorAll('.last-name-header').forEach(header => {
				header.classList.remove('collapsed');
			});
		};
		
		collapseAllBtn.onclick = () => {
			document.querySelectorAll('.letter-header').forEach(header => {
				header.classList.add('collapsed');
			});
			document.querySelectorAll('.last-name-header').forEach(header => {
				header.classList.add('collapsed');
			});
		};

    const individualTree = buildTreeIndex(Individuals);

    renderTree(individualTree, '', 'individuals');
   
    // Setup search functionality
    setupSearch(individualTree);

});
export { Individuals, Families };
