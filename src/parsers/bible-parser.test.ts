import {
	formatBibleReferenceForLogos,
	parseBibleReferences,
} from "./bible-parser";

interface TestCase {
	description: string;
	input: string;
	expected: Array<{
		reference: string; // Logos-Format
		displayText: string; // Anzeigetext
	}>;
}

describe("Bible Parser", () => {
	test.each([
		{
			input: "Römer",
			expected: [{ reference: "Rom", displayText: "Römer" }],
		},
		{
			input: "Römer 1",
			expected: [{ reference: "Rom1", displayText: "Römer 1" }],
		},
		{
			input: "Römer 1-2",
			expected: [{ reference: "Rom1-2", displayText: "Römer 1-2" }],
		},
		{
			input: "Römer 1–2",
			expected: [{ reference: "Rom1-2", displayText: "Römer 1–2" }],
		},
		{
			input: "Römer 1  -  2",
			expected: [{ reference: "Rom1-2", displayText: "Römer 1  -  2" }],
		},
		{
			input: "Römer 1  –  2",
			expected: [{ reference: "Rom1-2", displayText: "Römer 1  –  2" }],
		},
		{
			input: "Römer 1,20",
			expected: [{ reference: "Rom1.20", displayText: "Römer 1,20" }],
		},
		{
			input: "Römer 1:20",
			expected: [{ reference: "Rom1.20", displayText: "Römer 1:20" }],
		},
		{
			input: "  Römer 1  ,  20  ",
			expected: [{ reference: "Rom1.20", displayText: "  Römer 1  ,  20  " }],
		},
		{
			input: "  Römer 1  :  20  ",
			expected: [{ reference: "Rom1.20", displayText: "  Römer 1  :  20  " }],
		},
		{
			input: "Römer 1,20-25",
			expected: [
				{ reference: "Rom1.20-25", displayText: "Römer 1,20-25" },
			],
		},
		{
			input: "Römer 1:20-25",
			expected: [
				{ reference: "Rom1.20-25", displayText: "Römer 1:20-25" },
			],
		},
		{
			input: "Römer 1,20–25",
			expected: [
				{ reference: "Rom1.20-25", displayText: "Römer 1,20–25" },
			],
		},
		{
			input: "Römer 1  ,  20  –  25",
			expected: [
				{ reference: "Rom1.20-25", displayText: "Römer 1  ,  20  –  25" },
			],
		},
		{
			input: "  Römer 1  :  20  -  25  ",
			expected: [
				{ reference: "Rom1.20-25", displayText: "  Römer 1  :  20  -  25  " },
			],
		},
		{
			input: "Römer 1,20-2,1",
			expected: [
				{ reference: "Rom1.20-2.1", displayText: "Römer 1,20-2,1" },
			],
		},
		{
			input: "Römer 1:20-2:1",
			expected: [
				{ reference: "Rom1.20-2.1", displayText: "Römer 1:20-2:1" },
			],
		},
		{
			input: "Römer 1:20–2:1",
			expected: [
				{ reference: "Rom1.20-2.1", displayText: "Römer 1:20–2:1" },
			],
		},
		{
			input: "Römer 1,20-2:1",
			expected: [
				{ reference: "Rom1.20-2.1", displayText: "Römer 1,20-2:1" },
			],
		},
		{
			input: "  Römer 1  ,  20  -  2  ,  1  ",
			expected: [
				{ reference: "Rom1.20-2.1", displayText: "  Römer 1  ,  20  -  2  ,  1  " },
			],
		},
		{
			input: "Römer 1-2,1",
			expected: [{ reference: "Rom1.1-2.1", displayText: "Römer 1-2,1" }],
		},
		{
			input: "Römer; 1Kor",
			expected: [
				{ reference: "Rom", displayText: "Römer" },
				{ reference: "1Co", displayText: "; 1Kor" },
			],
		},
		{
			input: "Römer 1,10-14.18.20-26",
			expected: [
				{ reference: "Rom1.10-14", displayText: "Römer 1,10-14" },
				{ reference: "Rom1.18", displayText: ".18" },
				{ reference: "Rom1.20-26", displayText: ".20-26" },
			],
		},
		{
			input: "Römer 1,10-14.18+20-26",
			expected: [
				{ reference: "Rom1.10-14", displayText: "Römer 1,10-14" },
				{ reference: "Rom1.18", displayText: ".18" },
				{ reference: "Rom1.20-26", displayText: "+20-26" },
			],
		},
		{
			input: "Römer 1,10-14+18+20–26",
			expected: [
				{ reference: "Rom1.10-14", displayText: "Römer 1,10-14" },
				{ reference: "Rom1.18", displayText: "+18" },
				{ reference: "Rom1.20-26", displayText: "+20–26" },
			],
		},
		{
			input: "  Römer  1,10  -  14  +  18  .  20  -  26  ",
			expected: [
				{ reference: "Rom1.10-14", displayText: "  Römer  1,10  -  14  " },
				{ reference: "Rom1.18", displayText: "+  18  " },
				{ reference: "Rom1.20-26", displayText: ".  20  -  26  " },
			],
		},
		{
			input: "Römer 1,10-14.18; 2,15",
			expected: [
				{ reference: "Rom1.10-14", displayText: "Römer 1,10-14" },
				{ reference: "Rom1.18", displayText: ".18" },
				{ reference: "Rom2.15", displayText: "; 2,15" },
			],
		},
		{
			input: "Römer 1,10-14.18; 2:15",
			expected: [
				{ reference: "Rom1.10-14", displayText: "Römer 1,10-14" },
				{ reference: "Rom1.18", displayText: ".18" },
				{ reference: "Rom2.15", displayText: "; 2:15" },
			],
		},
		{
			input: "  Römer  1  :  10  -  14  .  18  ;  2  ,  15  ",
			expected: [
				{ reference: "Rom1.10-14", displayText: "  Römer  1  :  10  -  14  " },
				{ reference: "Rom1.18", displayText: ".  18  " },
				{ reference: "Rom2.15", displayText: ";  2  ,  15  " },
			],
		},
		{
			input: "Römer 1,10; 2,1-5; Josua 5,8",
			expected: [
				{ reference: "Rom1.10", displayText: "Römer 1,10" },
				{ reference: "Rom2.1-5", displayText: "; 2,1-5" },
				{ reference: "Jos5.8", displayText: "; Josua 5,8" },
			],
		},
	] as TestCase[])("$input", ({ input, expected }) => {
		const results = parseBibleReferences(input, ["en", "de"]);
		expect(results.length).toBe(expected.length);
		for (let i = 0; i < results.length; i++) {
			const result = results[i];
			const expectedResult = expected[i];
			const formattedRef = formatBibleReferenceForLogos(result);
			const displayText = result.displayText || formattedRef;

			expect(formattedRef).toBe(expectedResult.reference);
			expect(displayText).toBe(expectedResult.displayText);
		}
	});
});
