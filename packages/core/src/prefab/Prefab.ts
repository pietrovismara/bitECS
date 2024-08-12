import { $onAdd, $onRemove } from '../component/symbols';
import { Component, ComponentOrWithParams } from '../component/types';
import { addEntity } from '../entity/Entity';
import { ChildOf, IsA } from '../relation/Relation';
import { $isPairComponent, $pairTarget, $relation } from '../relation/symbols';
import { defineHiddenProperties, defineHiddenProperty } from '../utils/defineHiddenProperty';
import { $eidToPrefab } from '../world/symbols';
import { World } from '../world/types';
import { $ancestors, $children, $prefabComponents, $worldToEid } from './symbols';
import { PrefabNode } from './types';

export const Prefab = {};

/**
 * Defines a prefab, a reusable collection of components that can be added to an entity, with optional components, set/reset callbacks, and reference object.
 *
 * @param definition - Optional object containing prefab definition.
 * @param definition.components - Array of components or components with parameters.
 * @param definition.ref - Reference object to be used as the prefab node.
 * @returns The created prefab node.
 */
export const definePrefab = <Ref extends {} = {}>(definition?: {
	components?: ComponentOrWithParams[];
	onAdd?: (world: World, eid: number) => void;
	onRemove?: (world: World, eid: number) => void;
	ref?: Ref;
}) => {
	const prefab = (definition?.ref ?? {}) as PrefabNode;

	const prefabs: PrefabNode[] = [];
	const components: ComponentOrWithParams[] = [];

	if (definition?.components) {
		for (const c of definition?.components) {
			let component: Component;
			let params: any;

			if (Array.isArray(c)) {
				component = c[0];
				params = c[1];
			} else {
				component = c;
			}

			if (component[$isPairComponent]) {
				const relation = component[$relation]!;

				if (relation === IsA) {
					const target = component[$pairTarget] as PrefabNode;
					prefabs.push(target);
				} else if (relation === ChildOf) {
					const target = component[$pairTarget] as PrefabNode;
					if (typeof target === 'object' && $worldToEid in target) {
						target[$children].push(prefab);
					}
				}
			} else {
				components.push(c);
			}
		}
	}

	if (definition?.onAdd) defineHiddenProperty(prefab, $onAdd, definition.onAdd);
	if (definition?.onRemove) defineHiddenProperty(prefab, $onRemove, definition.onRemove);

	const ancestors = [] as PrefabNode[];
	for (const p of prefabs) {
		ancestors.push(...p[$ancestors]);
	}

	ancestors.push(prefab);

	defineHiddenProperties(prefab, {
		[$prefabComponents]: components,
		[$worldToEid]: new Map(),
		[$ancestors]: ancestors,
		[$children]: [],
	});

	return prefab as PrefabNode;
};

/**
 * Registers a prefab in the specified world and returns its entity ID (EID).
 *
 * If the prefab has already been registered in the world, this function will return the existing EID.
 * Otherwise, it will create a new prefab entity in the world with the prefab's components and return the new EID.
 *
 * @param world - The world to register the prefab in.
 * @param prefab - The prefab to register.
 * @returns The entity ID (EID) of the registered prefab in the specified world.
 */
export const registerPrefab = (world: World, prefab: PrefabNode) => {
	if (prefab[$worldToEid].has(world)) {
		return prefab[$worldToEid].get(world)!;
	}

	const eid = addEntity(world, Prefab, ...prefab[$prefabComponents]);

	prefab[$worldToEid].set(world, eid);
	world[$eidToPrefab].set(eid, prefab);

	return eid;
};

/**
 * Gets the entity ID (EID) for the given prefab in the specified world.
 *
 * @param world - The world to get the prefab EID from.
 * @param prefab - The prefab to get the EID for.
 * @returns The entity ID for the given prefab in the specified world.
 */
export const getPrefabEid = (world: World, prefab: PrefabNode) => prefab[$worldToEid].get(world);

/**
 * Gets the prefab matching this entity ID.
 *
 * @param world - The world to get the prefab EID from.
 * @param prefab - The prefab to get the EID for.
 * @returns The entity ID for the given prefab in the specified world.
 */
export const getPrefab = (world: World, eid: number) => world[$eidToPrefab].get(eid);
