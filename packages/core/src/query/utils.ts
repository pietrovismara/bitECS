import { registerComponent } from '../component/Component';
import { $componentToInstance } from '../component/symbols';
import { Component } from '../component/types';
import { TODO } from '../utils/types';
import { World } from '../world/types';
import { $modifier } from './symbols';
import { QueryModifier } from './types';

export const archetypeHash = (world: World, components: (Component | QueryModifier)[]) => {
	return components
		.sort((a: TODO, b: TODO) => {
			if (typeof a === 'function' && a[$modifier]) {
				a = a()[0];
			}
			if (typeof b === 'function' && b[$modifier]) {
				b = b()[0];
			}
			if (!world[$componentToInstance].has(a)) registerComponent(world, a);
			if (!world[$componentToInstance].has(b)) registerComponent(world, b);
			const aData = world[$componentToInstance].get(a)!;
			const bData = world[$componentToInstance].get(b)!;
			return aData.id > bData.id ? 1 : -1;
		})
		.reduce((acc, component: TODO) => {
			let mod;
			if (typeof component === 'function' && component[$modifier]) {
				mod = component()[1];
				component = component()[0];
			}
			if (!world[$componentToInstance].has(component)) registerComponent(world, component);
			const componentData = world[$componentToInstance].get(component)!;
			if (mod) {
				acc += `-${mod}(${componentData.id})`;
			} else {
				acc += `-${componentData.id}`;
			}
			return acc;
		}, '');
};
