import { App, PluginSettingTab, Setting } from 'obsidian';
import LogosLinkPlugin from '../../main';
import { AVAILABLE_LANGUAGES, AvailableLanguage } from '../data/bible-structure';
import { Messages } from '../messages/messages';

export interface LogosLinkSettings {
	enabledLanguages: AvailableLanguage[];
}

export const DEFAULT_SETTINGS: LogosLinkSettings = {
	enabledLanguages: ['en', 'de'],
};

export class LogosLinkSettingTab extends PluginSettingTab {
	plugin: LogosLinkPlugin;

	constructor(app: App, plugin: LogosLinkPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		new Setting(containerEl)
			.setName(Messages.settings_headline())
			.setDesc(Messages.settings_choose_languages_text())
			.setHeading()


		// Create checkboxes for each available language
		AVAILABLE_LANGUAGES.forEach((lang) => {
			new Setting(containerEl).setName(lang.name).addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.enabledLanguages.includes(lang.code))
					.onChange(async (value) => {
						if (value) {
							// Add language if not already present
							if (!this.plugin.settings.enabledLanguages.includes(lang.code)) {
								this.plugin.settings.enabledLanguages.push(lang.code);
							}
						} else {
							// Remove language
							this.plugin.settings.enabledLanguages =
								this.plugin.settings.enabledLanguages.filter(
									(code) => code !== lang.code,
								);
						}

						// Ensure at least one language is selected
						if (this.plugin.settings.enabledLanguages.length === 0) {
							this.plugin.settings.enabledLanguages.push(lang.code);
							toggle.setValue(true);
						}

						await this.plugin.saveSettings();
					});
			});
		});
	}
}
