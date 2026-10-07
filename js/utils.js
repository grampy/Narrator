import { Individual, WriteIndividual } from './index.js';
/**
 * Adds text content to the right-top panel of the document
 * @param {string} text - The text content to add
 * @param {boolean} eol - Whether or not the previous text ended in a line break
 * @param {boolean} clear - Whether to clear the panel before adding text
 */
export function addNarrative(text,options={}) {
	const panels = {Detail:'#right-top'};
	if (options.clear) {
		options.eol = true;
		document.querySelector(panels[options.panel||'Detail']).innerHTML = '';
	}
  if (text) {
	let toUppertoken = text.indexOf('\x01')
	if (toUppertoken > -1) text = text.slice(0,toUppertoken) + text.charAt(toUppertoken+1).toUpperCase() + text.slice(toUppertoken+2);
	const leading = options.eol ? '' : '&#32;';
	text = text.replace(/\x00/g, leading);	// \x00 is token for leading space, keep space if eol is false
    document.querySelector(panels[options.panel||'Detail']).insertAdjacentHTML('beforeend',text);
	return text.endsWith('<br/>');
  } else {
	return false;
  }
}
/**
 * Retrieves a dictionary value based on key and options
 * @param {string} key - The dictionary key to look up
 * @param {Object} options - Configuration options
 * @param {string} options.attr - The attribute to retrieve (default: 'T')
 * @param {string} options.group - The dictionary group (default: 'ReportGenerator' or empty if key contains '.')
 * @param {string} options.tense - Optional tense qualifier to append to the key (e.g., 'Past', 'Present')
 * @param {string} options.gender - Optional gender qualifier to append to the key (e.g., 'M', 'F')
 * @param {string} options.count - Optional count to determine plural form (e.g., 2 for plural) 
 * @param {string} options.cardinal - Optional count to determine plural form (e.g., 2 for plural) 
 * 									and used to select the appropriate attribute ('T' for singular, 'P' for plural)
 * 									result either obtained via the C'n' attribute of the Dictionary entry or 
 * 									is formatted using the cardinal format of this integer together with
 * 									the result using template FmtPlurialCardinal from Dictionary.json
 * @param {boolean} options.peek - If true, suppresses console log for missing keys
 * @param {string} options.multi - If provided, replaces $$ in result with this value
 * @returns {string} The dictionary value or empty string if not found
 */
export function Dic(key, options = {}) {
  if (!key) return '';
  if (Object.hasOwn(options, 'cardinal') && options.cardinal == 0) {
	return '';
  }
  const getDic = (obj, path) => path.split(".").reduce((o, k) => o && o[k], obj);
  const attr = options.attr || 
    (options.cardinal && options.cardinal > 1) || 
    (options.count && options.count > 1) ? 'P' : 'T';
  const group = options.group || (key.includes('.') ? '' : 'ReportGenerator');
  let tag = options.tense ? key + '_' + options.tense : key;
  tag = Object.hasOwn(options,'gender') ? tag + '_' + options.gender : tag;
  let path = (group ? group + '.' : '') + tag + '.' + attr;
  let result = getDic($dictionary, path);

  if (result === undefined && attr === 'P') {
	path = path.replace(/.P$/, '.T');
    result = getDic($dictionary, path);
	if (result !== undefined) {
		result += 's';
	}
  }
  if (result === undefined && Object.hasOwn(options,'gender')) {
	path = path.replace(key + '_' + options.gender, key);
	result = getDic($dictionary, path);
  }
 if (result === undefined) {
    if (!options.peek) console.log('not found', key, group, options);
    return '';
  }
  if (options.multi) {
    result = result.replace(/\$\$/g, options.multi);
  }
  if (options.cardinal) {
	let tmp = getDic($dictionary, path.replace(/.(T|P)$/, '.C' + options.cardinal));
    result = tmp ? tmp : FormatString("FmtPlurialCardinal", Dic("Cardinal_" + options.cardinal), result);
  }
  return result;
}
/**
 * Retrieves a date value from the dictionary
 * @param {string} key - The date key to look up
 * @param {boolean} shortform - If true, returns short form of the date; otherwise returns full text
 * @returns {string} The date value or empty string if not found
 */
