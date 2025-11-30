export type Bible = {
	language: string;
	sections: BibleSection[];
};

export type BibleSection = {
	id: "OT" | "NT";
	shortName: string;
	name: string;
	books: BibleBook[];
};

export type BibleBook = {
	id: string;
	shortName: string;
	name: RegExp;
};

const BibleGerman: Bible = {
	language: "de",
	sections: [
		{
			id: "OT",
			shortName: "AT",
			name: "Altes Testament",
			books: [
				{
					id: "Gen",
					shortName: "1Mo",
					name: /^(?:1\.?\s?Mo(?:se|s)?|Gen(?:esis)?)$/i,
				},
				{
					id: "Ex",
					shortName: "2Mo",
					name: /^(?:2\.?\s?Mo(?:se|s)?|Ex(?:odus|o)?)$/i,
				},
				{
					id: "Lev",
					shortName: "3Mo",
					name: /^(?:3\.?\s?Mo(?:se|s)?|Lev(?:iticus)?)$/i,
				},
				{
					id: "Num",
					shortName: "4Mo",
					name: /^(?:4\.?\s?Mo(?:se|s)?|Num(?:eri)?)$/i,
				},
				{
					id: "Dt",
					shortName: "5Mo",
					name: /^(?:5\.?\s?Mo(?:se|s)?|Dtn|Deuteronomium)$/i,
				},
				{
					id: "Jos",
					shortName: "Jos",
					name: /^Jos(?:ua)?$/i,
				},
				{
					id: "Jdg",
					shortName: "Ri",
					name: /^Ri(?:chter)?$/i,
				},
				{
					id: "Rut",
					shortName: "Rut",
					name: /^Ruth?|Rt$/i,
				},
				{
					id: "1Sam",
					shortName: "1Sam",
					name: /^1\.?\s?Sa(?:muel|m)?$/i,
				},
				{
					id: "2Sam",
					shortName: "2Sam",
					name: /^2\.?\s?Sa(?:muel|m)?$/i,
				},
				{
					id: "1Ki",
					shortName: "1Kö",
					name: /^1\.?\s?K(?:ö|oe)(?:nige?|n)?$/i,
				},
				{
					id: "2Ki",
					shortName: "2Kö",
					name: /^2\.?\s?K(?:ö|oe)(?:nige?|n)?$/i,
				},
				{
					id: "1Ch",
					shortName: "1Chr",
					name: /^1\.?\s?Ch(?:ronik(?:er|a)?|r)?$/i,
				},
				{
					id: "2Ch",
					shortName: "2Chr",
					name: /^2\.?\s?Ch(?:ronik(?:er|a)?|r)?$/i,
				},
				{
					id: "Ezr",
					shortName: "Esr",
					name: /^(?:Esra?|Ezr?)$/i,
				},
				{
					id: "Neh",
					shortName: "Neh",
					name: /^Neh(?:emia)?$/i,
				},
				{
					id: "Est",
					shortName: "Est",
					name: /^Est(?:er|her)?$/i,
				},
				{
					id: "Job",
					shortName: "Hi",
					name: /^Hi(?:ob)?$/i,
				},
				{
					id: "Ps",
					shortName: "Ps",
					name: /^Ps(?:alm|a)?$/i,
				},
				{
					id: "Pro",
					shortName: "Spr",
					name: /^Sp(?:r(?:ü|ue)che|r)?$/i,
				},
				{
					id: "Ecc",
					shortName: "Pred",
					name: /^(?:Pred(?:iger)?|Koh(?:elet)?)$/i,
				},
				{
					id: "Son",
					shortName: "Hhld",
					name: /^Hh?ld|Hohes?lied$/i,
				},
				{
					id: "Isa",
					shortName: "Jes",
					name: /^Jes(?:aja)?$/i,
				},
				{
					id: "Jer",
					shortName: "Jer",
					name: /^Jer(?:emia)?$/i,
				},
				{
					id: "Lam",
					shortName: "Klgl",
					name: /^(?:Klgl?|Klagelieder)$/i,
				},
				{
					id: "Eze",
					shortName: "Hes",
					name: /^(?:Hes(?:ekiel)?|Eze(?:kiel)?)$/i,
				},
				{
					id: "Dan",
					shortName: "Dan",
					name: /^Dan(?:iel)?$/i,
				},
				{
					id: "Hos",
					shortName: "Hos",
					name: /^Hos(?:ea)?$/i,
				},
				{
					id: "Joe",
					shortName: "Jo",
					name: /^Jo(?:el|e)?$/i,
				},
				{
					id: "Am",
					shortName: "Am",
					name: /^Am(?:os|o)?$/i,
				},
				{
					id: "Ob",
					shortName: "Ob",
					name: /^Ob(?:adja|d)?$/i,
				},
				{
					id: "Jon",
					shortName: "Jon",
					name: /^Jona?$/i,
				},
				{
					id: "Mi",
					shortName: "Mi",
					name: /^Mi(?:cha)?$/i,
				},
				{
					id: "Nah",
					shortName: "Nah",
					name: /^Na(?:hum|h)$/i,
				},
				{
					id: "Hab",
					shortName: "Hab",
					name: /^Ha(?:bakuk|b)?$/i,
				},
				{
					id: "Zep",
					shortName: "Zef",
					name: /^Zef(?:anja)?$/i,
				},
				{
					id: "Hag",
					shortName: "Hag",
					name: /^Hag(?:gai)?$/i,
				},
				{
					id: "Zec",
					shortName: "Sach",
					name: /^Sach(?:ar[ij]a)?$/i,
				},
				{
					id: "Mal",
					shortName: "Mal",
					name: /^Mal(?:eachi)?$/i,
				},
			],
		},
		{
			id: "NT",
			shortName: "NT",
			name: "Neues Testament",
			books: [
				{
					id: "Mt",
					shortName: "Mt",
					name: /^Mt|Matth(?:ä|ae)us(?:evangelium)?$/i,
				},
				{
					id: "Mk",
					shortName: "Mk",
					name: /^Mk|Markus(?:evangelium)?$/i,
				},
				{
					id: "Lk",
					shortName: "Lk",
					name: /^Lk|Lukas(?:evangelium)?$/i,
				},
				{
					id: "Joh",
					shortName: "Joh",
					name: /^Johannes(?:evangelium)?|Joh?$/i,
				},
				{
					id: "Act",
					shortName: "Apg",
					name: /^Apg|Apostelgeschichte$/i,
				},
				{
					id: "Rom",
					shortName: "Röm",
					name: /^R(?:ö|oe|o)(?:m(?:er(?:brief)?)?)?$/i,
				},
				{
					id: "1Co",
					shortName: "1Kor",
					name: /^1\.?\s?Ko(?:rinther(?:brief)?|r)?$/i,
				},
				{
					id: "2Co",
					shortName: "2Kor",
					name: /^2\.?\s?Ko(?:rinther(?:brief)?|r)?$/i,
				},
				{
					id: "Gal",
					shortName: "Gal",
					name: /^Gal(?:ater(?:brief)?)?$/i,
				},
				{
					id: "Eph",
					shortName: "Eph",
					name: /^Eph(?:eser(?:brief)?)?$/i,
				},
				{
					id: "Phi",
					shortName: "Phil",
					name: /^Phil(?:ipper(?:brief)?)?$/i,
				},
				{
					id: "Col",
					shortName: "Kol",
					name: /^Kol(?:osser(?:brief)?)?$/i,
				},
				{
					id: "1Th",
					shortName: "1Thes",
					name: /^1\.?\s?Th(?:essalonicher(?:brief)?|ess?)?$/i,
				},
				{
					id: "2Th",
					shortName: "2Thes",
					name: /^2\.?\s?Th(?:essalonicher(?:brief)?|ess?)?$/i,
				},
				{
					id: "1Tim",
					shortName: "1Tim",
					name: /^1\.?\s?Ti(?:motheus(?:brief)?|m?)?$/i,
				},
				{
					id: "2Tim",
					shortName: "2Tim",
					name: /^2\.?\s?Ti(?:motheus(?:brief)?|m?)?$/i,
				},
				{
					id: "Tit",
					shortName: "Tit",
					name: /^Tit(?:us(?:brief)?)?$/i,
				},
				{
					id: "Phm",
					shortName: "Phlm",
					name: /^Phlm?|Philemon(?:brief)?$/i,
				},
				{
					id: "Heb",
					shortName: "Hebr",
					name: /^Hebr?|Hebräer(?:brief)?$/i,
				},
				{
					id: "Jam",
					shortName: "Jak",
					name: /^Jak?|Jakobus(?:brief)?$/i,
				},
				{
					id: "1Pt",
					shortName: "1Petr",
					name: /^1\.?\s?Petr(?:us(?:brief)?)?$/i,
				},
				{
					id: "2Pt",
					shortName: "2Petr",
					name: /^2\.?\s?Petr(?:us(?:brief)?)?$/i,
				},
				{
					id: "1Jo",
					shortName: "1Joh",
					name: /^1\.?\s?Jo(?:hannes(?:brief)?|h)?$/i,
				},
				{
					id: "2Jo",
					shortName: "2Joh",
					name: /^2\.?\s?Jo(?:hannes(?:brief)?|h)?$/i,
				},
				{
					id: "3Jo",
					shortName: "3Joh",
					name: /^3\.?\s?Jo(?:hannes(?:brief)?|h)?$/i,
				},
				{
					id: "Jud",
					shortName: "Jud",
					name: /^Jud(?:as(?:brief)?)?$/i,
				},
				{
					id: "Rev",
					shortName: "Offb",
					name: /^Off(?:enbarung|b)$/i,
				},
			],
		},
	],
};

