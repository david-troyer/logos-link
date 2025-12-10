import { AvailableLanguage, BIBLE_DATA } from '../data/bible-structure';

export type BibleReference = {
	bookId: string;
	displayText: string;
	chapter?: number;
	verse?: number;
	to?: { chapter?: number; verse?: number };
};

type Segment = {
	content: string;
	fullSegmentText: string;
	isContinuation: boolean;
};

const POINTER_PATTERN = /^\s*(\d+)\s*(?:[,:]\s*(\d+))?\s*$/;
const DISCONNECTED_VERSES_PATTERN = /^\s*[.+]?\s*(\d+)\s*(?:[-–]\s*(\d+))?\s*$/;
const NEW_BIBLE_REFERENCE_PATTERN =
	/^(?<main>\s*;?\s*(?<book>\d*[^\d:,]+(?=\d+|$))?(?<pointer>(?<from>\d+(?:\s*[,:]\s*\d+)?)(?:\s*[-–]\s*(?<to>\d+(?:\s*[,:]\s*\d+)?))?)?\s*)(?<rest>(?:\s*[.+,]?\s*)?\d+(?:\s*[.+,\-–]\s*\d+)*\s*)?$/;
const VERSE_ONLY_PATTERN =
	/^(?<main>(?<v>[^\d,]+(?=\d+|$))(\s*(?<from>\d+)(?:\s*[-–]\s*(?<to>\d+))?))(?<rest>\s*[.+,\-–]\s*\d+)*\s*$/;
const CONTEXT_PATTERN = /^\s*(?<book>\d*[^\d:,]+(?=\d+|$))(?:\s*(?<chapter>\d+))?\s*$/;

type Pointer = [number, number] | [number];

type ParsedSegment = {
	bookId: string;
	from: Pointer | [];
	to: Pointer | [];
	displayText: string;
	disjointVerses?: string;
};

/**
 * formats a reference for logos link
 * - "Rom"
 * - "Rom1"
 * - "Rom1-2"
 * - "Rom1.20"
 * - "Rom1.20-25"
 * - "Rom1.20-2.1"
 */
export const formatBibleReferenceForLogos = (reference: BibleReference): string => {
	if (reference.chapter === undefined) {
		return reference.bookId;
	}
	const formattedBook = reference.bookId;
	const formattedChapter = reference.chapter;
	const formattedVerse = reference.verse !== undefined ? `.${reference.verse}` : '';
	const formattedFrom = `${formattedBook}${formattedChapter}${formattedVerse}`;
	if (reference.to !== undefined) {
		const chapter2 =
			reference.to.chapter !== reference.chapter ? reference.to.chapter : undefined;
		const verse2 = reference.to.verse;
		if (chapter2 === undefined) {
			return `${formattedFrom}-${verse2}`;
		}
		if (verse2 === undefined) {
			return `${formattedFrom}-${chapter2}`;
		}
		return `${formattedFrom}-${chapter2}.${verse2}`;
	}
	return formattedFrom;
};

/**
 * Parses a text with potential multiple bible references
 * Supports splitting by semicolon (;), dot (.) after verses
 * returns all parsed passages with their display text
 */
export const parseBibleReferences = (
	text: string,
	enabledLanguages: AvailableLanguage[],
	context?: BibleLinkContext | null,
): BibleReference[] => {
	const results: BibleReference[] = [];

	// split into segments seperated by semicolons
	const segments = splitIntoSegments(text);
	let lastBookId: string | null = context?.bookId ?? null;
	for (const segment of segments) {
		const parsedSegment = parseSegment(
			segment,
			enabledLanguages,
			lastBookId ?? undefined,
			getLastChapter(results, context?.chapter),
		);

		if (parsedSegment) {
			results.push(
				createBibleReferenceFromPointers(
					parsedSegment.bookId,
					parsedSegment.from,
					parsedSegment.to,
					parsedSegment.displayText,
				),
			);

			const lastChapter = getLastChapter(results, context?.chapter);
			if (parsedSegment.disjointVerses && lastChapter) {
				results.push(
					...parseDisconnectedVerses(
						parsedSegment.disjointVerses,
						parsedSegment.bookId,
						lastChapter,
					),
				);
			}

			lastBookId = parsedSegment.bookId;
		}
	}

	return results;
};

const getLastChapter = (
	references: BibleReference[],
	fallback?: number | undefined,
): number | undefined => {
	const lastReference = references[references.length - 1];
	return lastReference?.to?.chapter ?? lastReference?.chapter ?? fallback;
};

export const findBibleBook = (
	text: string,
	enabledLanguages: AvailableLanguage[],
	lastBookId?: string | null,
): string | null => {
	// normalize the text (remove unnecessary spaces)
	const normalizedText = text.trim().replace(/\s+/g, ' ');

	// search through all available languages
	for (const langCode of enabledLanguages) {
		const bible = BIBLE_DATA[langCode];
		for (const book of bible.books) {
			if (book.name.test(normalizedText)) {
				return book.id;
			}
		}

		if (
			lastBookId &&
			(bible.chapter.test(normalizedText) || bible.verse.test(normalizedText))
		) {
			return lastBookId;
		}
	}

	return null;
};

/**
 * Splits a text into segments which represent a bible passage
 * keeps the original text with all characters (including semicolons)
 */
const splitIntoSegments = (text: string): Segment[] => {
	const segments: Segment[] = [];
	let lastIndex: number | undefined = undefined;
	for (let i = 0; i < text.length; i++) {
		if (text[i] === ';') {
			segments.push(createSegment(text, lastIndex, i));
			lastIndex = i;
		}
	}
	segments.push(createSegment(text, lastIndex));
	return segments;
};

