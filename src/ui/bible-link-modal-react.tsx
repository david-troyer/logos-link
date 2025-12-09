import React, { useCallback, useState } from 'react';
import { formatBibleReferenceForLogos, parseBibleReferences } from '../parsers/bible-parser';
import { AvailableLanguage } from '../data/bible-structure';
import { Messages } from '../messages/messages';
import { LogosLinkModalManualMode } from './modal/logos-link-modal-manual-mode';
import { LogosLinkModalAutoMode } from './modal/logos-link-modal-auto-mode';
import { ButtonGroup } from './button-group';

export interface LogosLink {
	displayText: string;
	linkPassage: string;
}

export interface ManualTuple {
	id: string;
	displayText: string;
	reference: string;
}

interface BibleLinkModalProps {
	initialText: string;
	enabledLanguages: AvailableLanguage[];
	onSubmit: (links: LogosLink[]) => void;
	onCancel: () => void;
}

export const BibleLinkModalComponent = (props: BibleLinkModalProps) => {
	const { initialText, enabledLanguages, onSubmit, onCancel } = props;

	const [mode, setMode] = useState<'auto' | 'manual'>('auto');
	const [autoDisplayText, setAutoDisplayText] = useState(initialText);
	const {
		manualTuples,
		setManualTuples,
		addEmptyManualTuple,
		updateManualTuple,
		deleteManualTuple,
	} = useManualTupleList();

	const validationState =
		mode === 'auto' ? validateAuto(autoDisplayText, enabledLanguages) : validateManual(manualTuples);

	const handleModeChange = useCallback(
		(newMode: 'auto' | 'manual') => {
			setMode((previousMode) => {
				if (previousMode === 'auto' && newMode === 'manual') {
					const parsed = parseBibleReferences(autoDisplayText, enabledLanguages);
					if (parsed.length > 0) {
						setManualTuples(
							parsed.map((ref) =>
								createTuple(ref.displayText, formatBibleReferenceForLogos(ref)),
							),
						);
					} else {
						setManualTuples([createTuple('', '')]);
					}
				}
				return newMode;
			});
		},
		[mode, autoDisplayText, enabledLanguages],
	);

	const handleCreate = useCallback(() => {
		if (validationState.valid && validationState.links.length > 0) {
			onSubmit(validationState.links);
		}
	}, [mode, autoDisplayText, manualTuples, validationState, enabledLanguages, onSubmit]);

	return (
		<div className="logos-link-modal">
			<ButtonGroup value={mode} onChange={handleModeChange}>
				<ButtonGroup.Item value="auto">{Messages.auto_mode()}</ButtonGroup.Item>
				<ButtonGroup.Item value="manual">{Messages.manual_mode()}</ButtonGroup.Item>
			</ButtonGroup>

			<div className="logos-link-modal__content">
				{mode === 'auto' ? (
					<LogosLinkModalAutoMode
						value={autoDisplayText}
						onChange={setAutoDisplayText}
						enabledLanguages={enabledLanguages}
					/>
				) : (
					<LogosLinkModalManualMode
						manualTuples={manualTuples}
						onUpdate={updateManualTuple}
						onCreate={addEmptyManualTuple}
						onDelete={deleteManualTuple}
					/>
				)}
			</div>

			<div className="logos-link-modal__button-container">
				<button onClick={onCancel}>{Messages.cancel()}</button>
				<button
					className="logos-link-modal__create-button mod-cta"
					disabled={!validationState.valid}
					onClick={handleCreate}
				>
					{Messages.create_link()}
				</button>
			</div>
		</div>
	);
};

export type ValidationResult =
	| { valid: true; links: LogosLink[] }
	| { valid: false; message: string };

const validateAuto = (value: string, enabledLanguage: AvailableLanguage[]): ValidationResult => {
	const parsed = parseBibleReferences(value, enabledLanguage);
	if (parsed.length > 0) {
		return {
			valid: true,
			links: parsed.map<LogosLink>((ref) => ({
				displayText: ref.displayText,
				linkPassage: formatBibleReferenceForLogos(ref),
			})),
		};
	} else {
		return { valid: false, message: Messages.passage_not_formatted_correctly() };
	}
};

const validateManual = (tuples: ManualTuple[]): ValidationResult => {
	if (tuples.length === 0) {
		return { valid: false, message: Messages.links_empty() };
	}

	for (const tuple of tuples) {
		if (tuple.displayText.trim().length === 0 || tuple.reference.trim().length === 0) {
			return { valid: false, message: Messages.all_input_fields_must_have_a_value() };
		}
	}

	return {
		valid: true,
		links: tuples.map<LogosLink>((t) => ({
			displayText: t.displayText,
			linkPassage: t.reference.trim(),
		})),
	};
};

const createTuple = (displayText: string, reference: string): ManualTuple => ({
	id: Math.random().toString(36).substring(7),
	displayText,
	reference,
});

const useManualTupleList = () => {
	const [manualTuples, setManualTuples] = useState<ManualTuple[]>([]);

	const addEmptyManualTuple = useCallback(() => {
		setManualTuples((prev) => [...prev, createTuple('', '')]);
	}, []);

	const updateManualTuple = useCallback((id: string, field: keyof ManualTuple, value: string) => {
		setManualTuples((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
	}, []);

	const deleteManualTuple = useCallback((id: string) => {
		setManualTuples((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return {
		manualTuples,
		addEmptyManualTuple,
		deleteManualTuple,
		updateManualTuple,
		setManualTuples,
	};
};
