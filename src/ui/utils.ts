export const isDefined = <T>(value: T): value is Exclude<T, undefined | null> =>
	value !== undefined && value !== null;

export const clsx = (...classes: (string | null | undefined)[]): string =>
	classes.filter(isDefined).join(' ');

export const toArray = <T>(items: T | T[]): T[] => (Array.isArray(items) ? items : [items]);
