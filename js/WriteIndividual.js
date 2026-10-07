
import { addNarrative, Dic, FormatString, Individuals, Parser } from './index.js';

export function WriteIndividual(id) {
    const i = Individuals.get(id);
 
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
        /*8*/b.Assistant.Name.toString(), 
        /*9*/b.Gestation.Months, 
        /*10*/b.Gestation.Weeks,
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
        /*1*/i.Father.Family.Parents.AreDead || i.Father.Family.Parents.AreAlive ? i.Father.Family.Parents.IsOrWas : '',
        /*2*/i.Mother.Mother.IsOrWas,
        /*3*/i.Father.Father.Link,
        /*4*/i.Mother.Father.IsOrWas,
        /*5*/i.Father.Mother.Link,
        /*6*/(i.Mother.Family.Parents.AreDead || i.Mother.Family.Parents.AreAlive) ? i.Mother.Family.Parents.IsOrWas : '',
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
	Set oRepertoryTwins = Session("oRepertoryTwins")
	Set oRepertoryNonBio = Session("oRepertoryNonBio")
	Set collSiblings = Util.NewGenoCollection
	Set collOtherSiblings = Util.NewGenoCollection
	Set collHalfSiblings = Util.NewGenoCollection
	Set f = i.Family
	For Each iSibling In i.Siblings.ToGenoCollection
		If f.ID = iSibling.Family.ID Or oRepertoryNonBio.KeyCounter("I"&iSibling.ID) = 0 Then
			collSiblings.Add iSibling
		Else
			collOtherSiblings.Add iSibling
		End If
	Next
	collHalfSiblings.Add i.Siblings.Half.ToGenoCollection
	Set collOtherSiblings = i.Siblings.other.ToGenoCollection
	cSiblings = i.Siblings.ToGenoCollection.Count
	If (cSiblings = 0) Then
		If (Not Util.IsNothing(i.Family)) Then
			If collHalfSiblings.Count > 0 Then
				WriteNarrativeMFU i, collHalfSiblings, "SiblingHalf"
			Else
				If f.FamilyLine.ID ="NoMoreChildren" Then Report.WritePhrase StrDicMFU("PhOnlyChild",strGender), PnP(i), ToBe(i), strGender
			End If
		End If
		WriteNarrativeAdoption i
		Exit Sub
	End If
	Dim strChildRank, strChildRank1, nChildRank, cChildren, fOrdinal
	cChildren = cSiblings + 1
	nChildRank = i.FamilyRank
	strChildRank1 = ""
	If (nChildRank <= 1) Then
		If cChildren = 2 Then
			strChildRank = StrDicPluralCardinalMFU("Oldest", cChildren, strGender)
		Else
			strChildRank = Dic.Plurial(GetDicMFU("Oldest", strGender), cChildren)
		End If
	ElseIf (nChildRank = cChildren) Then
		If cChildren = 2 Then
			strChildRank = StrDicPluralCardinalMFU("Youngest", cChildren, strGender)
		Else
			strChildRank = Dic.Plurial(GetDicMFU("Youngest", strGender), cChildren)
		End If
	Else
		If nChildRank - 1 < cChildren / 2 Then
			strChildRank = StrDicAttribute2(GetDicMFU("_Ordinal_" & nChildRank, strGender), "T1", "T")
			strChildRank1 = Dic("Oldest")
		Else
			strChildRank = StrDicAttribute2(GetDicMFU("_Ordinal_" & (cChildren - nChildRank + 1), strGender), "T1", "T")
			strChildRank1 = Dic("Youngest")
		End If
		fOrdinal = True
	End If
	strPrefix = Pnp(i)
	If Util.IsNothing(i.Family) Then ' individual is adopted or fostered but birth parent(s) not present
		Dim oRepertoryNonBio
		If oRepertoryNonBio.KeyCounter("I" & i.ID) > 0 Then
			Set oLink = oRepertoryNonBio.Entry("I" & i.ID).Object(0)
			strPrefix = Util.FormatPhrase(StrDicExt("PhPL_" & oLink.PedigreeLink.ID & "3", "PhPL_" & LCase(oLink.PedigreeLink.ID) & "3", "", "", "2.0.1.6"),PnR(i), PnP(i), strGender)
			Set f = oLink.Family
		End If
	End If

	WriteNarrativeMFU i, collSiblings, "Sibling"
	Dim collAdoptedByFather, collAdoptedByMother, cnt
	Set collAdoptedByFather = Util.NewGenoCollection
	Set collAdoptedByMother = Util.NewGenoCollection
	If oRepertoryNonBio.KeyCounter("A:" & i.Family.ID) > 0 Then
		collSiblings.Clear
		Set oEntry = oRepertoryNonBio.Entry("A:" & i.Family.ID)
		For cnt = 0 To oEntry.Count-1 Step 2
			Set oLink = oEntry.Object(cnt)
			If oLink.Child.Mother.ID = i.Mother.ID Then
				collHalfSiblings.Add oEntry.Object(cnt+1)
				collAdoptedByFather.Add oEntry.Object(cnt+1)
			ElseIf oLink.Child.Father.ID = i.Father.ID Then
				collHalfSiblings.Add oEntry.Object(cnt+1)
				collAdoptedByMother.Add oEntry.Object(cnt+1)
			Else
				collSiblings.Add oEntry.Object(cnt+1)
			End If
		Next
		WriteNarrativeMFU i, collSiblings, "SiblingAdopted"
	End If

	If oRepertoryNonBio.KeyCounter("F:" & i.Family.ID) > 0 Then	
		collSiblings.Clear
		Set oEntry = oRepertoryNonBio.Entry("F:" & i.Family.ID)
		For cnt = 0 To oEntry.Count-1 Step 2
			collSiblings.Add oEntry.Object(cnt+1)
		Next
		WriteNarrativeMFU i, collSiblings, "SiblingFoster"
	End If

	fOrdered = True
	If (Not Util.IsNothing(f)) Then
	If f.Children.OrderUnknown Then
		fOrdered = False
	ElseIf f.Children.Order.ToGenoCollection.Count = 0 Then
		If  i.Birth.Date.ToStringNarrative = "" Then
			fOrdered = False
		Else
			For Each c in i.Siblings.All.ToGenoCollection
				If c.Birth.Date.ToStringNarrative = "" Then
					fOrdered = False
					Exit For
				End If
			Next
		End If
	End If
	fEndOfLine = (f.FamilyLine.ID = "" Or f.FamilyLine.ID = "NoMoreChildren")
	End If
	Dim ChildrenGender, ChildTag
	ChildrenGender = ""
	ChildTag = "Child"
	If cFemales = cChildren Then ChildrenGender = "F"
	If cMales = cChildren Then ChildrenGender = "M"
	If ChildrenGender <> "" Then ChildTag = GetDicMFU("Child", ChildrenGender)

	If fOrdered And oRepertoryNonBio.KeyCounter("A:" & f.ID) = 0 And oRepertoryNonBio.KeyCounter("F:" & f.ID) = 0 And oRepertoryTwins.KeyCounter("F" & f.ID) = 0 Then
			Report.WritePhrase StrDicMFU("PhChildRank", strGender), strPrefix, ToBe(i), strChildRank, strChildRank1, StrDicMFU("_Cardinal_" & cChildren, Util.IfElse(cFemales = cChildren, "F", "")), Util.IfElse(fEndOfLine,"", StrDicLookup2Attribute("Known_" & strGender, "Known", "P")), Dic.Plurial(ChildTag, cChildren), strGender, StrDicMFUAttribute("_Cardinal_" & cChildren, Util.IfElse(cFemales = cChildren, "F", ""), "TE")
	End If
	WriteNarrativeTwins i

	WriteNarrativeAdoption i

	WriteNarrativeMFU i, collHalfSiblings, "SiblingHalf"
	Report.WritePhraseDic "PhAdoptedBy", i.Father.Session("HlinkNN"), StrHtmlNarrativeNamesShort(collAdoptedByFather)
	Report.WritePhraseDic "PhAdoptedBy", i.Mother.Session("HlinkNN"), StrHtmlNarrativeNamesShort(collAdoptedByMother)

End Sub
*/
    Array.from(document.getElementsByClassName("individual-link")).forEach(function(element) {
      element.addEventListener('click', function() {
        console.log("Link clicked:", element.dataset.id);
        WriteIndividual(element.dataset.id)
        // You can add your custom logic here
      });
    });
}
