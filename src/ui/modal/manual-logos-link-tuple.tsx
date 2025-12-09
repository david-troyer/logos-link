import { SettingInput } from '../settings-input';
import { Messages } from '../../messages/messages';
import { IconButton } from '../icon-button';
import React from 'react';
import { ManualTuple } from '../bible-link-modal-react';

interface ManualLogosLinkTupleProps {
	tuple: ManualTuple;
	onUpdate: (id: string, field: keyof ManualTuple, value: string) => void;
	onRemove: (id: string) => void;
}

export const ManualLogosLinkTuple = ({ tuple, onUpdate, onRemove }: ManualLogosLinkTupleProps) => (
	<div className="logos-link-tuple">
		<SettingInput
			name={Messages.passage_input_manual_name()}
			value={tuple.displayText}
			placeholder=""
			onChange={(value) => onUpdate(tuple.id, 'displayText', value)}
			className="logos-link-tuple__display-text-input"
			invalid={tuple.displayText.trim().length === 0}
		/>
		<SettingInput
			name={Messages.link_text_input_name()}
			desc={Messages.link_text_input_description()}
			value={tuple.reference}
			placeholder={Messages.link_text_input_placeholder()}
			onChange={(value) => onUpdate(tuple.id, 'reference', value)}
			className="logos-link-tuple__reference-input"
			invalid={tuple.reference.trim().length === 0}
		/>
		<IconButton
			iconName="tash-2"
			className="logos-link-tuple__remove-button"
			onClick={() => onRemove(tuple.id)}
		/>
	</div>
);
