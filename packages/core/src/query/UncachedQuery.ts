import { registerComponent } from '../component/Component';
import { $componentToInstance } from '../component/symbols';
import { Component, ComponentInstance } from '../component/types';
import { Prefab } from '../prefab/Prefab';
import { World } from '../world/types';
import { $hashToUncachedQuery, $modifier } from './symbols';
import { QueryModifierTuple, UncachedQueryData } from './types';
import { archetypeHash } from './utils';

const reduceBitflags = (a: Record<number, number>, c: ComponentInstance) => {
	if (!a[c.generationId]) a[c.generationId] = 0;
	a[c.generationId] |= c.bitflag;
	return a;
};

export const createUncachedQueryData = (
	world: World,
	queryComponents: (Component | QueryModifierTuple)[]
): UncachedQueryData => {
	const components: Component[] = [];
	const notComponents: Component[] = [];

	let queriesPrefab = false;
	for (const queryComponent of queryComponents) {
		if ($modifier in queryComponent) {
			const comp = queryComponent[0];
			const mod = queryComponent[1];
			if (!world[$componentToInstance].has(comp)) registerComponent(world, comp);
			if (mod === 'not') {
				notComponents.push(comp);
			}
		} else {
			if (!world[$componentToInstance].has(queryComponent))
				registerComponent(world, queryComponent);
			components.push(queryComponent);
		}

		if (queryComponent === Prefab) queriesPrefab = true;
	}

	const mapComponents = (c: Component) => world[$componentToInstance].get(c)!;
	const instances = components.concat(notComponents).map(mapComponents);

	const generations = instances
		.map((c) => c.generationId)
		.reduce((a, v) => {
			if (a.includes(v)) return a;
			a.push(v);
			return a;
		}, [] as number[]);

	const masks = components.map(mapComponents).reduce(reduceBitflags, {});
	const notMasks = notComponents.map(mapComponents).reduce(reduceBitflags, {});
	const hasMasks = instances.reduce(reduceBitflags, {});

	return {
		generations,
		masks,
		notMasks,
		hasMasks,
		instances,
		queriesPrefab,
	};
};

export const getUncachedQueryData = (
	world: World,
	components: (Component | QueryModifierTuple)[]
) => {
	const hash = archetypeHash(world, components);

	let queryData: UncachedQueryData;
	if (world[$hashToUncachedQuery].has(hash)) {
		queryData = world[$hashToUncachedQuery].get(hash)!;
	} else {
		queryData = createUncachedQueryData(world, components);
		world[$hashToUncachedQuery].set(hash, queryData);
	}

	return queryData;
};
