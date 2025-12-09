import React, { useEffect, useRef } from 'react';
import { Setting } from 'obsidian';
import { clsx, isDefined } from './utils';

export type SettingInputProps = {
	name: string;
	desc?: string;
	value: string;
	placeholder: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	readOnly?: boolean;
	className?: string;
	invalid?: boolean;
};

const INPUT_INVALID_CLASS = 'input-error';

export const SettingInput = (props: SettingInputProps) => {
	const {
		name,
		desc,
		value,
		placeholder,
		onChange,
		disabled,
		readOnly,
		className,
		invalid = false,
	} = props;

	const containerRef = useRef<HTMLDivElement>(null);
	const settingRef = useRef<Setting | null>(null);

	useEffect(() => {
		if (containerRef.current && !settingRef.current) {
			const setting = new Setting(containerRef.current).setName(name);
			if (desc) {
				setting.setDesc(desc);
			}
			setting.addText((text) => {
				const input = text.inputEl;
				input.value = value;
				input.placeholder = placeholder;
				if (disabled !== undefined) input.disabled = disabled;
				if (readOnly !== undefined) input.readOnly = readOnly;
				input.oninput = (e) => {
					onChange((e.target as HTMLInputElement).value);
				};
			});
			settingRef.current = setting;
		}
	}, [name, desc, placeholder, disabled, readOnly, onChange]);

	// Update input value when it changes
	useEffect(() => {
		if (containerRef.current && settingRef.current) {
			const input = containerRef.current.querySelector('input') as HTMLInputElement;
			if (input && input.value !== value) {
				input.value = value;
			}
		}
	}, [value]);

	// Update disabled state
	useEffect(() => {
		if (containerRef.current) {
			const input = containerRef.current.querySelector('input') as HTMLInputElement;
			if (isDefined(input) && isDefined(disabled)) {
				input.disabled = disabled;
			}
		}
	}, [disabled]);

	// Update readonly state
	useEffect(() => {
		if (containerRef.current) {
			const input = containerRef.current.querySelector('input') as HTMLInputElement;
			if (isDefined(input) && isDefined(readOnly)) {
				input.readOnly = readOnly;
			}
		}
	}, [disabled]);

	return (
		<div
			ref={containerRef}
			className={clsx(className, invalid ? INPUT_INVALID_CLASS : undefined)}
		/>
	);
};
