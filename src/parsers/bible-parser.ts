import {AvailableLanguage, BIBLE_DATA, BibleBook} from '../data/bible-structure';

export type BibleReference = {
	bookId: string;
	displayText: string
	chapter?: number,
	verse?: number,
	to?: { chapter?: number, verse?: number },
}

type Segment = {content: string, fullSegmentText: string; isContinuation: boolean};

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
	if (reference.to === undefined) {
		return formattedFrom;
	} else {
		const chapter2 = reference.to.chapter !== reference.chapter ? reference.to.chapter : undefined;
		const verse2 = reference.to.verse;
		if (chapter2 === undefined) {
			return `${formattedFrom}-${verse2}`;
		}
		if (verse2 === undefined) {
			return `${formattedFrom}-${chapter2}`;
		}
		return `${formattedFrom}-${chapter2}.${verse2}`;
	}
}


/**
 * Parses a text with potential multiple bible references
 * Supports splitting by semicolon (;), dot (.) after verses
 * returns all parsed passages with their display text
 */
export const parseBibleReferences = (text: string, enabledLanguages: AvailableLanguage[]): BibleReference[] => {
	const results: BibleReference[] = [];
	
	// split into segments seperated by semicolons
	const segments = splitIntoSegments(text);
	console.log('segments', segments);
	
	let lastBook: BibleBook | null = null;
	
	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		
		// check if it is a continuation (book not part of the segment)
		if (segment.isContinuation && lastBook !== null) {
			// Pattern: "2,15" or "2.15" or only "2"
			const match = segment.content.match(/^(\d+)(?:[:,.]\s*(\d+)(?:[\-–](\d+))?)?$/);
			console.log('parse > segment.isContinuation', segment, match);
			if (match) {
				const chapter = parseInt(match[1], 10);
				const verse = match[2] ? parseInt(match[2], 10) : undefined;
				const verse2 = match[3] ? parseInt(match[3], 10) : undefined;

				results.push({
					bookId: lastBook.id,
					chapter,
					verse,
					to: verse2 !== undefined ? { chapter, verse: verse2 } : undefined,
					displayText: segment.fullSegmentText,
				})
				continue;
			}
		}

		// check if is not non-connected verses in passage (dot or plus after verse)
		// Pattern: "Romans 1,10-14.18.20-26"
		const disconnectedVersesMatch = segment.fullSegmentText.match(/^(.*?)([.+].*)$/);
		const mainPart = disconnectedVersesMatch ? disconnectedVersesMatch[1] : null;
		const disconnectedVerses = disconnectedVersesMatch ? disconnectedVersesMatch[2] : null;
		const mainLinkParsed = parseSingleBibleReference(mainPart ?? segment.fullSegmentText, enabledLanguages);
		console.log('parse > main: ', mainPart, ' disconnected:', disconnectedVerses, ' parsed:', mainLinkParsed);


		if (mainLinkParsed) {
			results.push(mainLinkParsed);
			if (disconnectedVerses) {
				const bookId = mainLinkParsed.bookId;
				const chapter = mainLinkParsed.to?.chapter ?? mainLinkParsed.chapter;
				if (chapter) {
					results.push(...parseDisconnectedVerses(disconnectedVerses, bookId, chapter))
				}
			}
			lastBook = findBibleBookById(mainLinkParsed.bookId, enabledLanguages);
		} else {
			lastBook = null;
		}
	}

	console.log('### RESULT', results);
	return results;
}

const findBibleBook = (text: string, enabledLanguages: AvailableLanguage[]): BibleBook | null => {
	// normalize the text (remove unnecessary spaces)
	const normalizedText = text.trim().replace(/\s+/g, ' ');

	// search through all available languages
	for (const langCode of enabledLanguages) {
		const bible = BIBLE_DATA[langCode];
		for (const section of bible.sections) {
			for (const book of section.books) {
				if (book.name.test(normalizedText)) {
					return book;
				}
			}
		}
	}

	return null;
}

const findBibleBookById = (bookId: string, enabledLanguages: AvailableLanguage[]): BibleBook | null => {
	for (const langCode of enabledLanguages) {
		const bible = BIBLE_DATA[langCode];
		for (const section of bible.sections) {
			const book = section.books.find(b => b.id === bookId);
			if (book) {
				return book;
			}
		}
	}
	return null;
}

/**
 * Splits a text into segments which represent a bible passage
 * keeps the original text with all characters (including semicolons)
 */
export const splitIntoSegments = (text: string): Segment[] => {
	const segments: Segment[] = [];
	let lastIndex: number | undefined;
	for (let i = 0; i < text.length; i++) {
		if (text[i] === ';') {
			segments.push(createSegment(text, lastIndex, i))
			lastIndex = i;
		}
	}
	segments.push(createSegment(text, lastIndex))
	return segments;
}

