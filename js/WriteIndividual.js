
import { addNarrative, Dic, Individual, Individuals, Parser } from './index.js';

export function WriteIndividual(id) {
    var i = Individuals.get(id), phrase;
    var b = i.Birth, bc = i.BirthCeremony, bco = i.BirthCeremony.Officiator;
    addNarrative('', {clear: true}); // Clear the panel
    addNarrative(`<h2>
            <span class="${i.Gender.ID == 'M' ? 'sexM">&male; ' : i.Gender.ID == 'F' ? 'sexF">&female; ' : 'sexU">? '}
            </span> ${i.Name}
        </h2>`, {eol: true});
    // "[{?1|2|8|9|10}{!0} was[{?1|2|9|10} born]{1}{2h}[ delivered by {8h}][ following a pregnancy lasting [{9} months][{?!9}{10} weeks]]][[{?1|2|8|9|10} and {!11}][{?!1|2|8|9|10}{!13}] {12!=baptism}[ took place[{?2^4^7} [{?3}there][{?!3}{3=there}]]{3}[{?!7}{4h}]][[{?!3|4} was] conducted by [{?6}{5} ][{!}{15}]{6h}]].
    addNarrative(Parser.Phrase(Dic('PhBirth'), [
        /*0*/i.Name.First,
        /*1*/b.Date.Narrative, 
        /*2*/b.Place.Name.Narrative,
        /*3*/bc.Date.Narrative, 
        /*4*/bc.Place.Name.Narrative,
        /*5*/bco.Name.Title, 
        /*6*/bco.Name.toString(), 
        /*7*/b.Place.ID == bc.Place.ID,
        /*8*/b.Assistant.Name.toString(), 
        /*9*/b.Gestation.Months, 
        /*10*/b.Gestation.Weeks,
        /*11*/i.Pronoun('R'), 
        /*12*/bc.Type, 
        /*13*/i.Pronoun('P'),
        /*14*/i.Gender.ID, 
        /*15*/bco.Name.Title]));

        let genderMix = '';
    if (i.Family.Wife.length > 1) {
        genderMix = "F";
    } else if (i.Family.Husband.length > 1 || (i.Parents.length > 2 && i.Family.Husband.length > 0)) {
        genderMix = "M";
    }
    // "{  }{\\U}{!0}[ [{?9=M}parents][{!}father] {!1} {2h}][[{?2} and {!3}] [{?9=F}parents][{!}mother] {!4} {5h}]."
    addNarrative(Parser.Phrase(Dic("PhParents"), [
        /*0*/i.Name.Possessive,
        /*1*/i.Father.ToBe,
        /*2*/i.Father.Link,
        /*3*/i.Pronoun('R'),
        /*4*/i.Mother.ToBe,
        /*5*/i.Mother.Link,
        /*6*/!i.IsDead,
        /*7*/!i.Father.IsDead,
        /*8*/!i.Mother.IsDead,
        /*9*/genderMix]));
    Array.from(document.getElementsByClassName("individual-link")).forEach(function(element) {
      element.addEventListener('click', function() {
        console.log("Link clicked:", element.dataset.id);
        // You can add your custom logic here
      });
    });
}
