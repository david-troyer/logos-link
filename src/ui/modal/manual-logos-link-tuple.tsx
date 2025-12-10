import { SettingInput } from '../components/settings-input';
import { Messages } from '../../messages/messages';
import { IconButton } from '../components/icon-button';
import React from 'react';
import { ManualTuple } from './bible-link-modal-react';

interface ManualLogosLinkTupleProps {
	tuple: ManualTuple;
	onUpdate: (id: string, field: keyof ManualTuple, value: string) => void;
	onRemove: (id: string) => void;
}

export const ManualLogosLinkTuple = ({ tuple, onUpdate, onRemove }: ManualLogosLinkTupleProps) => (
	<div className="logos-link-tuple">
		<SettingInput
			name={Messages.display_text()}
			value={tuple.displayText}
			onChange={(value) => onUpdate(tuple.id, 'displayText', value)}
			className="logos-link-tuple__display-text-input"
			invalid={tuple.displayText.trim().length === 0}
		/>
		<SettingInput
			name={Messages.link_text_input_name()}
			value={tuple.reference}
			onChange={(value) => onUpdate(tuple.id, 'reference', value)}
			description={Messages.link_text_input_description()}
			placeholder={Messages.link_text_input_placeholder()}
			className="logos-link-tuple__reference-input"
			invalid={tuple.reference.trim().length === 0}
		/>
		<IconButton
			iconName="trash-2"
			className="logos-link-tuple__remove-button"
			onClick={() => onRemove(tuple.id)}
		/>
	</div>
);
