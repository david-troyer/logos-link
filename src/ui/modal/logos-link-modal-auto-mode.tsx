import { SettingInput } from '../components/settings-input';
import { Messages } from '../../messages/messages';
import React, { useMemo } from 'react';
import {
	formatBibleReferenceForLogos,
	parseBibleLinkContext,
	parseBibleReferences,
} from '../../parsers/bible-parser';
import { AvailableLanguage } from '../../data/bible-structure';
import { isDefined } from '../utils';

export type LogosLinkModalAutoModeProps = {
	value: string;
	onChange: (value: string) => void;
	context: string;
	onContextChange?: (value: string) => void;
	enabledLanguages: AvailableLanguage[];
};

export const LogosLinkModalAutoMode = (props: LogosLinkModalAutoModeProps) => {
	const { value, onChange, context, onContextChange, enabledLanguages } = props;

	const parsedContext = useMemo(
		() => parseBibleLinkContext(context, enabledLanguages),
		[context, enabledLanguages],
	);

	const parsedValue = useMemo(() => {
		const parsed = parseBibleReferences(value.trim(), enabledLanguages, parsedContext);
		return parsed.length > 0 ? parsed.map(formatBibleReferenceForLogos).join('; ') : null;
	}, [value, enabledLanguages, parsedContext]);

	return (
		<div className="logos-link-modal__auto-mode">
			<SettingInput
				name={Messages.display_text()}
				value={value}
				onChange={onChange}
				placeholder={Messages.passage_input_auto_placeholder()}
				className="logos-link-modal__auto-display-input"
				invalid={!isDefined(parsedValue)}
			/>
			<SettingInput
				name={Messages.context_input_name()}
				value={context}
				onChange={onContextChange}
				description={Messages.context_input_description()}
				placeholder={Messages.context_input_placeholder()}
				invalid={context.length > 0 && parsedContext === null}
			/>
			<SettingInput
				name={Messages.link_text_input_name()}
				value={parsedValue ?? ''}
				description={Messages.link_text_input_description()}
				placeholder={Messages.passage_format_invalid()}
				disabled={true}
				readOnly={true}
				className="logos-link-modal__auto-reference-input"
			/>
		</div>
	);
};
