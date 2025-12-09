import { AvailableLanguage, BIBLE_DATA, BibleBook } from '../data/bible-structure';

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

const BIBLE_REFERENCE_WITH_BOOK_PATTERN =
	/^((?=.*[^\d\s:,\-–]).+?)(?:\s+(\d+(?:\s*[,:]\s*\d+)?)(?:\s*[-–]\s*(\d+(?:\s*[,:]\s*\d+)?))?)?\s*$/;
const BIBLE_REFERENCE_WITHOUT_BOOK_PATTERN =
	/^\s*(\d+(?:\s*[,:]\s*\d+)?)(?:\s*[-–]\s*(\d+(?:\s*[,:]\s*\d+)?))?\s*$/;
const POINTER_PATTERN = /^\s*(\d+)\s*(?:[,:]\s*(\d+))?\s*$/;
const DISCONNECTED_VERSES_PATTERN = /^\s*[.+]?\s*(\d+)\s*(?:[-–]\s*(\d+))?\s*$/;

type Pointer = [number, number] | [number];

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
): BibleReference[] => {
	const results: BibleReference[] = [];

	// split into segments seperated by semicolons
	const segments = splitIntoSegments(text);
	let lastBookId: string | null = null;
	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];

		// check if it is a continuation (book not part of the segment)
		if (segment.isContinuation && lastBookId) {
			const reference = parseSingleBibleReferenceWithoutBook(
				segment.content,
				segment.fullSegmentText,
				lastBookId,
			);

			if (reference) {
				results.push(reference);
				continue;
			}
		}

		// check if is not non-connected verses in passage (dot or plus after verse)
		// Pattern: "Romans 1,10-14.18.20-26"
		const disconnectedVersesMatch = segment.fullSegmentText.match(/^(.*?)([.+].*)$/);
		const mainPart = disconnectedVersesMatch ? disconnectedVersesMatch[1] : null;
		const disconnectedVerses = disconnectedVersesMatch ? disconnectedVersesMatch[2] : null;

		const mainLinkParsed = parseSingleBibleReference(
			mainPart ?? segment.fullSegmentText,
			enabledLanguages,
			lastBookId ?? undefined,
			'book-optional',
		);

		if (mainLinkParsed) {
			results.push(mainLinkParsed);
			if (disconnectedVerses) {
				const bookId = mainLinkParsed.bookId;
				const chapter = mainLinkParsed.to?.chapter ?? mainLinkParsed.chapter;
				if (chapter) {
					results.push(...parseDisconnectedVerses(disconnectedVerses, bookId, chapter));
				}
			}
			lastBookId = mainLinkParsed.bookId;
		} else {
			lastBookId = null;
		}
	}

	return results;
};

export const parseSingleBibleReference = (
	text: string,
	enabledLanguages: AvailableLanguage[],
	lastBookId?: string,
	mode: 'requires-book' | 'no-book' | 'book-optional' = 'book-optional',
): BibleReference | null => {
	const normalizeText = text.replace(';', '').trim();
	let reference: BibleReference | null = null;
	if (mode !== 'no-book') {
		reference = parseSingleBibleReferenceWithBook(normalizeText, text, enabledLanguages);
	}
	if (mode !== 'requires-book' && !reference) {
		reference = parseSingleBibleReferenceWithoutBook(normalizeText, text, lastBookId);
	}
	return reference;
};

export const findBibleBook = (text: string, enabledLanguages: AvailableLanguage[]): BibleBook | null => {
	// normalize the text (remove unnecessary spaces)
	const normalizedText = text.trim().replace(/\s+/g, ' ');

	// search through all available languages
	for (const langCode of enabledLanguages) {
		const bible = BIBLE_DATA[langCode];
		for (const book of bible.books) {
			if (book.name.test(normalizedText)) {
				return book;
			}
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

const parseSingleBibleReferenceWithBook = (
	text: string,
	displayText: string,
	enabledLanguages: AvailableLanguage[],
): BibleReference | null => {
	const match = text.match(BIBLE_REFERENCE_WITH_BOOK_PATTERN);
	if (match) {
		const book = findBibleBook(match[1].trim(), enabledLanguages);
		if (book) {
			return createBibleReferenceFromPointers(
				book.id,
				parsePointer(match[2]),
				parsePointer(match[3]),
				displayText,
			);
		}
	}
	return null;
};

const parseSingleBibleReferenceWithoutBook = (
	text: string,
	displayText: string,
	lastBookId?: string,
): BibleReference | null => {
	const match = text.match(BIBLE_REFERENCE_WITHOUT_BOOK_PATTERN);
	return match && lastBookId
		? createBibleReferenceFromPointers(
				lastBookId,
				parsePointer(match[1]),
				parsePointer(match[2]),
				displayText,
			)
		: null;
};

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