const BibleEnglish: Bible = {
	language: "en",
	sections: [
		{
			id: "OT",
			shortName: "OT",
			name: "Old Testament",
			books: [
				{
					id: "Gen",
					shortName: "Gen",
					name: /^G(?:enesis|en|n)\$/i,
				},
				{
					id: "Ex",
					shortName: "Ex",
					name: /^Ex(?:odus|od?)?$/i,
				},
				{
					id: "Lev",
					shortName: "Lev",
					name: /^L(?:eviticus|ev?|v)$/i,
				},
				{
					id: "Num",
					shortName: "Num",
					name: /^N(?:umbers|um?|m|b)$/i,
				},
				{
					id: "Dt",
					shortName: "Dt",
					name: /^D(?:eut(?:eronomy)?|e|t)$/i,
				},
				{
					id: "Jos",
					shortName: "Josh",
					name: /^J(?:oshua|osh|sh)$/i,
				},
				{
					id: "Jdg",
					shortName: "Jdg",
					name: /^J(?:udges|dgs?|g)$/i,
				},
				{
					id: "Rut",
					shortName: "Ruth",
					name: /^(?:Ruth|Rth|Ru)$/i,
				},
				{
					id: "1Sam",
					shortName: "1Sam",
					name: /^1(?:st|\.)?\s?Sa(?:m(?:uel)?)?$/i,
				},
				{
					id: "2Sam",
					shortName: "2Sam",
					name: /^2(?:nd|\.)?\s?Sa(?:m(?:uel)?)?$/i,
				},
				{
					id: "1Ki",
					shortName: "1Ki",
					name: /^1(?:st|\.)?\s?Ki(?:ngs)?$/i,
				},
				{
					id: "2Ki",
					shortName: "2Ki",
					name: /^2(?:nd|\.)?\s?Ki(?:ngs)?$/i,
				},
				{
					id: "1Ch",
					shortName: "1Chr",
					name: /^1(?:st|\.)?\s?(?:Chronicles|Chron|Chr|Ch)$/i,
				},
				{
					id: "2Ch",
					shortName: "2Chr",
					name: /^2(?:nd|\.)?\s?(?:Chronicles|Chron|Chr|Ch)$/i,
				},
				{
					id: "Ezr",
					shortName: "Ezr",
					name: /^Ezra?$/i,
				},
				{
					id: "Neh",
					shortName: "Neh",
					name: /^Ne(?:hemiah|h)?$/i,
				},
				{
					id: "Est",
					shortName: "Est",
					name: /^Es(?:ther|ter|t)?$/i,
				},
				{
					id: "Job",
					shortName: "Job",
					name: /^(?:Job|Jb)$/i,
				},
				{
					id: "Ps",
					shortName: "Ps",
					name: /^Ps(?:alm|a)?$/i,
				},
				{
					id: "Pro",
					shortName: "Prov",
					name: /^Pr(?:overbs|ov|o|v)?$/i,
				},
				{
					id: "Ecc",
					shortName: "Ecc",
					name: /^Ec(clesiastes|cles|cl|c)?$/i,
				},
				{
					id: "Son",
					shortName: "Song",
					name: /^(?:Song(?: of (?:Solomon|Songs))|SOS|So)$/i,
				},
				{
					id: "Isa",
					shortName: "Isa",
					name: /^Is(?:aiah|a)?$/i,
				},
				{
					id: "Jer",
					shortName: "Jer",
					name: /^Je(?:remiah|r)?$/i,
				},
				{
					id: "Lam",
					shortName: "Lam",
					name: /^La(?:mentations|m)?$/i,
				},
				{
					id: "Eze",
					shortName: "Eze",
					name: /^Ez(?:ekiel|e|k)?$/i,
				},
				{
					id: "Dan",
					shortName: "Dan",
					name: /^D(?:aniel|an?|n)$/i,
				},
				{
					id: "Hos",
					shortName: "Hos",
					name: /^Ho(?:sea|s)?$/i,
				},
				{
					id: "Joe",
					shortName: "Joel",
					name: /^(?:Joel|Jl)$/i,
				},
				{
					id: "Am",
					shortName: "Amos",
					name: /^Am(?:os)?$/i,
				},
				{
					id: "Ob",
					shortName: "Obad",
					name: /^Ob(?:adiah|ad)?$/i,
				},
				{
					id: "Jon",
					shortName: "Jonah",
					name: /^J(?:onah|on|nh)$/i,
				},
				{
					id: "Mi",
					shortName: "Mic",
					name: /^M(?:icah|ic|c)$/i,
				},
				{
					id: "Nah",
					shortName: "Nah",
					name: /^Na(?:hum|h)?$/i,
				},
				{
					id: "Hab",
					shortName: "Hab",
					name: /^H(?:abakkuk|ab|b)$/i,
				},
				{
					id: "Zep",
					shortName: "Zeph",
					name: /^Z(?:ephaniah|eph?|p)$/i,
				},
				{
					id: "Hag",
					shortName: "Hag",
					name: /^H(?:aggai|ag|g)$/i,
				},
				{
					id: "Zec",
					shortName: "Zech",
					name: /^Z(?:echariah|ech?|c)$/i,
				},
				{
					id: "Mal",
					shortName: "Mal",
					name: /^M(?:alachi|al|l)$/i,
				},
			],
		},
		{
			id: "NT",
			shortName: "NT",
			name: "New Testament",
			books: [
				{
					id: "Mt",
					shortName: "Mt",
					name: /^M(?:atthew|att?|t)$/i,
				},
				{
					id: "Mk",
					shortName: "Mk",
					name: /^M(?:ark(?:us)?|k)$/i,
				},
				{
					id: "Lk",
					shortName: "Lk",
					name: /^L(?:uke?|k)$/i,
				},
				{
					id: "Joh",
					shortName: "Joh",
					name: /^J(?:ohn|oh|hn|n)$/i,
				},
				{
					id: "Act",
					shortName: "Acts",
					name: /^Ac(?:ts|t)?$/i,
				},
				{
					id: "Rom",
					shortName: "Rom",
					name: /^R(?:omans|om?|m)$/i,
				},
				{
					id: "1Co",
					shortName: "1Cor",
					name: /^1(?:st|\.)?\s?Co(?:rinthians|r)?$/i,
				},
				{
					id: "2Co",
					shortName: "2Cor",
					name: /^2(?:nd|\.)?\s?Co(?:rinthians|r)?$/i,
				},
				{
					id: "Gal",
					shortName: "Gal",
					name: /^Ga(?:latians|l)?$/i,
				},
				{
					id: "Eph",
					shortName: "Eph",
					name: /^Eph(?:esians)?$/i,
				},
				{
					id: "Phi",
					shortName: "Phil",
					name: /^Ph(?:ilippians|p)?$/i,
				},
				{
					id: "Col",
					shortName: "Col",
					name: /^Co(?:lossians|l)?$/i,
				},
				{
					id: "1Th",
					shortName: "1 Thess",
					name: /^1(?:st|\.)?\s?Th(?:essalonians|ess?)?$/i,
				},
				{
					id: "2Th",
					shortName: "2 Thess",
					name: /^2(?:nd|\.)?\s?Th(?:essalonians|ess?)?$/i,
				},
				{
					id: "1Tim",
					shortName: "1 Tim",
					name: /^1(?:st|\.)?\s?Ti(?:mothy|m)?$/i,
				},
				{
					id: "2Tim",
					shortName: "2 Tim",
					name: /^2(?:nd|\.)?\s?Ti(?:mothy|m)?$/i,
				},
				{
					id: "Tit",
					shortName: "Titus",
					name: /^Tit(?:us)?$/i,
				},
				{
					id: "Phm",
					shortName: "Philem",
					name: /^P(?:hilemon|hm|m)$/i,
				},
				{
					id: "Heb",
					shortName: "Heb",
					name: /^Heb(?:rews)?$/i,
				},
				{
					id: "Jam",
					shortName: "James",
					name: /^J(?:ames|m|as)$/i,
				},
				{
					id: "1Pt",
					shortName: "1 Pet",
					name: /^1(?:st|\.)?\s?P(?:eter|et?|t)?$/i,
				},
				{
					id: "2Pt",
					shortName: "2 Pet",
					name: /^2(?:nd|\.)?\s?P(?:eter|et?|t)?$/i,
				},
				{
					id: "1Jo",
					shortName: "1 John",
					name: /^1(?:st|\.)?\s?J(?:ohn?|hn|n)?$/i,
				},
				{
					id: "2Jo",
					shortName: "2 John",
					name: /^2(?:nd|\.)?\s?J(?:ohn?|hn|n)?$/i,
				},
				{
					id: "3Jo",
					shortName: "3 John",
					name: /^3(?:rd|\.)?\s?J(?:ohn?|hn|n)?$/i,
				},
				{
					id: "Jud",
					shortName: "Jude",
					name: /^J(?:ude?|d)$/i,
				},
				{
					id: "Rev",
					shortName: "Rev",
					name: /^Re(?:velations?|v)?$/i,
				},
			],
		},
	],
};

export const AVAILABLE_LANGUAGES = [
	{ code: "en", name: "English" },
	{ code: "de", name: "Deutsch" },
] as const;
export type AvailableLanguage = (typeof AVAILABLE_LANGUAGES)[number]["code"];

export const BIBLE_DATA: Record<AvailableLanguage, Bible> = {
	de: BibleGerman,
	en: BibleEnglish,
} as const;

export { BibleGerman, BibleEnglish };