const parseSegment = (
	segment: Segment,
	enabledLanguages: AvailableLanguage[],
	lastBookId?: string,
	lastChapter?: number,
): ParsedSegment | null => {
	const verseOnlyMatch = VERSE_ONLY_PATTERN.exec(segment.fullSegmentText);
	if (verseOnlyMatch) {
		const groups = verseOnlyMatch.groups;
		const verseIndicator = groups?.['v']?.trim();
		const from = groups?.['from'];
		const to = groups?.['to'];

		const bookId = lastBookId;

		if (verseIndicator && enabledLanguages.some((lang) => BIBLE_DATA[lang].verse.test(verseIndicator))) {
			return bookId && lastChapter ? {
				bookId,
				from: from ? [lastChapter, parseInt(from, 10)] : [],
				to: to ? [lastChapter, parseInt(to, 10)] : [],
				displayText: groups?.['main'] ?? '',
				disjointVerses: groups?.['rest'],
			} : null;
		}
	}

	const match = NEW_BIBLE_REFERENCE_PATTERN.exec(segment.fullSegmentText);
	if (match) {
		const groups = match.groups;
		const bookCandidate = groups?.['book']?.trim();
		const from = groups?.['from'];
		const to = groups?.['to'];

		const bookId = bookCandidate
			? findBibleBook(bookCandidate, enabledLanguages, lastBookId ?? undefined)
			: lastBookId;

		if (bookId) {
			return {
				bookId,
				from: from ? parsePointer(from) : [],
				to: to ? parsePointer(to) : [],
				displayText: groups?.['main'] ?? '',
				disjointVerses: groups?.['rest'],
			};
		}
	}

	return null;
};

const createSegment = (
	text: string,
	previousSegmentSeparatorIndex?: number,
	segmentSeparatorIndex?: number,
): Segment => {
	const fullSegmentText = text.substring(
		previousSegmentSeparatorIndex ?? 0,
		segmentSeparatorIndex,
	);
	const content = text
		.substring(
			previousSegmentSeparatorIndex !== undefined ? previousSegmentSeparatorIndex + 1 : 0,
			segmentSeparatorIndex,
		)
		.trim();
	return {
		content,
		fullSegmentText,
		isContinuation: /^[\s\d,:\-–+]+$/.test(content),
	};
};

/**
 * Parses a passes with potential non-connected verses
 * e.g. ".18.20.20-26"
 * Returns all passages with their display texts
 */
const parseDisconnectedVerses = (
	disconnectedVerses: string,
	bookId: string,
	chapter: number,
): BibleReference[] => {
	const results: BibleReference[] = [];

	// separates after dots or pluses
	const parts: string[] = [];
	let lastSeparatorIndex = 0;
	for (let i = 0; i < disconnectedVerses.length; i++) {
		const character = disconnectedVerses[i];
		if (i > 0 && (character === '.' || character === '+')) {
			parts.push(disconnectedVerses.substring(lastSeparatorIndex, i));
			lastSeparatorIndex = i;
		}
	}
	if (lastSeparatorIndex < disconnectedVerses.length) {
		parts.push(disconnectedVerses.substring(lastSeparatorIndex));
	}

	// parse every passage
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];
		const match = part.match(DISCONNECTED_VERSES_PATTERN);
		if (match) {
			const verse = parseInt(match[1], 10);
			const verse2 = match[2] ? parseInt(match[2], 10) : undefined;
			results.push({
				bookId,
				chapter,
				verse,
				to: verse2 !== undefined ? { chapter, verse: verse2 } : undefined,
				displayText: part,
			});
		}
	}

	return results;
};

const createBibleReferenceFromPointers = (
	bookId: string,
	from: Pointer | [],
	to: Pointer | [],
	displayText: string,
): BibleReference => ({
	bookId,
	chapter: from[0],
	// when it is e.g. "Romans 1-2,1" it should be considered like "Romans 1,1-2,1"
	verse: from[1] ?? (to.length === 2 ? 1 : undefined),
	to:
		to.length > 0
			? { chapter: to.length === 1 ? from[0] : to[0], verse: to.length === 1 ? to[0] : to[1] }
			: undefined,
	displayText,
});

/**
 * Parses a "pointer". This refers to a pair of chapter + verse or only a chapter or only a verse.
 * For this it needs to follow a defined pattern (ignoring whitespaces):
 * - <chapter>,<verse>
 * - <chapter>:<verse>
 * - <chapter>
 * - <verse>
 *
 * @param pointerText - the text to parse
 * @return a list of numbers (either with a length of 2, 1 or 0)
 */
const parsePointer = (pointerText: string | undefined | null): Pointer | [] => {
	const match = pointerText?.match(POINTER_PATTERN);
	if (match) {
		const first = parseInt(match[1], 10);
		const second = match[2] ? parseInt(match[2], 10) : null;
		return second ? [first, second] : [first];
	}
	return [];
};

export type BibleLinkContext = { bookId: string; chapter?: number };
export const parseBibleLinkContext = (
	text: string,
	enabledLanguages: AvailableLanguage[],
): BibleLinkContext | null => {
	const match = CONTEXT_PATTERN.exec(text);
	if (match) {
		const bookCandidate = match.groups?.['book'];
		const chapter = match.groups?.['chapter'];
		const bookId = bookCandidate ? findBibleBook(bookCandidate.trim(), enabledLanguages) : null;
		if (bookId) {
			return { bookId, chapter: chapter ? parseInt(chapter, 10) : undefined };
		}
	}
	return null;
};
