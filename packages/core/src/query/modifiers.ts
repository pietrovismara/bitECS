import { Component } from '../component/types';
import { $modifier } from './symbols';
import { QueryModifierTuple } from './types';

export function modifier(c: Component, mod: string): QueryModifierTuple {
	const inner = [c, mod] as unknown as QueryModifierTuple;
	inner[$modifier] = true;
	return inner;
}

export const Not = (c: Component) => modifier(c, 'not');
