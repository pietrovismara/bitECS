import { $onAdd, $onRemove } from '../component/symbols';
import { Component } from '../component/types';
import { World } from '../world/types';
import { $children, $ancestors, $prefabComponents, $worldToEid } from './symbols';

export type PrefabNode = {
	[$prefabComponents]: Component[];
	[$worldToEid]: Map<World, number>;
	[$onAdd]: (world: any, eid: number) => void;
	[$onRemove]: (world: any, eid: number) => void;
	[$children]: PrefabNode[];
	[$ancestors]: PrefabNode[];
};
