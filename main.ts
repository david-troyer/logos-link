import { Editor, Plugin } from 'obsidian';
import { BibleLinkModal, LogosLink } from './src/ui/bible-link-modal';
import { DEFAULT_SETTINGS, LogosLinkSettings, LogosLinkSettingTab } from './src/ui/settings';
import { Messages } from './src/messages/messages';
import { logosLinksToMarkdown } from './src/parsers/bible-reference-markdown-utils';

export default class LogosLinkPlugin extends Plugin {
	settings: LogosLinkSettings;

	async onload() {
		await this.loadSettings();

		// add a settings tab to set up the plugin
		this.addSettingTab(new LogosLinkSettingTab(this.app, this));

		// add command for command palette
		this.addCommand({
			id: 'create-logos-link',
			name: 'Create Logos-Link',
			icon: 'link-2',
			editorCallback: (editor: Editor) => {
				const selectedText = editor.getSelection();
				this.openBibleLinkModal(editor, selectedText);
			},
		});

		// register context-menu for editor
		this.registerEvent(
			this.app.workspace.on('editor-menu', (menu, editor) => {
				const selectedText = editor.getSelection();
				menu.addItem((item) => {
					item.setTitle(
						selectedText ? Messages.link_with_logos() : Messages.create_logos_link(),
					);
					item.setIcon('link-2');
					item.onClick(() => this.openBibleLinkModal(editor, selectedText));
				});
			}),
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private openBibleLinkModal(editor: Editor, selectedText: string) {
		const enabledLanguages = this.settings.enabledLanguages;

		const modal = new BibleLinkModal(
			this.app,
			selectedText,
			enabledLanguages.length > 0 ? enabledLanguages : ['en'],
			(links: LogosLink[]) => this.insertBibleLinks(editor, links),
		);
		modal.open();
	}

	private insertBibleLinks(editor: Editor, links: LogosLink[]) {
		editor.replaceSelection(logosLinksToMarkdown(links));
	}
}
