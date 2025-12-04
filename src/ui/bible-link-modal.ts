import { App, Modal, setIcon, Setting } from 'obsidian';
import {
	BibleReference,
	formatBibleReferenceForLogos,
	parseBibleReferences,
} from '../parsers/bible-parser';
import { AvailableLanguage } from '../data/bible-structure';
import { Messages } from '../messages/messages';

export interface LogosLink {
	displayText: string;
	linkPassage: string;
}

interface LinkTuple {
	displayTextInput: HTMLInputElement;
	referenceInput: HTMLInputElement;
	container: HTMLElement;
}

const INPUT_INVALID_CLASS = 'input-error';

export class BibleLinkModal extends Modal {
	// auto-mode
	private autoDisplayTextInput: HTMLInputElement | null = null;
	private autoReferenceInput: HTMLInputElement | null = null;

	// manual-mode
	private manualTuples: LinkTuple[] = [];
	private manualTuplesContainer: HTMLElement | null = null;

	private modeToggle: 'auto' | 'manual' = 'auto';
	private parsedReferences: BibleReference[] = [];

	constructor(
		app: App,
		private initialText: string = '',
		private enabledLanguages: AvailableLanguage[],
		private onSubmit: (links: LogosLink[]) => void,
	) {
		super(app);
		this.setTitle(Messages.create_logos_link())
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass('logos-link-modal');

		// Mode Toggle (auto / manual)
		const modeButtonGroup = contentEl.createDiv('logos-link-modal__mode-button-group');

		const autoButton = modeButtonGroup.createEl('button', {
			text: Messages.auto_mode(),
			cls: this.modeToggle === 'auto' ? 'mod-cta' : '',
		});

		const manualButton = modeButtonGroup.createEl('button', {
			text: Messages.manual_mode(),
			cls: this.modeToggle === 'manual' ? 'mod-cta' : '',
		});

		autoButton.onclick = () => {
			this.modeToggle = 'auto';
			autoButton.addClass('mod-cta');
			manualButton.removeClass('mod-cta');
			this.renderContent();
		};

		manualButton.onclick = () => {
			if (this.modeToggle === 'auto' && this.autoDisplayTextInput) {
				this.parsedReferences = parseBibleReferences(
					this.autoDisplayTextInput.value,
					this.enabledLanguages,
				);
			}

			this.modeToggle = 'manual';
			manualButton.addClass('mod-cta');
			autoButton.removeClass('mod-cta');
			this.renderContent();
		};

		this.renderContent();
	}

	private renderContent() {
		const { contentEl } = this;

		// re-create content when calling this render function -> therefore remove old
		contentEl.querySelector('.logos-link-modal__content')?.remove();
		contentEl.querySelector('.logos-link-modal__button-container')?.remove();

		const contentContainer = contentEl.createDiv('logos-link-modal__content');
		if (this.modeToggle === 'auto') {
			this.renderAutoMode(contentContainer);
		} else {
			this.renderManualMode(contentContainer);
		}

		const buttonContainer = contentEl.createDiv('logos-link-modal__button-container');
		const cancelButton = buttonContainer.createEl('button', { text: Messages.cancel() });
		cancelButton.onclick = () => this.close();

		const createButton = buttonContainer.createEl('button', {
			text: Messages.create_link(),
			cls: 'logos-link-modal__create-button mod-cta',
		});
		createButton.onclick = () => this.onClickCreate();

		this.updateCreateButtonState();
	}

	private renderAutoMode(container: HTMLElement) {
		new Setting(container).setName(Messages.passage_input_auto_name()).addText((text) => {
			this.autoDisplayTextInput = text.inputEl;
			text.setPlaceholder(Messages.passage_input_auto_placeholder());
			if (this.initialText) {
				text.setValue(this.initialText);
			}
			text.inputEl.addEventListener('input', () => this.updateAutoMode());
		});
		new Setting(container)
			.setName(Messages.link_text_input_name())
			.setDesc(Messages.link_text_input_description())
			.addText((text) => {
				this.autoReferenceInput = text.inputEl;
				text.setPlaceholder(Messages.passage_format_invalid());
				text.inputEl.disabled = true;
				text.inputEl.readOnly = true;
			});

		this.updateAutoMode();
	}

	private updateAutoMode() {
		if (!this.autoDisplayTextInput || !this.autoReferenceInput) {
			return;
		}
		this.parsedReferences = parseBibleReferences(
			this.autoDisplayTextInput.value.trim(),
			this.enabledLanguages,
		);
		this.autoReferenceInput.value = this.parsedReferences
			.map(formatBibleReferenceForLogos)
			.join('; ');
		this.updateCreateButtonState();
	}

