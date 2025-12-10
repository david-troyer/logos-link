import React, { ReactNode } from 'react';
import { toArray } from '../utils';

export type ButtonGroupInternalProps = {
	value: string;
	onChange: (value: string) => void;
	children: ReactNode;
};

const ButtonGroupInternal = (props: ButtonGroupInternalProps) => {
	const { value, onChange, children } = props;

	const options = toArray(children)
		.filter(React.isValidElement)
		.filter((c) => c.type === Item)
		.map((c) => c.props as ItemProps);

	return (
		<div className="logos-link-modal__mode-button-group">
			{options.map((option) => (
				<button
					key={option.value}
					onClick={() => onChange(option.value)}
					className={option.value === value ? 'mod-cta' : ''}
				>
					{option.children}
				</button>
			))}
		</div>
	);
};

type ItemProps = { children: ReactNode; value: string };
const Item = (props: ItemProps) => <>{props.children}</>;

export const ButtonGroup = Object.assign(ButtonGroupInternal, { Item });
