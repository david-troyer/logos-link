import { formatBibleReferenceForLogos, parseBibleReferences } from './bible-parser';
import { AvailableLanguage } from '../data/bible-structure';

describe('parsing', () => {
	describe('Bible Reference Parsing', () => {
		const SINGLE_VERSE_PARSING_SCENARIO: {
			input: (string | string[])[];
			expected: string;
			lastBookId?: string;
			lastChapter?: number;
			lang?: AvailableLanguage[];
		}[] = [
			{
				input: [['1Cor', '1Cor.', '1.Cor', '1. Corinthians', '1st Corinthians']],
				expected: '1Co',
			},
			{
				input: [['1Cor', '1Cor.', '1.Cor', '1. Corinthians', '1st Corinthians']],
				expected: '1Co',
			},
			{
				input: [['1Cor', '1Cor.', '1.Cor', '1. Corinthians', '1st Corinthians'], '1', ['-', '–'], '2'],
				expected: '1Co1-2',
			},
			{
				input: [['1Cor', '1Cor.', '1.Cor', '1. Corinthians', '1st Corinthians'], '1', [',', ':'], '20'],
				expected: '1Co1.20',
			},
			{
				input: [['1Cor', '1Cor.', '1.Cor', '1. Corinthians', '1st Corinthians'], '1', [',', ':'], '20', ['-', '–'], '25'],
				expected: '1Co1.20-25',
			},
			{
				input: [['1Cor', '1Cor.', '1.Cor', '1. Corinthians', '1st Corinthians'], '1', [',', ':'], '20', ['-', '–'], '2', [',', ':'], '1'],
				expected: '1Co1.20-2.1',
			},
			{
				input: [['1Cor', '1Cor.', '1.Cor', '1. Corinthians', '1st Corinthians'], '1', ['-', '–'], '2', [',', ':'], '1'],
				expected: '1Co1.1-2.1',
			},
			// chapter only
			{
				input: [['Kap ', 'Kap. ', 'Kapitel ', 'Chapter '], '5'],
				lastBookId: '1Co',
				expected: '1Co5',
				lang: ['de', 'en'],
			},
			{
				input: ['Kap', '1', ['-', '–'], '2'],
				lastBookId: '1Co',
				expected: '1Co1-2',
				lang: ['de'],
			},
			{
				input: [['Kap ', 'Kap. ', 'Kapitel ', 'Chapter '], '1', [',', ':'], '20'],
				lastBookId: '1Co',
				expected: '1Co1.20',
				lang: ['de', 'en'],
			},
			{
				input: [['Kap ', 'Kap. ', 'Kapitel ', 'Chapter '], '1', [',', ':'], '20', ['-', '–'], '25'],
				lastBookId: '1Co',
				expected: '1Co1.20-25',
				lang: ['de', 'en'],
			},
			{
				input: [['Kap ', 'Kap. ', 'Kapitel ', 'Chapter '], '1', [',', ':'], '20', ['-', '–'], '2', [',', ':'], '1'],
				lastBookId: '1Co',
				expected: '1Co1.20-2.1',
				lang: ['de', 'en'],
			},
			{
				input: [['Kap ', 'Kap. ', 'Kapitel ', 'Chapter '], '1', ['-', '–'], '2', [',', ':'], '1'],
				lastBookId: '1Co',
				expected: '1Co1.1-2.1',
				lang: ['de', 'en'],
			},
			// verse only
			{
				input: [['V.', 'Vers', 'Verse'], '2'],
				lastBookId: '1Co',
				lastChapter: 8,
				expected: '1Co8.2',
				lang: ['de', 'en'],
			},
			{
				input: [['V.', 'Vers', 'Verse'], '2', ['-', '–'], '5'],
				lastBookId: '1Co',
				lastChapter: 8,
				expected: '1Co8.2-5',
				lang: ['de', 'en'],
			},
		];

		const MULTI_VERSE_PARSING_SCENARIO: {
			input: string;
			expected: { ref: string; displayText: string }[];
			lastBookId?: string;
			lastChapter?: number;
			lang?: AvailableLanguage[];
		}[] = [
			{
				input: 'Romans;  1Cor',
				expected: [
					{ ref: 'Rom', displayText: 'Romans' },
					{ ref: '1Co', displayText: ';  1Cor' },
				],
			},
			{
				input: 'Romans 1,10-14.18.20-26',
				expected: [
					{ ref: 'Rom1.10-14', displayText: 'Romans 1,10-14' },
					{ ref: 'Rom1.18', displayText: '.18' },
					{ ref: 'Rom1.20-26', displayText: '.20-26' },
				],
			},
			{
				input: 'Romans 1,10-14.18+20-26',
				expected: [
					{ ref: 'Rom1.10-14', displayText: 'Romans 1,10-14' },
					{ ref: 'Rom1.18', displayText: '.18' },
					{ ref: 'Rom1.20-26', displayText: '+20-26' },
				],
			},
			{
				input: 'Romans 1,10-14+18+20–26',
				expected: [
					{ ref: 'Rom1.10-14', displayText: 'Romans 1,10-14' },
					{ ref: 'Rom1.18', displayText: '+18' },
					{ ref: 'Rom1.20-26', displayText: '+20–26' },
				],
			},
			{
				input: '  Romans  1,10  -  14  +  18  .  20  -  26  ',
				expected: [
					{ ref: 'Rom1.10-14', displayText: '  Romans  1,10  -  14  ' },
					{ ref: 'Rom1.18', displayText: '+  18  ' },
					{ ref: 'Rom1.20-26', displayText: '.  20  -  26  ' },
				],
			},
			{
				input: 'Romans 1,10-14.18; 2,15',
				expected: [
					{ ref: 'Rom1.10-14', displayText: 'Romans 1,10-14' },
					{ ref: 'Rom1.18', displayText: '.18' },
					{ ref: 'Rom2.15', displayText: '; 2,15' },
				],
			},
			{
				input: 'Romans 1,10-14.18; 2:15',
				expected: [
					{ ref: 'Rom1.10-14', displayText: 'Romans 1,10-14' },
					{ ref: 'Rom1.18', displayText: '.18' },
					{ ref: 'Rom2.15', displayText: '; 2:15' },
				],
			},
			{
				input: '  Romans  1  :  10  -  14  .  18  ;  2  ,  15  ',
				expected: [
					{ ref: 'Rom1.10-14', displayText: '  Romans  1  :  10  -  14  ' },
					{ ref: 'Rom1.18', displayText: '.  18  ' },
					{ ref: 'Rom2.15', displayText: ';  2  ,  15  ' },
				],
			},
			{
				input: 'Romans 1,10; 2,1-5; Joh 5,8',
				expected: [
					{ ref: 'Rom1.10', displayText: 'Romans 1,10' },
					{ ref: 'Rom2.1-5', displayText: '; 2,1-5' },
					{ ref: 'Joh5.8', displayText: '; Joh 5,8' },
				],
			},
		];

		const generateVariations = (input: (string | string[])[]): string[][] => {
			return input.reduce<string[][]>(
				(acc, item) => {
					const options = Array.isArray(item) ? item : [item];
					const result: string[][] = [];

					for (const prefix of acc) {
						for (const option of options) {
							result.push([...prefix, option]);
						}
					}

					return result;
				},
				[[]],
			);
		};

		describe('Bible Parser', () => {
			test.each(SINGLE_VERSE_PARSING_SCENARIO)('parses $input to $expected', (scenario) => {
				const variations = generateVariations(scenario.input)
					.map((variation) => [variation.join(''), variation.join(' '), variation.join(' ')])
					.flat();
				for (const variation of variations) {
					const results = parseBibleReferences(
						variation,
						['de', 'en'],
						scenario.lastBookId
							? {
									lastBookId: scenario.lastBookId,
									lastChapter: scenario.lastChapter,
								}
							: undefined,
					);
					expect(results.length).toBe(1);
					const formattedLink = formatBibleReferenceForLogos(results[0]);
					expect(formattedLink).toEqual(scenario.expected);
					expect(results[0].displayText).toBe(variation);
				}
			});

			test.each(MULTI_VERSE_PARSING_SCENARIO)('$input', ({ input, expected }) => {
				const results = parseBibleReferences(input, ['en', 'de']);
				expect(results.length).toBe(expected.length);
				for (let i = 0; i < results.length; i++) {
					const result = results[i];
					const expectedResult = expected[i];
					const formattedRef = formatBibleReferenceForLogos(result);
					const displayText = result.displayText || formattedRef;

					expect(formattedRef).toBe(expectedResult.ref);
					expect(displayText).toBe(expectedResult.displayText);
				}
			});
		});
	});
});
