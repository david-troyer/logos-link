// 'Passage was not formatted correctly.'
// 'Create Logos-Link'

import {getLanguage} from "obsidian"
import {AvailableLanguage} from "../data/bible-structure";

export const Messages = {
	link_with_logos: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Mit Logos verlinken';
			default:
				return 'Link with Logos'
		}
	},
	add_link_to_logos: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Link zu Logos einfügen';
			default:
				return 'Add link to Logos'
		}
	},
	create_logos_link: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Logos-Link erstellen';
			default:
				return 'Create Logos-Link';
		}
	},
	auto_mode: () => 'Auto',
    manual_mode: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Manuell';
			default:
				return 'Manual';
		}
	},
	cancel: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Abbrechen';
			default:
				return 'Cancel';
		}
	},
	create_link: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Link erstellen';
			default:
				return 'Create link';
		}
	},
	passage_input_auto_name: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Bibelstelle';
			default:
				return 'Bible passage';
		}
	},
	passage_input_manual_name: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Anzeigetext';
			default:
				return 'Display text';
		}
	},
	passage_input_auto_placeholder: () => {
		switch (getLanguage()) {
			case 'de':
				return 'z.B. Joh 1,1-4+14';
			default:
				return 'e.g. John 1:1-4+14';
		}
	},
	link_text_input_name: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Logos-link';
			default:
				return 'Link to Logos';
		}
	},
	link_text_input_description: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Die Bibelstelle im Logos-Format (z.B. Joh1.1-4)';
			default:
				return 'Bible passage in Logos format (e.g. Joh1.1-4)';
		}
	},
	link_text_input_placeholder: () => {
		switch (getLanguage()) {
			case 'de':
				return 'z.B. Joh1.1-4';
			default:
				return 'e.g. Joh1.1-4';
		}
	},
	delete: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Entfernen';
			default:
				return 'Delete';
		}
	},
	add_button_text: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Hinzufügen';
			default:
				return 'Add';
		}
	},
	passage_not_formatted_correctly: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Biblestelle ist nicht korrekt formatiert.';
			default:
				return 'Passage was not formatted correctly.';

		}
	},
	passage_format_invalid: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Ungültige Biblestellenangabe';
			default:
				return 'Passage format invalid';

		}
	},
	all_input_fields_must_have_a_value: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Alle Textfelder müssen ausgefüllt sein.';
			default:
				return 'All inputs must have a value';

		}
	},
	links_empty: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Kein Logos-Link erstellt';
			default:
				return 'No logos link created';

		}
	},
	settings_headline: () => 'Logos Link Settings',
	settings_choose_languages_text: () => {
		switch (getLanguage()) {
			case 'de':
				return 'Wählen Sie die Sprachen aus, die für die Erkennung von Büchern Bibelstellen verwendet werden sollen';
			default:
				return 'Choose the languages, which are supported to detect the correct books in bible references';
		}
	},
}
