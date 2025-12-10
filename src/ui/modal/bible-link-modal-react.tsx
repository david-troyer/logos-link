import React, { useCallback, useState } from 'react';
import {
	formatBibleReferenceForLogos,
	parseBibleLinkContext,
	parseBibleReferences,
} from '../../parsers/bible-parser';
import { AvailableLanguage } from '../../data/bible-structure';
import { Messages } from '../../messages/messages';
import { LogosLinkModalManualMode } from './logos-link-modal-manual-mode';
import { LogosLinkModalAutoMode } from './logos-link-modal-auto-mode';
import { ButtonGroup } from '../components/button-group';

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
	context?: string;
	onContextChanged?: (value: string) => void;
	enabledLanguages: AvailableLanguage[];
	onSubmit: (links: LogosLink[]) => void;
	onCancel: () => void;
}

export const BibleLinkModalComponent = (props: BibleLinkModalProps) => {
	const {
		initialText,
		context: providedContext,
		onContextChanged: reportContextChanged,
		enabledLanguages,
		onSubmit,
		onCancel,
	} = props;

	const [mode, setMode] = useState<'auto' | 'manual'>('auto');
	const [autoDisplayText, setAutoDisplayText] = useState(initialText);
	const [linkContextValue, setLocalLinkContextValue] = useState(providedContext ?? '');

	const setLinkContextValue = useCallback((value: string) => {
		setLocalLinkContextValue(value);
		if (reportContextChanged) {
			reportContextChanged(value);
		}
	}, [reportContextChanged]);

	const {
		manualTuples,
		setManualTuples,
		addEmptyManualTuple,
		updateManualTuple,
		deleteManualTuple,
	} = useManualTupleList();

	const validationState =
		mode === 'auto'
			? validateAuto(autoDisplayText, linkContextValue, enabledLanguages)
			: validateManual(manualTuples);

	const handleModeChange = useCallback(
		(newMode: 'auto' | 'manual') => {
			setMode((previousMode) => {
				if (previousMode === 'auto' && newMode === 'manual') {
					const validationResult = validateAuto(
						autoDisplayText,
						linkContextValue,
						enabledLanguages,
					);
					if (validationResult.valid && validationResult.links.length > 0) {
						setManualTuples(
							validationResult.links.map((ref) =>
								createTuple(ref.displayText, ref.linkPassage),
							),
						);
					} else {
						setManualTuples([createTuple(autoDisplayText, '')]);
					}
				}
				return newMode;
			});
		},
		[autoDisplayText, linkContextValue, enabledLanguages],
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
						context={linkContextValue}
						onContextChange={setLinkContextValue}
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

const validateAuto = (
	displayText: string,
	contextInput: string,
	enabledLanguages: AvailableLanguage[],
): ValidationResult => {
	const parsedContext = parseBibleLinkContext(contextInput, enabledLanguages);
	const parsed = parseBibleReferences(displayText, enabledLanguages, parsedContext);
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
