import { registerComponent } from '../component/Component';
import { $componentToInstance } from '../component/symbols';
import { Component } from '../component/types';
import { TODO } from '../utils/types';
import { World } from '../world/types';
import { $modifier } from './symbols';
import { QueryModifierTuple } from './types';

export const archetypeHash = (world: World, components: (Component | QueryModifierTuple)[]) => {
	return components
		.sort((a, b) => {
			if ($modifier in a) {
				a = a[0];
			}
			if ($modifier in b) {
				b = b[0];
			}
			if (!world[$componentToInstance].has(a)) registerComponent(world, a);
			if (!world[$componentToInstance].has(b)) registerComponent(world, b);
			const aData = world[$componentToInstance].get(a)!;
			const bData = world[$componentToInstance].get(b)!;
			return aData.id > bData.id ? 1 : -1;
		})
		.reduce((acc, c) => {
			let mod: string | null = null;
			let component: Component;
			if ($modifier in c) {
				mod = c[1];
				component = c[0];
			} else {
				component = c;
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