export function DicDate(key, shortform = false) {
  if (!key) return '';
  const group = 'Dates';
  const path = (group ? group + '.' : '') + key;
  /**
   * A small reducer used to traverse an object by a dot-separated path.
   * 
   * Performs safe property access: returns o && o[k] to avoid undefined errors.
   * Used with Array.prototype.reduce to resolve nested dictionary paths from $dictionary.
   */
  function reducer(o, k, i) {
	  return o && o[k];
  }
  /**
   * Retrieves a dictionary entry by a dotted path on $dictionary.
   * 
   * Used to fetch nested keys for Dic-style lookups, returning undefined when not found
   * Path assembled from group, key, and attr, with fallback logging on missing entries
   */
  const getDic = (obj, path) => path.split(".").reduce(reducer, obj);
  var result = getDic($dictionary, path);
  if (result === undefined) {
    console.log('not found', key, group);
    return '';
  }
  if (!shortform) {
	  if (!(result instanceof Object)) return result;
	  if (result['text']) {
		  return result['text'];
	  } else {
	  }
  } else {
	  result = key.split('.').pop();
	  if (!(result instanceof Object)) return result;
	  if (result.S) {
		  return result.S;
	  } else {
	  }
  }
}
/**
 * Retrieves an enumeration value from the dictionary
 * @param {string} key - The enumeration key
 * @param {string} type - The enumeration type
 * @returns {string} The enumeration value
 */
export function Enum(key,type) {
	return Dic(key+'.'+type,{group:'Enumerations'});
}
/**
 * Formats a string with placeholders e.g. {1} using the FormatString function
 * @param {string} format - The format string with placeholders
 * @param {...*} args - The arguments to replace placeholders
 * @returns {string} The formatted string
 */
export function FormatString(format, ...args) {
	return Dic(format).replace(/{(\d+)}/g, function (match, number) {
    	return typeof args[number] !== 'undefined' ? args[number] : match;
  });

}
/**
 * Gets or creates an Individual instance for the given ID
 * @param {string} id - The individual ID
 * @returns {Individual} The Individual instance
 */
export function Ind(id) {
  if (!$tree.ind[id].inst) {
    $tree.ind[id].inst = new Individual(id);
  }
  return $tree.ind[id].inst;
}
/**
 * Converts a value to an array if it is not already one
 * @param {*} arr - The value to convert to an array
 * @returns {Array} The input value as an array
 */
export function toArray(arr) {
	return arr instanceof Array ? arr : [arr];
}

/**
 * Builds a two-level tree index from Individual objects in the Individuals Map
 * First level: first letter of last name (sorted alphabetically)
 * Second level: last name
 * Leaf entries: Individual last name and forenames
 * @param {Map} individualsMap - Map containing Individual objects keyed by ID
 * @returns {Object} Tree structure with alphabetical indexing by last name
 */
export function buildTreeIndex(items) {
	const treeIndex = {};
	let firstLetter = '';
	let match;
	for (const [id, item] of items) {
		const key = item.Name.index.key || '';

		if (!key) continue;
		try{
			match = key.match(/[\p{L}\p{N}]/u);
			firstLetter = match ? match[0] : '?';
			firstLetter = firstLetter.toUpperCase();
		} catch (e) {
			console.error('Error getting first letter of key:', key, e);
			continue;
		}
		// Initialize first letter level if not exists
		if (!treeIndex[firstLetter]) {
			treeIndex[firstLetter] = {};
		}
		
		// Initialize last name level if not exists
		if (!treeIndex[firstLetter][key]) {
			treeIndex[firstLetter][key] = [];
		}
		
		// Add individual to the last name group
		treeIndex[firstLetter][key].push({
			id: id,
			key: item.Name.index.key,
			entry: item.Name.index.entry
		});
	}
	
	// Sort the tree structure
	const sortedIndex = {};
	Object.keys(treeIndex).sort().forEach(letter => {
		sortedIndex[letter] = {};
		Object.keys(treeIndex[letter]).sort().forEach(key => {
			// Sort items by entry within each key group
			sortedIndex[letter][key] = treeIndex[letter][key].sort((a, b) => 
				a.entry.localeCompare(b.entry)
			);
		});
	});
	
	return sortedIndex;
}
export function highlightText(text, filterText) {
	if (!filterText) return text;

		const regex = new RegExp(`(${filterText})`, 'gi');
	return text.replace(regex, '<span class="highlight">$1</span>');
}
export function setupSearch(treeIndex) {
	const searchBox = document.getElementById('searchBox');
	let debounceTimer;
	
	searchBox.addEventListener('input', (e) => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			const filterText = e.target.value.trim();
			renderTree(treeIndex, filterText);
		}, 300);
	});
}
       