const createSegment = (text: string, previousSegmentSeparatorIndex?: number, segmentSeparatorIndex?: number): Segment => {
	const fullSegmentText = text.substring(previousSegmentSeparatorIndex ?? 0, segmentSeparatorIndex);
	const content = text.substring(previousSegmentSeparatorIndex !== undefined ? previousSegmentSeparatorIndex + 1 : 0, segmentSeparatorIndex).trim();
	return { content, fullSegmentText, isContinuation: /^[\s\d,:\-–+]+$/.test(content) };
}

/**
 * Parses a passes with potential non-connected verses
 * e.g. ".18.20.20-26"
 * Returns all passages with their display texts
 */
const parseDisconnectedVerses = (disconnectedVerses: string, bookId: string, chapter: number): BibleReference[] => {
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
		const match = part.match(/^\s*[.+]?\s*(\d+)\s*(?:[\-–]\s*(\d+))?\s*$/);
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
}

export const parseSingleBibleReference = (text: string, enabledLanguages: AvailableLanguage[]): BibleReference | null => {
	const normalizedText = text
		// remove semicolon
		.replace(';', '')
		.replace(/\s+/g, ' ')
		.trim();

	// Pattern 1: Cross chapter passages (z.B. "Romans 1,20-2,1")
	const crossChapterMatch = normalizedText.match(/^(.+)\s+(\d+)\s*[:,]\s*(\d+)\s*[\-–]\s*(\d+)\s*[:,]\s*(\d+)$/);
	if (crossChapterMatch) {
		const book = findBibleBook(crossChapterMatch[1].trim(), enabledLanguages);
		if (book) {
			const chapter = parseInt(crossChapterMatch[2], 10);
			const verse = parseInt(crossChapterMatch[3], 10);
			const chapter2 = parseInt(crossChapterMatch[4], 10);
			const verse2 = parseInt(crossChapterMatch[5], 10);
			return {
				bookId: book.id,
				chapter,
				verse,
				to: { chapter: chapter2, verse: verse2 },
				displayText: text,
			};
		}
	}

	// Pattern 2: Cross chapter with missing verse (z.B. "Römer 1-2,1")
	// this will interpreted as  "Rom1.1-2.1"
	const crossChapterMissingMatch = normalizedText.match(/^(.+)\s+(\d+)\s*[\-–]\s*(\d+)\s*[:,]\s*(\d+)$/);
	if (crossChapterMissingMatch) {
		const book = findBibleBook(crossChapterMissingMatch[1].trim(), enabledLanguages);
		if (book) {
			const chapter = parseInt(crossChapterMissingMatch[2], 10);
			const chapter2 = parseInt(crossChapterMissingMatch[3], 10);
			const verse2 = parseInt(crossChapterMissingMatch[4], 10);
			return {
				bookId: book.id,
				chapter,
				verse: 1,
				to: { chapter: chapter2, verse: verse2 },
				displayText: text,
			};
		}
	}

	// Pattern 3: chapter + verse(s) (e.g. "Romans 1,20" or "Romans 1,20-25")
	const verseMatch = normalizedText.match(/^(.+)\s+(\d+)\s*[:,]\s*(\d+)\s*(?:[\-–]\s*(\d+))?$/);
	if (verseMatch) {
		const book = findBibleBook(verseMatch[1].trim(), enabledLanguages);
		if (book) {
			const chapter = parseInt(verseMatch[2], 10);
			const verse = parseInt(verseMatch[3], 10);
			const verse2 = verseMatch[4] ? parseInt(verseMatch[4], 10) : undefined;
			return {
				bookId: book.id,
				chapter,
				verse,
				to: verse2 !== undefined ? { verse: verse2 } : undefined,
				displayText: text,
			}
		}
	}

	// Pattern 4: chapter range passage (e.g. "Romans 1-2")
	const chapterRangeMatch = normalizedText.match(/^(.+)\s+(\d+)\s*[\-–]\s*(\d+)$/);
	if (chapterRangeMatch) {
		const book = findBibleBook(chapterRangeMatch[1].trim(), enabledLanguages);
		const chapter = parseInt(chapterRangeMatch[2], 10);
		const chapter2 = parseInt(chapterRangeMatch[3], 10);
		if (book) {
			return {
				bookId: book.id,
				chapter,
				to: { chapter: chapter2 },
				displayText: text,
			}
		}
	}

	// Pattern 5: only chapter
	const chapterPattern = /^(.+)\s+(\d+)$/;
	const chapterMatch = normalizedText.match(chapterPattern);
	if (chapterMatch) {
		const book = findBibleBook(chapterMatch[1].trim(), enabledLanguages);
		if (book) {
			const chapter = parseInt(chapterMatch[2], 10);
			return {
				bookId: book.id,
				chapter,
				displayText: text,
			};
		}
	}

	// Pattern 6: only book (e.g. "Romans")
	const book = findBibleBook(normalizedText, enabledLanguages);
	if (book) {
		return {
			bookId: book.id,
			displayText: text,
		};
	}

	return null;
}
