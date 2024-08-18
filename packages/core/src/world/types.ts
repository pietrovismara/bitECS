import { $componentCount, $componentToInstance } from '../component/symbols';
import { Component, ComponentInstance } from '../component/types';
import { $entityArray, $entityComponents, $entityMasks, $entitySparseSet } from '../entity/symbols';
import { PrefabNode } from '../prefab/types';
import {
	$dirtyQueries,
	$hashToUncachedQuery,
	$notQueries,
	$queries,
	$queriesHashMap,
	$queryDataMap,
} from '../query/symbols';
import { Query, QueryData, UncachedQueryData } from '../query/types';
import { $relationTargetEntities } from '../relation/symbols';
import { RelationTarget } from '../relation/types';
import { SparseSet } from '../utils/SparseSet';
import {
	$bitflag,
	$eidToPrefab,
	$entityCursor,
	$localEntities,
	$localEntityLookup,
	$recycled,
	$removed,
	$removedOut,
} from './symbols';

export interface World {
	[$entityArray]: number[];
	[$entityMasks]: Array<number>[];
	[$entityComponents]: Map<number, Set<Component>>;
	[$entitySparseSet]: ReturnType<typeof SparseSet>;
	[$bitflag]: number;
	[$componentToInstance]: Map<Component, ComponentInstance>;
	[$componentCount]: number;
	[$hashToUncachedQuery]: Map<string, UncachedQueryData>;
	[$queryDataMap]: Map<Query, QueryData>;
	[$queries]: Set<QueryData>;
	[$queriesHashMap]: Map<string, QueryData>;
	[$notQueries]: Set<any>;
	[$dirtyQueries]: Set<any>;
	[$localEntities]: Map<any, any>;
	[$localEntityLookup]: Map<any, any>;
	[$relationTargetEntities]: Set<RelationTarget>;
	[$recycled]: number[];
	[$removed]: number[];
	[$removedOut]: number[];
	[$entityCursor]: number;
	[$eidToPrefab]: Map<number, PrefabNode>;
}

export type IWorld = World;
