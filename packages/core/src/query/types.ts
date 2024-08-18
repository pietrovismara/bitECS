import { Component, ComponentInstance } from '../component/types';
import { SparseSet } from '../utils/SparseSet';
import { World } from '../world/types';
import { $modifier, $queryComponents, $queueRegisters } from './symbols';

export type QueryModifierTuple = readonly [Component, string] & { [$modifier]: boolean };

export type QueryModifier = (c: Component[]) => () => QueryModifierTuple;

export type QueryResult = readonly number[];

export type Query = (<W extends World = World>(world: W) => QueryResult) & {
	[$queryComponents]: (Component | QueryModifierTuple)[];
	[$queueRegisters]: ((world: World) => void)[];
};

export type UncachedQueryData = {
	generations: number[];
	masks: Record<number, number>;
	notMasks: Record<number, number>;
	hasMasks: Record<number, number>;
	instances: ComponentInstance[];
	queriesPrefab: boolean;
};

export type QueryData = ReturnType<typeof SparseSet> & {
	toRemove: ReturnType<typeof SparseSet>;
	enterQueues: ReturnType<typeof SparseSet>[];
	exitQueues: ReturnType<typeof SparseSet>[];
	query: Query;
} & UncachedQueryData;

export type UncachedQuery = (<W extends World = World>(world: W) => QueryResult) & {
	[$queryComponents]: (Component | QueryModifier)[];
};

export type Queue<W extends World = World> = (world: W, drain?: boolean) => readonly number[];
