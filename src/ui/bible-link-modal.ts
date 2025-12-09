import { App, Modal } from 'obsidian';
import { AvailableLanguage } from '../data/bible-structure';
import { Messages } from '../messages/messages';
import { BibleLinkModalComponent, type LogosLink } from './bible-link-modal-react';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';

export type { LogosLink };

export class BibleLinkModal extends Modal {
	private reactRoot: Root | null = null;

	constructor(
		app: App,
		private initialText: string = '',
		private enabledLanguages: AvailableLanguage[],
		private onSubmit: (links: LogosLink[]) => void,
	) {
		super(app);
		this.setTitle(Messages.create_logos_link());
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass('logos-link-modal');

		// Create a container for React
		const reactContainer = contentEl.createDiv();
		this.reactRoot = createRoot(reactContainer);
		this.reactRoot.render(
			React.createElement(BibleLinkModalComponent, {
				initialText: this.initialText,
				enabledLanguages: this.enabledLanguages,
				onSubmit: (links: LogosLink[]) => {
					this.onSubmit(links);
					this.close();
				},
				onCancel: () => {
					this.close();
				},
			}),
		);
	}

	onClose() {
		const { contentEl } = this;
		// Unmount React component
		if (this.reactRoot) {
			this.reactRoot.unmount();
			this.reactRoot = null;
		}
		contentEl.empty();
	}
}
