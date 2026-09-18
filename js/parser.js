// parser.js (Refactored as ES Module)

export const Parser = {
	/**
	 * Takes a phrase template and parse it to substitute supplied arguments.
	 * Template format is the same as GenoPro Report Generator. See https://www.genopro.com/sdk for grammar
	 *
	 * @param {string} phrase - phrase template
	 * @param {array}   args  - values for tokens in phrase template
	 * @returns {string} result - Phrase from template with tokens substituted with arguments
	 */
	Phrase(phrase, args) {
		this.args = args;
		this.pattern = /\{(\??\!?)(\@[^\}]+|\d+)(h|\^|\&|\||\!?\=?)([^\}]*)\}/g;
		this.previous = false;
		this.subphrase = true;
		this.eol = false;
		this.else = false;
		
		// Initialise phrase for ready for processing by adding level numbers to delimiters
		//  to reflect nested depth so [ and ] become [n and n]  e.g. [1 and 1]
		// 
		let depth = 0;
		phrase = phrase.replace(/([\[\]])/g, m => (m === '[' ? `[${++depth}` : `${depth--}]`));
		// Nested will recursively call itself to deal with all subphrases
		let result = this.Nested('', 0, phrase);
		result = this.toUpper ? result.charAt(0).toUpperCase() + result.slice(1) : result;
		return result;
	},

	/**
	 * Parses phrase template and deals with any nested subphrases within delimiters [ and ]
	 * A recursive parser with thanks and credit to Peter Theony
	 * see http://twiki.org/cgi-bin/view/Blog/BlogEntry201109x3
	 *
	 * @param {string} $0 - the matched subphrase with delimiters. Empty on top level call
	 * @param {number} $1 - the nested depth (number of [ without matching ]). Empty on top level call
	 * @param {string} txt - the matched subphrase without its delimiters. On top level call
	 *                       this is full phrase template with depth counter added to delimiters
	 * @returns {string} result - subphrase with any arguments at this depth substituted
	 */
	Nested($0, $1, txt) {
		const originalTxt = txt;
	console.log('N level '+$1+' entry:'+txt);
		txt = txt.replace(/\[(\d+)((.|\n)*?)\1\]/gim, this.Nested.bind(this));
		//                 \_____/  \______/\__/
		//                    |        |      |
		// Above we have: delimiter, subphrase, delimiter at same level as 1st (back reference \1)
		// So Nested is recursively called.

		// Check if inner phrases were processed (text changed)
		//**const innerPhrasesProcessed = txt !== originalTxt;

		// Extract static text (text without the bracket markers) from original
		//**const staticText = originalTxt.replace(/\[\d+.*?\d+\]/g, '');
		// Check if result is just the static text (inner phrases didn't add content)
		//**const resultIsJustStaticText = txt.trim() === staticText.trim();

		// Deal with special arguments {\U} , {\n}, {\r}, {!} & { }
		this.else = false;
		txt = txt.replace(/\{( |\\U| +|\!|\\r|\\n)\}/g, (match, p1) => {
			switch (p1.trim()) {
				case '\\U': 	return '\x01';	// uppercase flag
				case '\\r':
				case '\\n': return '<br>';
				case '\!' : this.ignore = this.previous; this.else=true; return ''; // 'else' condition follows
				default   : return p1.replace(/ /g, '\x00'); // replace one or more spaces with flag (null byte)
			}
		});

		this.validTokens = false;
		this.ignore = false; 
		this.tokens = false;
		
		console.log('1.'+txt+' ignore:'+this.ignore+' valid:'+this.validTokens+' tokens:'+this.tokens+' subphrase:'+this.subphrase+' else:'+this.else);

		txt = txt.replace(this.pattern, this.SubPhrase.bind(this));

		console.log('2.'+txt+' ignore:'+this.ignore+' valid:'+this.validTokens+' tokens:'+this.tokens+' subphrase:'+this.subphrase+' else:'+this.else);

		// Check if the result should be empty:
		// 1. If we should ignore this phrase, OR
		// 2. If we have no valid content AND either we had tokens OR 
		//    inner phrases were processed but result is just static text (no meaningful content added)
		//if (this.ignore || (!this.validTokens && (this.tokens || (innerPhrasesProcessed && resultIsJustStaticText)))) {
		if (!this.ignore && ($1==0 || this.else) ||!this.ignore && this.subphrase || this.tokens && this.validTokens) {
			this.previous = true;
			console.log('N level '+$1+' exit:'+txt);
			this.subphrase = true;
			return txt;
		} else {
			this.previous = false;
		console.log('N level '+$1+' exit: empty');
			return '';
		}
	},

	/**
	 * Evaluate conditional expression
	 * @param {string} p1 - prefix modifier (e.g. '?!' for negation)
	 * @param {string} p2 - first condition argument
	 * @param {string} delim - delimiter for multiple conditions (|, &, ^)
	 * @param {string} pMore - additional condition arguments
	 * @returns {boolean} result of conditional evaluation
	 */
	Conditional(p1, p2, delim, pMore) {
		// Evaluate conditional e.g. {?0} or multiple e.g. {?0|1|2}, {?0&1&2}
		// args: e.g. in say {?0&1&2}, p2 is 0, delim is & and pMore is 1&2
		let value = this.Eval(p2);
		if (!!delim) { // multiple terms
			const values = (p2 + delim + pMore).split(delim);
			switch (delim) {
				case '|':
					value = values.some(val => this.Eval(val)); break;
				case '&':
				case '^':
					value = values.every(val => this.Eval(val)); break;
				case '=': 
					value = value == p2; break;
				default:
					value = false;
			}
		}
		return p1 === '?!' ? !value : !!value;
	},

	/**
	 * Convert special HTML characters to their entity names, tab characters to 4 x &nbsp; entity names
	 * and multiple white spaces characters to &nbsp; other than the first in each sequence
	 *
	 * @example
	 * '<div title="text">1 & 2</div>'
	 * becomes
	 * '&lt;div title=&quot;text&quot;&gt;1 &amp; 2&lt;/div&gt;'
	 *
	 * @param {string} value - Any input string
	 * @return {string} - The same string, but with encoded HTML entities
	 */
	EscapeHtml(value) {
		const entityMap = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'\'': '&apos;',
			'"': '&quot;',
			'\t': '&nbsp;&nbsp;&nbsp;&nbsp;'
		};
		return !value ? '' :
			value.replace(/[\&\<\>\\\"\t]/g, c => entityMap[c])
			.replace(/\s{2,}/g, m => m.slice(0, 1) + m.slice(1).replace(/./g, '&nbsp;'));
	},

	/**
	 * Evaluate template token by substituting with matching arguments with optional escaping of special HTML characters to HTML named entities
	 *
	 * @param {string} arg - token to be replaced
	 * @param {bool} html - if true escape HTML special characters
	 * @returns {string|boolean} evaluated value or false if undefined
	 */
	Eval(arg, html) {
		if (arg.startsWith('@')) {
			try {
				return eval(arg.slice(1));
			} catch (e) {
				return false;
			}
		}
		const value = this.args[arg];
		return (value && value !== undefined && value !== 'undefined') 
			? (!html ? this.EscapeHtml(value) : value) 
			: false;
	},

	/**
	 * Process individual token matches within a subphrase
	 * @param {string} match - the full matched token
	 * @param {string} p1 - prefix modifier (e.g. '?', '!', '')
	 * @param {string} p2 - token identifier (number or @expression)
	 * @param {string} p3 - format modifier (h, ^, &, |, =, !=)
	 * @param {string} p4 - default value or additional conditions
	 * @returns {string} replacement text
	 */
	SubPhrase(match, p1, p2, p3, p4) {
		this.ignore = false;
		if (p1.slice(0, 1) === '?') { // Check Conditional Sub-Phrase {?0} or multiple e.g. {?0|1|2}, {?0&1&2}
			this.ignore = !this.Conditional(p1, p2, p3, p4);
		      return '';
		}

		const p2Eval = this.Eval(p2, p3 == 'h');

		const valueOrDefault = (ghost = false) => {
			const value = p2Eval ? p2Eval : (p3 === '=' || p3 === '!=') ? p4 : '';
			if ((p2Eval && !ghost) || (!ghost && p3 !== '!=' && value)) this.validTokens = true;
			return value;
		};

		if (p1  == '') {
			this.tokens = true;
			return valueOrDefault();
		}

		return valueOrDefault(p1 === '!');
	}
};
