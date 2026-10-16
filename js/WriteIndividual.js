
import { addNarrative, parseText, Dic, FormatString, Individuals, Parser } from './index.js';

export function WriteIndividual(id) {
    const i = Individuals.get(id);
    console.log('WriteIndividual', i);
    // gender & name
    addNarrative(`<h2>
            <span class="${i.Gender.ID == 'M' ? 'sexM">&male; ' : i.Gender.ID == 'F' ? 'sexF">&female; ' : 'sexU">? '}
            </span> ${i.Name}
        </h2>`, {clear: true});

    // birth & baptism/christening
    const b = i.Birth, bc = i.BirthCeremony, bco = i.BirthCeremony.Officiator;
    addNarrative(Parser.Phrase(Dic('PhBirth'), [
        // [{?1|2|8|9|10}{!0} was[{?1|2|9|10} born]{1}{2h}[ delivered by {8h}][ following a pregnancy lasting [{9} months][{?!9}{10} weeks]]][[{?1|2|8|9|10} and {!11}][{?!1|2|8|9|10}{!13}] {12!=baptism}[ took place[{?2^4^7} [{?3}there][{?!3}{3=there}]]{3}[{?!7}{4h}]][[{?!3|4} was] conducted by [{?6}{5} ][{!}{15}]{6h}]].
        /*0*/i.Name.First,
        /*1*/b.Date.Narrative, 
        /*2*/b.Place.Name.Narrative,
        /*3*/bc.Date.Narrative, 
        /*4*/bc.Place.Name.Narrative,
        /*5*/bco.Name.Title, 
        /*6*/bco.Name.toString(), 
        /*7*/b.Place.ID == bc.Place.ID,
        /*8*/b.Assistant?.Name?.toString() || '',   // T.B.C. - needs improving
        /*9*/b.Gestation?.Months || '',             // T.B.C. - needs improving
        /*10*/b.Gestation?.Weeks || '',             // T.B.C. - needs improving
        /*11*/i.Pronoun('R'), 
        /*12*/bc.Type, 
        /*13*/i.Name.Possessive,
        /*14*/i.Gender.ID, 
        /*15*/bco.Name.Title]));

    let genderMix = '';
    if (i.Family.Wife.length > 1) {
        genderMix = "F";
    } else if (i.Family.Husband.length > 1 || (i.Parents.length > 2 && i.Family.Husband.length > 0)) {
        genderMix = "M";
    }

    // parents
    addNarrative(Parser.Phrase(Dic("PhParents"), [
        // {  }{\\U}{!0}[ [{?9=M}parents][{!}father] {!1} {2h}][[{?2} and {!3}] [{?9=F}parents][{!}mother] {!4} {5h}].
        /*0*/i.Name.Possessive,
        /*1*/i.Father.IsOrWas,
        /*2*/i.Father.Link,
        /*3*/i.Pronoun('R'),
        /*4*/i.Mother.IsOrWas,
        /*5*/i.Mother.Link,
        /*6*/!i.IsDead,
        /*7*/!i.Father.IsDead,
        /*8*/!i.Mother.IsDead,
        /*9*/genderMix]));

        // grandparents
		addNarrative(Parser.Phrase(Dic("PhGrandParents"), [
		// <PhGrandParents T="{ &#32;}{\U}{!0}[[{?3|5} paternal][{?1} grandparents {!1}][{?3}[{?!1} grandfather {!2}] {3h}][{?3^5} and][[{?5}[{?!1}[{?3} {!0} paternal] grandmother {!4}] {5h}]]][[{?3|5}[{?8|10}; {!0}]][[{?8|10} maternal][{?6} grandparents {!6}][{?8}[{?!6} grandfather {!7}] {8h}][[{?8^10} and][{?10}[{?!6}[{?8} {!0} maternal] grandmother {!9}] {10h}]]]]."/>
        /*0*/i.Pronoun('R'),
        /*1*/i.Father.Family.Parents.AreDead || i.Father.Family.Parents.AreAlive ? i.Father.Family.Parents.AreOrWere : '',
        /*2*/i.Mother.Mother.IsOrWas,
        /*3*/i.Father.Father.Link,
        /*4*/i.Mother.Father.IsOrWas,
        /*5*/i.Father.Mother.Link,
        /*6*/(i.Mother.Family.Parents.AreDead || i.Mother.Family.Parents.AreAlive) ? i.Mother.Family.Parents.AreOrWere : '',
        /*7*/i.Father.Mother.IsOrWas,
        /*8*/i.Mother.Father.Link,
        /*9*/i.Father.Father.IsOrWas,
        /*10*/i.Mother.Mother.Link,
        /*11*/!i.IsDead,
        /*12*/!i.Mother.Mother.IsDead,
        /*13*/!i.Mother.Father.IsDead,
        /*14*/!i.Father.Mother.IsDead,
        /*15*/!i.Father.Father.IsDead
    ]));

    let siblings = i.Family.Children.filter(s => s.ID !== i.ID);
    siblings.sort((a, b) => a.Gender.ID.localeCompare(b.Gender.ID));
    const children$ = i.Family.Children.length;
    const brothers$ = i.Family.Children.filter(s => s.ID !== i.ID && s.Gender.ID === 'M').length;
    const sisters$ = i.Family.Children.filter(s => s.ID !== i.ID && s.Gender.ID === 'F').length;
    const unknown$ = i.Family.Children.filter(s => s.ID !== i.ID && s.Gender.ID !== 'M' && s.Gender.ID !== 'F').length;

    let rank = i.Family.Children.findIndex(s => s.ID === i.ID) + 1;

    //    count and list names of brothers$ and sisters$
    if (children$ > 1) {
        addNarrative(Parser.Phrase(
            Dic("PhMalesFemalesUnknowns",{gender: i.Gender.ID}), 
            // {  }{\\U}{!0} {!1} {2h}.
            [
            /*0*/i.Pronoun("P"),
            /*1*/Dic("ToHave", {tense: i.IsDead ? 'Past' : siblings.AreDead ? 'Past' : 'Present'}),
            /*2*/Parser.Phrase(Dic("PhCollectionMFU"), 
                // {0}[[{?0} and ]{1}][[{?0|1},\n and also ]{2}][[{?0^1},\n] named {3h}]
                [
                /*0*/Dic("Sibling",{gender: 'M', cardinal: brothers$}),
                /*1*/Dic("Sibling",{gender: 'F', cardinal: sisters$}),
                /*2*/Dic("Sibling",{gender: '', cardinal: unknown$}),
                /*3*/siblings.LinksShort,
                /*4*/siblings.length == sisters$, //all female
                /*5*/siblings.length > 0
                ])
            ])
        );

        // display position within siblings age order
        addNarrative(Parser.Phrase(Dic("PhChildRank",{gender: i.Gender.ID}), 
            // {  }{\\U}{0} {1} the {2}[ {3}] of the [{?8}{8}][{!}{4}][ {5}] {6}.
            [
            /*0*/i.Pronoun("P"),  // TBC - change if adopted or fostered
            /*1*/i.IsOrWas,
            /*2*/rank <= 1 ? (
                    children$ == 2 ? 
                    Dic("Oldest",{cardinal: children$, gender:i.Gender.ID}):
                    Dic("Oldest",{count: children$, gender:i.Gender.ID})
                ):
                rank == children$ ? (
                    children$ == 2 ?
                        Dic("Youngest",{cardinal: 2, gender:i.Gender.ID}):
                    Dic("Youngest",{count: children$, gender:i.Gender.ID})
                ):
                rank -1 < children$ / 2 ? 
                    Dic("Ordinal_"+rank,{attr: 'T1',attr2: 'T', gender:i.Gender.ID}):
                    Dic("Ordinal_"+(children$ - rank + 1),{attr: 'T1',attr2: 'T', gender:i.Gender.ID}),
            /*3*/rank > 1 && rank < children$ ? (
                rank -1 < children$ / 2 ? 
                    Dic("Oldest") :
                    Dic("Youngest")
                ):'',
            /*4*/Dic("Cardinal_"+ children$,{gender: sisters$ == children$ ? 'F' : ''}),
            /*5*/i.Family.FamilyLine.ID === 'NoMoreChildren' ? '' : Dic("Known_"+i.Gender.ID, {attr: 'P'}) || Dic("Known",{attr: 'P'}),
            /*6*/   brothers$ == children$? Dic("Child",{gender: 'M', count: brothers$}) : 
                    sisters$ == children$? Dic("Child",{gender: 'F', count: sisters$}) : 
                    Dic("Child",{count: children$}),
            /*7*/i.Gender.ID,
            /*8*/Dic("Cardinal"+ children$,{gender: sisters$ == children$ ? 'F' : '',attr: 'TE'})
        ]));
    }
    /*
    	If (i.IsDead) Then
		Set c = d.Cause
		ich = Report.BufferLength
		Report.WritePhrase StrDicMFU("PhDied",strGender), strPnP, i.Death.Age.Years, i.Death.Age.Months, i.Death.Age.Days, CDS(d.Date), d.Place.Session("HlinkLocative"), c, StrFormatText(i, c.Description, False), CustomDate(i.Birth.Date).Approximation & CustomDate(i.Death.Date).Approximation, "", strGender
			Report.WritePhrase StrDicMFU("PhFuneral",strGender), CDS(f.Date), f.Place.Session("HlinkLocative"), StrFormatText(i, f.Agency, False)
	If (Dic.Peek("PhBurial" & "_" & d.Disposition.Type.ID) <> "") Or (Dic.Peek("PhBurial" & "_" & d.Disposition.Type.ID & "_" & strGender) <> "") Then
		strPhrase = StrDicMFU("PhBurial" & "_" & d.Disposition.Type.ID, strGender)
	Else
		strPhrase = StrDicMFU("PhBurial",strGender)
	End If
	Report.WritePhrase strPhrase , strPnR, d.Disposition.Type, CDS(d.Disposition.Date), d.Disposition.Place.Session("HlinkLocative"), strPnP, d.Disposition.Type.ID, strGender
		If (ich = Report.BufferLength) And (Not i.Father.IsDead = True Or Not i.Mother.IsDead = True) Then Report.WritePhraseDic "PhDead", strName, strGender ' Indicate dead if no other death phrase and one or more parents alive.
	End If
*/
        let phrase = Parser.Phrase(Dic("PhDied",{gender: i.Gender.ID}), [
            // {  }{\\U}{!0} died[ {6}[[{?6},\n][{?!6} due to] {7h}[{?6},\n]]][{?!8}[ at the age of {1}][{?!1}[ at {2} months old][{?!2} at just {3} days old]]]{4}{5h}.
            /*0*/i.Pronoun("P"),
            /*1*/i.Death.Age.Years,
            /*2*/i.Death.Age.Months,
            /*3*/i.Death.Age.Days,
            /*4*/i.Death.Date.Narrative,
            /*5*/i.Death.Place.Link,
            /*6*/i.Death.Cause,
            /*7*/parseText(i, i.Death.Cause.Description || '', false),
            /*8*/i.Birth.Date.Approximation || i.Death.Date.Approximation,
            /*9*/'',
            /*10*/i.Gender.ID
       ]);
       if (phrase.length > 0) {
        addNarrative(phrase);
       } else if (!i.Father.IsDead || !i.Mother.IsDead) {
        addNarrative(Parser.Phrase(Dic("PhDead",{gender: i.Gender.ID}), [
            /*0*/i.Pronoun("P"),
            /*1*/i.Gender.ID
        ]));
       }


        Array.from(document.getElementsByClassName("individual-link")).forEach(function(element) {
      element.addEventListener('click', function() {
        console.log("Link clicked:", element.dataset.id);
        WriteIndividual(element.dataset.id)
        // You can add your custom logic here
      });
    });
}
