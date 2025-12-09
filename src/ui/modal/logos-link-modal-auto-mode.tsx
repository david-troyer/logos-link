import { SettingInput } from '../settings-input';
import { Messages } from '../../messages/messages';
import React, { useMemo } from 'react';
import { formatBibleReferenceForLogos, parseBibleReferences } from '../../parsers/bible-parser';
import { AvailableLanguage } from '../../data/bible-structure';
import { isDefined } from '../utils';

export type LogosLinkModalAutoModeProps = {
	value: string;
	onChange: (value: string) => void;
	enabledLanguages: AvailableLanguage[];
};

export const LogosLinkModalAutoMode = (props: LogosLinkModalAutoModeProps) => {
	const { value, onChange, enabledLanguages } = props;

	const parsedValue = useMemo(() => {
		const parsed = parseBibleReferences(value.trim(), enabledLanguages);
		return parsed.length > 0 ? parsed.map(formatBibleReferenceForLogos).join('; ') : null;
	}, [value, enabledLanguages]);

	return (
		<div className="logos-link-modal__auto-mode">
			<SettingInput
				name={Messages.passage_input_auto_name()}
				value={value}
				placeholder={Messages.passage_input_auto_placeholder()}
				onChange={onChange}
				className="logos-link-modal__auto-display-input"
				invalid={!isDefined(parsedValue)}
			/>
			<SettingInput
				name={Messages.link_text_input_name()}
				desc={Messages.link_text_input_description()}
				value={parsedValue ?? ''}
				placeholder={Messages.passage_format_invalid()}
				onChange={() => {}}
				disabled={true}
				readOnly={true}
				className="logos-link-modal__auto-reference-input"
			/>
		</div>
	);
};
