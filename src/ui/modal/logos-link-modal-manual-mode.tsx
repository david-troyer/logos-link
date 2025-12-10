import React from 'react';
import { ManualLogosLinkTuple } from './manual-logos-link-tuple';
import { Messages } from '../../messages/messages';
import { ManualTuple } from './bible-link-modal-react';

export type LogosLinkModalManualModeProps = {
	manualTuples: ManualTuple[];
	onUpdate: (id: string, field: keyof ManualTuple, value: string) => void;
	onCreate: () => void;
	onDelete: (id: string) => void;
};

export const LogosLinkModalManualMode = (props: LogosLinkModalManualModeProps) => {
	const {
		manualTuples,
		onUpdate: handleUpdate,
		onCreate: handleCreate,
		onDelete: handleDelete,
	} = props;

	return (
		<div className="logos-link-modal__manual-mode">
			<div className="logos-link-tuples-container">
				{manualTuples.map((tuple) => (
					<ManualLogosLinkTuple
						key={tuple.id}
						tuple={tuple}
						onUpdate={handleUpdate}
						onRemove={handleDelete}
					/>
				))}
			</div>
			<button
				className="logos-link-tuple__add-button"
				onClick={handleCreate}
			>
				+ {Messages.add_button_text()}
			</button>
		</div>
	);
};
