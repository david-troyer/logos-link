import React, { useEffect, useRef } from 'react';
import { setIcon } from 'obsidian';

export type IconButtonProps = {
	iconName: string;
	onClick: () => void;
	className?: string;
};

export const IconButton = (props: IconButtonProps) => {
	const { iconName, onClick, className } = props;
	const ref = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (ref.current) {
			setIcon(ref.current, iconName);
		}
	}, [iconName]);

	return <button ref={ref} className={className} onClick={onClick}></button>;
};
