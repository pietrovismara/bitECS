import { Component } from './types';

export function withParams<C extends Component>(
	component: C,
	params: C extends Component<any, infer Params> ? Params : never
): [C, C extends Component<any, infer Params> ? Params : never] {
	return [component, params];
}