	private renderManualMode(container: HTMLElement) {
		this.manualTuplesContainer = container.createDiv('logos-link-tuples-container');
		if (this.parsedReferences.length > 0) {
			for (const ref of this.parsedReferences) {
				this.addManualTuple(
					ref.displayText || formatBibleReferenceForLogos(ref),
					formatBibleReferenceForLogos(ref),
				);
			}
		} else {
			// add empty tuple if list is empty
			this.addManualTuple('', '');
		}

		const addButton = container.createEl('button', {
			text: `+ ${Messages.add_button_text()}`,
			cls: 'logos-link-tuple__add-button',
		});
		addButton.onclick = () => {
			this.addManualTuple('', '');
			this.updateCreateButtonState();
		};
	}

	private addManualTuple(displayText: string, reference: string) {
		if (!this.manualTuplesContainer) return;

		const tupleContainer = this.manualTuplesContainer.createDiv('logos-link-tuple');

		const displayTextInput = tupleContainer.createDiv('logos-link-tuple__display-text-input');

		new Setting(displayTextInput)
			.setName(Messages.passage_input_manual_name())
			.addText((text) => {
				text.setValue(displayText);
				text.inputEl.addEventListener('input', () => this.updateCreateButtonState());
			});

		const referenceInput = tupleContainer.createDiv('logos-link-tuple__reference-input');
		new Setting(referenceInput)
			.setName(Messages.link_text_input_name())
			.setDesc(Messages.link_text_input_description())
			.addText((text) => {
				text.setPlaceholder(Messages.link_text_input_placeholder());
				text.setValue(reference);
				text.inputEl.addEventListener('input', () => this.updateCreateButtonState());
			});

		const removeButton = tupleContainer.createEl('button', {
			text: Messages.delete(),
			cls: 'logos-link-tuple__remove-button',
		});
		setIcon(removeButton, 'trash-2');

		removeButton.onclick = () => {
			tupleContainer.remove();
			this.manualTuples = this.manualTuples.filter((t) => t.container !== tupleContainer);
			this.updateCreateButtonState();
		};

		this.manualTuples.push({
			displayTextInput: displayTextInput.querySelector('input') as HTMLInputElement,
			referenceInput: referenceInput.querySelector('input') as HTMLInputElement,
			container: tupleContainer,
		});
	}

	private updateCreateButtonState() {
		const createButton = this.contentEl.querySelector('.logos-link-modal__create-button',
		) as HTMLButtonElement;
		if (createButton) {
			const validationResult = this.validate();
			createButton.disabled = !validationResult.valid;
		}
	}

	private validate(): { valid: true; message?: never } | { valid: false; message: string } {
		if (this.modeToggle === 'auto') {
			if (this.autoDisplayTextInput && this.autoReferenceInput) {
				const parsedReferences = parseBibleReferences(
					this.autoDisplayTextInput.value,
					this.enabledLanguages,
				);
				const valid = parsedReferences.length > 0;
				setInputValidationState(this.autoDisplayTextInput, valid);
				return valid
					? { valid }
					: { valid, message: Messages.passage_not_formatted_correctly() };
			}
			return { valid: true };
		} else {
			if (this.manualTuples.length > 0) {
				let valid = true;
				for (const tuple of this.manualTuples) {
					const displayTextInputValid = tuple.displayTextInput.value.trim().length > 0;
					const referenceInputValid = tuple.referenceInput.value.trim().length > 0;
					setInputValidationState(tuple.displayTextInput, displayTextInputValid);
					setInputValidationState(tuple.referenceInput, referenceInputValid);

					if (valid && !(displayTextInputValid && referenceInputValid)) {
						valid = false;
					}
				}
				return valid
					? { valid }
					: { valid, message: Messages.all_input_fields_must_have_a_value() };
			} else {
				return { valid: false, message: Messages.links_empty() };
			}
		}
	}

	private createLinks(): LogosLink[] {
		if (this.modeToggle === 'auto') {
			if (this.autoDisplayTextInput) {
				return parseBibleReferences(
					this.autoDisplayTextInput.value.trim(),
					this.enabledLanguages,
				).map<LogosLink>((ref) => ({
					displayText: ref.displayText || formatBibleReferenceForLogos(ref),
					linkPassage: formatBibleReferenceForLogos(ref),
				}));
			}
		} else {
			return this.manualTuples
				.map((t) => ({
					displayText: t.displayTextInput.value.trim(),
					linkPassage: t.referenceInput.value.trim(),
				}))
				.filter((t) => t.displayText && t.linkPassage);
		}
		return [];
	}

	private onClickCreate() {
		const links = this.createLinks();
		if (links.length > 0) {
			this.onSubmit(links);
			this.close();
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
		this.manualTuples = [];
		this.autoDisplayTextInput = null;
		this.autoReferenceInput = null;
		this.manualTuplesContainer = null;
	}
}

const setInputValidationState = (input: HTMLInputElement, valid: boolean) => {
	if (valid) {
		input.classList.remove(INPUT_INVALID_CLASS);
	} else {
		input.classList.add(INPUT_INVALID_CLASS);
	}
};