export function renderTree(treeIndex, filterText = '', title) {
	const leftPanel = document.getElementById('left-panel');
	
	if (title)document.getElementById('indexTitle').textContent = title+' ';
	const container = document.getElementById('treeContainer');
	container.innerHTML = '';
	
	if (Object.keys(treeIndex).length === 0) {
		container.innerHTML = '<div class="no-results">No items found</div>';
		return;
	}
	let filteredCount = 0;

	for (const letter in treeIndex) {
		const letterGroup = treeIndex[letter];
		const letterDiv = document.createElement('div');
		letterDiv.className = 'letter-group';
		
		// Check if this letter group has any matching items
		const hasMatches = hasMatchingItems(letterGroup, filterText);
		if (filterText && !hasMatches) continue;
		
		const letterHeader = document.createElement('div');
		letterHeader.className = 'letter-header';
		letterHeader.textContent = `${letter} (${Object.keys(letterGroup).length} last names)`;
		letterHeader.onclick = () => {
			letterHeader.classList.toggle('collapsed');
		};
		const keyContainer = document.createElement('div');
		keyContainer.className = 'key-group';
		
		for (const key in letterGroup) {
			const items = letterGroup[key];
			
			// Filter items if search text is provided
			const filteredItems = filterText 
				? items.filter(ind => 
					ind.key.toLowerCase().includes(filterText.toLowerCase()) ||
					ind.key.toLowerCase().includes(filterText.toLowerCase()) ||
					ind.entry.toLowerCase().includes(filterText.toLowerCase())
					)
				: items;
			
			if (filteredItems.length === 0) continue;
			filteredCount += filteredItems.length;
			
			const keyDiv = document.createElement('div');
			keyDiv.style.marginBottom = '10px';
			
			const keyHeader = document.createElement('div');
			keyHeader.className = 'last-name-header';
			keyHeader.textContent = `${key} (${filteredItems.length})`;
			keyHeader.onclick = () => {
				keyHeader.classList.toggle('collapsed');
			};
			
			const itemList = document.createElement('div');
			itemList.className = 'individual-list';
			
			filteredItems.forEach(item => {
				const listItem = document.createElement('div');
				listItem.className = 'list-item';
				
				const displayName = filterText 
					? highlightText(item.entry, filterText)
					: item.entry;
				
				listItem.innerHTML = `
					<span class="item-name">${item.key}, ${displayName}</span>
				`;
				
				listItem.onclick = () => {
					console.log('Selected item:', item);
					WriteIndividual(item.id);
				};
				
				itemList.appendChild(listItem);
			});
			
			keyDiv.appendChild(keyHeader);
			keyDiv.appendChild(itemList);
			keyContainer.appendChild(keyDiv);
		}
		
		letterDiv.appendChild(letterHeader);
		letterDiv.appendChild(keyContainer);
		container.appendChild(letterDiv);
	}
	// Calculate and display statistics
	const totalItems = Object.values(treeIndex).reduce((sum, letterGroup) => {
		return sum + (Object.values(letterGroup).reduce((subSum, items) => subSum + items.length, 0));
	}, 0);
	const totalLetters = Object.keys(treeIndex).length;
	const totalNames = Object.values(treeIndex).reduce((sum, letterGroup) => {
		return sum + Object.keys(letterGroup).length;
	}, 0);
	
	document.getElementById('stats').innerHTML = `
		<strong>Statistics:</strong><br/>${totalItems} total entries<br/> 
		${totalLetters} initial letters<br/>${totalNames} unique names
	`+(filterText ? `<br/>${filteredCount} filtered entries` : '');
}

export function hasMatchingItems(letterGroup, filterText) {
	if (!filterText) return true;
	
	for (const key in letterGroup) {
		const items = letterGroup[key];
		const hasMatch = items.some(item => 
			item.key.toLowerCase().includes(filterText.toLowerCase()) ||
			item.key.toLowerCase().includes(filterText.toLowerCase()) ||
			item.entry.toLowerCase().includes(filterText.toLowerCase())
		);
		if (hasMatch) return true;
	}
	return false;
}
    var Ω = function(ref) {
        try {
            return eval(ref);
        } catch(e) {
            return '';
        }
    }
