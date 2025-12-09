import { findBibleBook } from './bible-parser';
import { AvailableLanguage } from '../data/bible-structure';

type BookParsingOptions = { id: string; names: string[] };
type AllBookParsingsOptionsPerLanguage = {
	language: AvailableLanguage;
	testWith: AvailableLanguage[];
	books: BookParsingOptions[];
};

describe('Books should be detected correctly', () => {
	const variationsToScenarios = (scenarioPerLanguage: AllBookParsingsOptionsPerLanguage[]): { name: string; id: string; language: AvailableLanguage }[] => {
		const scenarios: {
			name: string;
			id: string;
			language: AvailableLanguage;
		}[] = [];
		for (const scenarioOfLanguage of scenarioPerLanguage) {
			for (const book of scenarioOfLanguage.books) {
				for (const name of book.names) {
					scenarios.push({ id: book.id, name, language: scenarioOfLanguage.language });
				}
			}
		}
		return scenarios;
	};

	const createScenariosForIterativeBooks = (
		number: number,
		shortNames: string[],
		names: string[],
		numberFormattingOptions: (number: number) => string[],
		scenarios: (formattedNumber: string, name: string) => string[],
	): string[] => {
		const formattedNumberOptions = numberFormattingOptions(number);
		return [...shortNames.map((shortName) => [shortName, `${shortName}.`]).flat(), ...names]
			.map((name) => formattedNumberOptions.map((formattedNumberOption) => scenarios(formattedNumberOption, name)))
			.flat()
			.flat();
	};

	const createNamesForIterativeBooksEN = (number: number, shortNames: string[], names: string[]): string[] => {
		const toOrdinanceSuffix = (number: number): string => {
			switch (number) {
				case 1:
					return 'st';
				case 2:
					return 'nd';
				case 3:
					return 'rd';
				default:
					return 'th';
			}
		};

		return createScenariosForIterativeBooks(
			number,
			shortNames,
			names,
			(num) => [`${num}`, `${num}.`, `${num}${toOrdinanceSuffix(num)}`],
			(num, name) => [`${num}${name}`, `${num} ${name}`, `${num}  ${name}`],
		);
	};

	const createNamesForIterativeBooksDE = (number: number, shortNames: string[], names: string[]): string[] =>
		createScenariosForIterativeBooks(
			number,
			shortNames,
			names,
			(num) => [`${num}`, `${num}.`],
			(num, name) => [`${num}${name}`, `${num} ${name}`, `${num}  ${name}`],
		);

	const BOOKS_PARSING_VARIATIONS: AllBookParsingsOptionsPerLanguage[] = [
		{
			language: 'de',
			testWith: ['en'],
			books: [
				{
					id: 'Gen',
					names: [...createNamesForIterativeBooksDE(1, ['Mo', 'Mos'], ['Mose']), 'Gen', 'Gen.', 'Genesis'],
				},
				{
					id: 'Ex',
					names: [...createNamesForIterativeBooksDE(2, ['Mo', 'Mos'], ['Mose']), 'Ex', 'Ex.', 'Exo', 'Exo.', 'Exodus'],
				},
				{
					id: 'Lev',
					names: [...createNamesForIterativeBooksDE(3, ['Mo', 'Mos'], ['Mose']), 'Lev', 'Lev.', 'Leviticus'],
				},
				{
					id: 'Num',
					names: [...createNamesForIterativeBooksDE(4, ['Mo', 'Mos'], ['Mose']), 'Num', 'Num.', 'Numeri'],
				},
				{
					id: 'Dt',
					names: [...createNamesForIterativeBooksDE(5, ['Mo', 'Mos'], ['Mose']), 'Dtn', 'Dtn.', 'Deut', 'Deut.', 'Deuteronomium'],
				},
				{ id: 'Jos', names: ['Jos', 'Jos.', 'Josua'] },
				{ id: 'Jdg', names: ['Ri', 'Ri.', 'Richter'] },
				{ id: 'Rut', names: ['Rt', 'Rt.', 'Ruth'] },
				{
					id: '1Sam',
					names: createNamesForIterativeBooksDE(1, ['Sa', 'Sam'], ['Samuel']),
				},
				{
					id: '2Sam',
					names: createNamesForIterativeBooksDE(2, ['Sa', 'Sam'], ['Samuel']),
				},
				{
					id: '1Ki',
					names: createNamesForIterativeBooksDE(1, ['Kö', 'Koe', 'Kön', 'Koen'], ['König', 'Könige']),
				},
				{
					id: '2Ki',
					names: createNamesForIterativeBooksDE(2, ['Kö', 'Koe', 'Kön', 'Koen'], ['König', 'Könige']),
				},
				{
					id: '1Ch',
					names: createNamesForIterativeBooksDE(1, ['Ch', 'Chr'], ['Chronik', 'Chroniker', 'Chronika']),
				},
				{
					id: '2Ch',
					names: createNamesForIterativeBooksDE(2, ['Ch', 'Chr'], ['Chronik', 'Chroniker', 'Chronika']),
				},
				{ id: 'Ezr', names: ['Ezr', 'Ezr.', 'Esr', 'Esr.', 'Esra'] },
				{ id: 'Neh', names: ['Neh', 'Neh.', 'Nehemia'] },
				{ id: 'Est', names: ['Est', 'Est.', 'Ester', 'Esther'] },
				{ id: 'Job', names: ['Hi', 'Hi.', 'Hiob'] },
				{ id: 'Ps', names: ['Ps', 'Ps.', 'Psa', 'Psa.', 'Psalm'] },
				{ id: 'Pro', names: ['Spr', 'Spr.', 'Sprüche', 'Sprueche'] },
				{ id: 'Ecc', names: ['Pred', 'Pred.', 'Koh', 'Koh.', 'Prediger', 'Kohelet'] },
				{ id: 'Son', names: ['Hld', 'Hld.', 'Hhld', 'Hhld.', 'Hohelied', 'Hoheslied'] },
				{ id: 'Isa', names: ['Jes', 'Jes.', 'Jesaja'] },
				{ id: 'Jer', names: ['Jer', 'Jer.', 'Jeremia'] },
				{ id: 'Lam', names: ['Klg', 'Klg.', 'Klgl', 'Klgl.', 'Klagelieder'] },
				{ id: 'Eze', names: ['Hes', 'Hes.', 'Eze', 'Eze.', 'Hesekiel', 'Ezekiel'] },
				{ id: 'Dan', names: ['Dan', 'Dan.', 'Daniel'] },
				{ id: 'Hos', names: ['Hos', 'Hos.', 'Hosea'] },
				{ id: 'Joe', names: ['Jo', 'Jo.', 'Joe', 'Joe.', 'Joel'] },
				{ id: 'Am', names: ['Am', 'Am.', 'Amo', 'Amo.', 'Amos'] },
				{ id: 'Ob', names: ['Ob', 'Ob.', 'Obadja'] },
				{ id: 'Jon', names: ['Jon', 'Jon.', 'Jona'] },
				{ id: 'Mi', names: ['Mi', 'Mi.', 'Micha'] },
				{ id: 'Nah', names: ['Nah', 'Nah.', 'Nahum'] },
				{ id: 'Hab', names: ['Hab', 'Hab.', 'Habakuk'] },
				{ id: 'Zep', names: ['Zef', 'Zef.', 'Zefanja'] },
				{ id: 'Hag', names: ['Hag', 'Hag.', 'Haggai'] },
				{ id: 'Zec', names: ['Sach', 'Sach.', 'Sacharia', 'Sacharja'] },
				{ id: 'Mal', names: ['Mal', 'Mal.', 'Maleachi'] },
				{
					id: 'Mt',
					names: ['Mt', 'Mt.', 'Matthäus', 'Matthaeus', 'Matthäusevangelium', 'Matthaeusevangelium'],
				},
				{ id: 'Mk', names: ['Mk', 'Mk.', 'Markus', 'Markusevangelium'] },
				{ id: 'Lk', names: ['Lk', 'Lk.', 'Lukas', 'Lukasevangelium'] },
				{ id: 'Joh', names: ['Joh', 'Joh.', 'Johannes', 'Johannesevangelium'] },
				{ id: 'Act', names: ['Apg', 'Apg.', 'Apostelgeschichte'] },
				{
					id: 'Rom',
					names: ['Rö', 'Roe', 'Röm', 'Roem', 'Rö.', 'Roe.', 'Röm.', 'Roem.', 'Römer', 'Roemer', 'Römerbrief', 'Roemerbrief'],
				},
				{
					id: '1Co',
					names: createNamesForIterativeBooksDE(1, ['Ko', 'Kor'], ['Korinther', 'Korintherbrief']),
				},
				{
					id: '2Co',
					names: createNamesForIterativeBooksDE(2, ['Ko', 'Kor'], ['Korinther', 'Korintherbrief']),
				},
				{ id: 'Gal', names: ['Gal', 'Gal.', 'Galater', 'Galaterbrief'] },
				{ id: 'Eph', names: ['Eph', 'Eph.', 'Epheser', 'Epheserbrief'] },
				{ id: 'Phi', names: ['Phil', 'Phil.', 'Philipper', 'Philipperbrief'] },
				{ id: 'Col', names: ['Kol', 'Kol.', 'Kolosser', 'Kolosserbrief'] },
				{
					id: '1Th',
					names: createNamesForIterativeBooksDE(1, ['Th', 'Thess'], ['Thessalonicher', 'Thessalonicherbrief']),
				},
				{
					id: '2Th',
					names: createNamesForIterativeBooksDE(2, ['Th', 'Thess'], ['Thessalonicher', 'Thessalonicherbrief']),
				},
				{
					id: '1Tim',
					names: createNamesForIterativeBooksDE(1, ['Tim'], ['Timotheus', 'Timotheusbrief']),
				},
				{
					id: '2Tim',
					names: createNamesForIterativeBooksDE(2, ['Tim'], ['Timotheus', 'Timotheusbrief']),
				},
				{ id: 'Tit', names: ['Tit', 'Tit.', 'Titus', 'Titusbrief'] },
				{
					id: 'Phm',
					names: ['Phl', 'Phl.', 'Phlm', 'Phlm.', 'Philemon', 'Philemonbrief'],
				},
				{
					id: 'Heb',
					names: ['Heb', 'Heb.', 'Hebr', 'Hebr.', 'Hebräer', 'Hebräerbrief'],
				},
				{ id: 'Jam', names: ['Jak', 'Jak.', 'Jakobus', 'Jakobusbrief'] },
				{
					id: '1Pt',
					names: createNamesForIterativeBooksDE(1, ['Petr'], ['Petrus', 'Petrusbrief']),
				},
				{
					id: '2Pt',
					names: createNamesForIterativeBooksDE(2, ['Petr'], ['Petrus', 'Petrusbrief']),
				},
				{
					id: '1Jo',
					names: createNamesForIterativeBooksDE(1, ['Jo', 'Joh'], ['Johannes', 'Johannesbrief']),
				},
				{
					id: '2Jo',
					names: createNamesForIterativeBooksDE(2, ['Jo', 'Joh'], ['Johannes', 'Johannesbrief']),
				},
				{
					id: '3Jo',
					names: createNamesForIterativeBooksDE(3, ['Jo', 'Joh'], ['Johannes', 'Johannesbrief']),
				},
				{ id: 'Jud', names: ['Jud', 'Jud.', 'Judas', 'Judasbrief'] },
				{ id: 'Rev', names: ['Offb', 'Offb.', 'Offenbarung'] },
			],
		},
		{
			language: 'en',
			testWith: ['de'],
			books: [
				{ id: 'Gen', names: ['Gn', 'Gn.', 'Gen', 'Gen.', 'Genesis'] },
				{ id: 'Ex', names: ['Ex', 'Ex.', 'Exo', 'Exo.', 'Exod', 'Exod.', 'Exodus'] },
				{ id: 'Lev', names: ['Lv', 'Lv.', 'Le', 'Le.', 'Lev', 'Lev.', 'Leviticus'] },
				{
					id: 'Num',
					names: ['Nu', 'Nu.', 'Nm', 'Nm.', 'Nb', 'Nb.', 'Num', 'Num.', 'Numbers'],
				},
				{ id: 'Dt', names: ['Dt', 'Dt.', 'De', 'De.', 'Deut', 'Deut.', 'Deuteronomy'] },
				{ id: 'Jos', names: ['Jsh', 'Jsh.', 'Josh.', 'Josh.', 'Joshua'] },
				{ id: 'Jdg', names: ['Jg', 'Jg.', 'Jdg', 'Jdg.', 'Jdgs', 'Jdgs.', 'Judges'] },
				{ id: 'Rut', names: ['Ru', 'Ru.', 'Rth', 'Rth.', 'Ruth'] },
				{
					id: '1Sam',
					names: createNamesForIterativeBooksEN(1, ['Sa', 'Sam'], ['Samuel']),
				},
				{
					id: '2Sam',
					names: createNamesForIterativeBooksEN(2, ['Sa', 'Sam'], ['Samuel']),
				},
				{ id: '1Ki', names: createNamesForIterativeBooksEN(1, ['Ki'], ['Kings']) },
				{ id: '2Ki', names: createNamesForIterativeBooksEN(2, ['Ki'], ['Kings']) },
				{
					id: '1Ch',
					names: createNamesForIterativeBooksEN(1, ['Ch', 'Chr', 'Chron'], ['Chronicles']),
				},
				{
					id: '2Ch',
					names: createNamesForIterativeBooksEN(2, ['Ch', 'Chr', 'Chron'], ['Chronicles']),
				},
				{ id: 'Ezr', names: ['Ezr', 'Ezr.', 'Ezra'] },
				{ id: 'Neh', names: ['Ne', 'Ne.', 'Neh', 'Neh.', 'Nehemiah'] },
				{ id: 'Est', names: ['Est', 'Est.', 'Esther'] },
				{ id: 'Job', names: ['Jb.', 'Jb.', 'Job'] },
				{ id: 'Ps', names: ['Ps', 'Ps.', 'Psa', 'Psa.', 'Psalm'] },
				{
					id: 'Pro',
					names: ['Pr', 'Pr.', 'Pro', 'Pro.', 'Prv', 'Prv.', 'Prov', 'Prov.', 'Proverbs'],
				},
				{
					id: 'Ecc',
					names: ['Ec', 'Ec.', 'Ecc', 'Ecc.', 'Eccl', 'Eccl.', 'Eccles', 'Eccles.', 'Ecclesiastes'],
				},
				{
					id: 'Son',
					names: ['So', 'So.', 'Son', 'Son.', 'SOS', 'SOS.', 'Song', 'Song of Solomon', 'Song of Songs', 'Song  of  Solomon', 'Song  of  Songs'],
				},
				{ id: 'Isa', names: ['Is', 'Is.', 'Isa', 'Isa.', 'Isaiah'] },
				{ id: 'Jer', names: ['Jer', 'Jer.', 'Jeremiah'] },
				{ id: 'Lam', names: ['La', 'La.', 'Lam', 'Lam.', 'Lamentations'] },
				{ id: 'Eze', names: ['Ez', 'Ez.', 'Eze', 'Eze.', 'Ezk', 'Ezk.', 'Ezekiel'] },
				{ id: 'Dan', names: ['Da', 'Da.', 'Dan', 'Dan.', 'Daniel'] },
				{ id: 'Hos', names: ['Ho', 'Ho.', 'Hos', 'Hos.', 'Hosea'] },
				{ id: 'Joe', names: ['Jl', 'Jl.', 'Joel'] },
				{ id: 'Am', names: ['Am', 'Am.', 'Amos'] },
				{ id: 'Ob', names: ['Ob', 'Ob.', 'Obad', 'Obad.', 'Obadiah'] },
				{ id: 'Jon', names: ['Jon', 'Jon.', 'Jnh', 'Jnh.', 'Jonah'] },
				{ id: 'Mi', names: ['Mi', 'Mi.', 'Mc', 'Mc.', 'Mic', 'Mic.', 'Micah'] },
				{ id: 'Nah', names: ['Na', 'Na.', 'Nah', 'Nah.', 'Nahum'] },
				{ id: 'Hab', names: ['Hb', 'Hb.', 'Hab', 'Hab.', 'Habakkuk'] },
				{
					id: 'Zep',
					names: ['Zp', 'Zp.', 'Zep', 'Zep.', 'Zeph', 'Zeph.', 'Zephaniah'],
				},
				{ id: 'Hag', names: ['Hg', 'Hg.', 'Hag', 'Hag.', 'Haggai'] },
				{
					id: 'Zec',
					names: ['Zc', 'Zc.', 'Zec', 'Zec.', 'Zech', 'Zech.', 'Zechariah'],
				},
				{ id: 'Mal', names: ['Ml', 'Ml.', 'Mal', 'Mal.', 'Malachi'] },
				{ id: 'Mt', names: ['Mt', 'Mt.', 'Mat', 'Mat.', 'Matt', 'Matt.', 'Matthew'] },
				{ id: 'Mk', names: ['Mk', 'Mk.', 'Mark'] },
				{ id: 'Lk', names: ['Lk', 'Lk.', 'Luke'] },
				{ id: 'Joh', names: ['Jhn', 'Jhn.', 'Joh', 'Joh.', 'John'] },
				{ id: 'Act', names: ['Ac', 'Ac.', 'Act', 'Act.', 'Acts'] },
				{ id: 'Rom', names: ['Ro', 'Ro.', 'Rom', 'Rom.', 'Rm', 'Rm.', 'Romans'] },
				{
					id: '1Co',
					names: createNamesForIterativeBooksEN(1, ['Co', 'Cor'], ['Corinthians']),
				},
				{
					id: '2Co',
					names: createNamesForIterativeBooksEN(2, ['Co', 'Cor'], ['Corinthians']),
				},
				{ id: 'Gal', names: ['Ga', 'Ga.', 'Gal', 'Gal.', 'Galatians'] },
				{ id: 'Eph', names: ['Eph', 'Eph.', 'Ephesians'] },
				{ id: 'Phi', names: ['Ph', 'Ph.', 'Php', 'Php.', 'Philippians'] },
				{ id: 'Col', names: ['Co', 'Co.', 'Col', 'Col.', 'Colossians'] },
				{
					id: '1Th',
					names: createNamesForIterativeBooksEN(1, ['Th', 'Thes', 'Thess'], ['Thessalonians']),
				},
				{
					id: '2Th',
					names: createNamesForIterativeBooksEN(2, ['Th', 'Thes', 'Thess'], ['Thessalonians']),
				},
				{
					id: '1Tim',
					names: createNamesForIterativeBooksEN(1, ['Ti', 'Tim'], ['Timothy']),
				},
				{
					id: '2Tim',
					names: createNamesForIterativeBooksEN(2, ['Ti', 'Tim'], ['Timothy']),
				},
				{ id: 'Tit', names: ['Tit', 'Tit.', 'Titus'] },
				{ id: 'Phm', names: ['Pm', 'Pm.', 'Phm', 'Phm.', 'Philemon'] },
				{ id: 'Heb', names: ['Heb', 'Heb.', 'Hebrews'] },
				{ id: 'Jam', names: ['Jm', 'Jm.', 'Jas', 'Jas.', 'James'] },
				{
					id: '1Pt',
					names: createNamesForIterativeBooksEN(1, ['Pt', 'Pe', 'Pet'], ['Peter']),
				},
				{
					id: '2Pt',
					names: createNamesForIterativeBooksEN(2, ['Pt', 'Pe', 'Pet'], ['Peter']),
				},
				{
					id: '1Jo',
					names: createNamesForIterativeBooksEN(1, ['J', 'Jn', 'Jhn', 'Joh'], ['John']),
				},
				{
					id: '2Jo',
					names: createNamesForIterativeBooksEN(2, ['J', 'Jn', 'Jhn', 'Joh'], ['John']),
				},
				{
					id: '3Jo',
					names: createNamesForIterativeBooksEN(3, ['J', 'Jn', 'Jhn', 'Joh'], ['John']),
				},
				{ id: 'Jud', names: ['Jd', 'Jd.', 'Jud', 'Jud.', 'Jude'] },
				{ id: 'Rev', names: ['Re', 'Re.', 'Rev', 'Rev.', 'Revelations'] },
			],
		},
	];
	it.each(variationsToScenarios(BOOKS_PARSING_VARIATIONS))('"$name" --> "$id"', (scenario) => {
		const results = findBibleBook(scenario.name, [scenario.language]);
		expect(results).toBe(scenario.id);
	});
});
