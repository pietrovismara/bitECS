import { $onAdd, $onRemove, $onSet } from '../component/symbols';
import { Component } from '../component/types';
import { World } from '../world/types';
import { $children, $ancestors, $prefabComponents, $worldToEid } from './symbols';

export type PrefabNode<Params = void> = {
	[$prefabComponents]: Component[];
	[$worldToEid]: Map<World, number>;
	[$onSet]: (world: any, eid: number, params?: Params) => void;
	[$onAdd]: (world: any, eid: number) => void;
	[$onRemove]: (world: any, eid: number) => void;
	[$children]: PrefabNode<any>[];
	[$ancestors]: PrefabNode<any>[];
};
