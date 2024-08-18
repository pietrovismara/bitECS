declare const $componentToInstance: unique symbol;
declare const $componentCount: unique symbol;
declare const $onAdd: unique symbol;
declare const $onRemove: unique symbol;
declare const $onReset: unique symbol;
declare const $onSet: unique symbol;
declare const $onRegister: unique symbol;
declare const $createStore: unique symbol;

declare const SparseSet: () => {
    add: (val: number) => void;
    remove: (val: number) => void;
    has: (val: number) => boolean;
    sparse: number[];
    dense: number[];
    reset: () => void;
    sort: () => void;
};

declare const $modifier: unique symbol;
declare const $queries: unique symbol;
declare const $notQueries: unique symbol;
declare const $hashToUncachedQuery: unique symbol;
declare const $queriesHashMap: unique symbol;
declare const $querySparseSet: unique symbol;
declare const $queueRegisters: unique symbol;
declare const $queryDataMap: unique symbol;
declare const $dirtyQueries: unique symbol;
declare const $queryComponents: unique symbol;
declare const $enterQuery: unique symbol;
declare const $exitQuery: unique symbol;

type QueryModifierTuple = readonly [Component, string] & {
    [$modifier]: boolean;
};
type QueryModifier = (c: Component[]) => () => QueryModifierTuple;
type QueryResult = readonly number[];
type Query = (<W extends World = World>(world: W) => QueryResult) & {
    [$queryComponents]: (Component | QueryModifierTuple)[];
    [$queueRegisters]: ((world: World) => void)[];
};
type UncachedQueryData = {
    generations: number[];
    masks: Record<number, number>;
    notMasks: Record<number, number>;
    hasMasks: Record<number, number>;
    instances: ComponentInstance[];
    queriesPrefab: boolean;
};
type QueryData = ReturnType<typeof SparseSet> & {
    toRemove: ReturnType<typeof SparseSet>;
    enterQueues: ReturnType<typeof SparseSet>[];
    exitQueues: ReturnType<typeof SparseSet>[];
    query: Query;
} & UncachedQueryData;
type UncachedQuery = (<W extends World = World>(world: W) => QueryResult) & {
    [$queryComponents]: (Component | QueryModifier)[];
};
type Queue<W extends World = World> = (world: W, drain?: boolean) => readonly number[];

declare const $pairsMap: unique symbol;
declare const $isPairComponent: unique symbol;
declare const $relation: unique symbol;
declare const $pairTarget: unique symbol;
declare const $onTargetRemoved: unique symbol;
declare const $exclusiveRelation: unique symbol;
declare const $autoRemoveSubject: unique symbol;
declare const $relationTargetEntities: unique symbol;
declare const $component: unique symbol;

declare const $prefabComponents: unique symbol;
declare const $worldToEid: unique symbol;
declare const $children: unique symbol;
declare const $ancestors: unique symbol;

type PrefabNode<Params = void> = {
    [$prefabComponents]: Component[];
    [$worldToEid]: Map<World, number>;
    [$onSet]: (world: any, eid: number, params?: Params) => void;
    [$onAdd]: (world: any, eid: number) => void;
    [$onRemove]: (world: any, eid: number) => void;
    [$children]: PrefabNode<any>[];
    [$ancestors]: PrefabNode<any>[];
};

type RelationTarget = number | string | PrefabNode;
type RelationType<T> = T & {
    [$pairsMap]: Map<number | string, T>;
    [$component]: () => T;
    [$exclusiveRelation]: boolean;
    [$autoRemoveSubject]: boolean;
    [$onSet]: (world: World, eid: number, params: any) => void;
    [$onReset]: (world: World, eid: number) => void;
    [$onTargetRemoved]: (world: World, subject: number, target: number) => void;
} & ((target: RelationTarget) => T);
type RelationOptions = {
    exclusive: boolean;
    autoRemoveSubject: boolean;
};

type Component<Store = any, Params = any> = {
    name?: string;
    [$onSet]?: (world: any, store: Store, eid: number, params: Params) => void;
    [$onReset]?: (world: any, store: Store, eid: number) => void;
    [$onAdd]?: (world: any, eid: number) => void;
    [$onRemove]?: (world: any, eid: number) => void;
    [$onRegister]?: (world: any, store: Store) => void;
    [$createStore]?: () => Store;
    [$isPairComponent]?: boolean;
    [$relation]?: RelationType<Component<Store>>;
    [$pairTarget]?: RelationTarget;
};
interface ComponentInstance {
    id: number;
    generationId: number;
    bitflag: number;
    ref: Component;
    store: any;
    queries: Set<QueryData>;
    notQueries: Set<QueryData>;
}
type ComponentOrWithParams<C extends Component = Component> = C | [C, C extends Component<any, infer P> ? P : never];

declare const $entityMasks: unique symbol;
declare const $entityComponents: unique symbol;
declare const $entitySparseSet: unique symbol;
declare const $entityArray: unique symbol;
declare const $entityIndices: unique symbol;
declare const $removedEntities: unique symbol;

declare const $bitflag: unique symbol;
declare const $localEntities: unique symbol;
declare const $localEntityLookup: unique symbol;
declare const $entityCursor: unique symbol;
declare const $removed: unique symbol;
declare const $removedOut: unique symbol;
declare const $recycled: unique symbol;
declare const $eidToPrefab: unique symbol;

interface World {
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
type IWorld = World;

/**
 * Retrieves the store associated with the specified component in the given world.
 *
 * @param {World} world - The world to retrieve the component store from.
 * @param {Component} component - The component to get the store for.
 * @returns {Store} The store associated with the specified component.
 */
declare const getStore: <Store = void, C extends Component = Component>(world: World, component: C) => Store extends void ? C extends Component<infer Store_1> ? undefined extends Store_1 ? Omit<C, keyof Component> : Store_1 : never : Store;
/**
 * Sets the store associated with the specified component in the given world.
 *
 * @param {World} world - The world to set the component store in.
 * @param {Component} component - The component to set the store for.
 * @param {Store} store - The store to associate with the component.
 */
declare const setStore: <C extends Component>(world: World, component: C, store: C extends Component<infer Store> ? undefined extends Store ? Omit<C, keyof Component> : Store : never) => void;
/**
 * Defines a component for use in a World.
 *
 * Components are the building blocks of entities in a World. This function allows you to define a new component with an optional store, onSet callback, and onReset callback.
 *
 * @param definition - An optional object that defines the component's properties.
 * @param definition.store - A function that returns the initial store for the component.
 * @param definition.onSet - A callback that is called when the component's store is added to an entity.
 * @param definition.onReset - A callback that is called when the component's store is removed from an entity.
 * @param definition.ref - An optional reference object to be used for the component.
 * @returns The defined component.
 */
declare function defineComponent<Store = void, Params = void, Ref extends object = {}, W extends World = World>(definition?: {
    store?: () => Store;
    onSet?: (world: W, store: Store, eid: number, params: Params) => void;
    onReset?: (world: W, store: Store, eid: number) => void;
    onAdd?: (world: W, eid: number) => void;
    onRemove?: (world: W, eid: number) => void;
    onRegister?: (world: W, store: Store) => void;
    ref?: Ref;
}): void extends Ref ? Component<Store, Params> : Component<Store, Params> & Ref;
/**
 * Registers a component with a world.
 *
 * @param {World} world
 * @param {Component} component
 */
declare const registerComponent: (world: World, component: Component) => void;
/**
 * Registers multiple components with a world.
 *
 * @param {World} world
 * @param {Component[]} components
 */
declare const registerComponents: (world: World, components: Component[]) => void;
/**
 * Checks if an entity has a component.
 *
 * @param {World} world
 * @param {number} eid
 * @param {Component} component
 * @returns {boolean}
 */
declare const hasComponent: (world: World, eid: number, component: Component) => boolean;
/**
 * Adds a component to an entity
 *
 * @param {World} world
 * @param {number} eid
 * @param {Component} component
 * @param {boolean} [reset=false]
 */
declare const addComponent: (world: World, eid: number, arg: ComponentOrWithParams) => void;
/**
 * Adds multiple components to an entity.
 *
 * @param {World} world
 * @param {number} eid
 * @param {...ComponentOrWithParams} components
 */
declare function addComponents(world: World, eid: number, ...args: ComponentOrWithParams[]): void;
/**
 * Removes a component from an entity.
 *
 * @param {World} world
 * @param {number} eid
 * @param {Component} component
 * @param {boolean} [reset=true]
 */
declare const removeComponent: (world: World, eid: number, component: Component, reset?: boolean) => void;
/**
 * Removes multiple components from an entity.
 *
 * @param {World} world
 * @param {number} eid
 * @param {Component[]} components
 * @param {boolean} [reset=true]
 */
declare const removeComponents: (world: World, eid: number, components: Component[]) => void;

declare const TYPES_ENUM: {
    readonly i8: "i8";
    readonly ui8: "ui8";
    readonly ui8c: "ui8c";
    readonly i16: "i16";
    readonly ui16: "ui16";
    readonly i32: "i32";
    readonly ui32: "ui32";
    readonly f32: "f32";
    readonly f64: "f64";
    readonly eid: "eid";
};

type TODO = any;
type Constructor = new (...args: any[]) => any;
type TypedArray = Uint8Array | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

/**
 * Adds a new entity to the specified world, adding any provided component to the entity.
 *
 * @param {World} world
 * @param {...Component} components
 * @returns {number} eid
 */
declare const addEntity: (world: World, ...args: ComponentOrWithParams[]) => number;
/**
 * Removes an existing entity from the specified world.
 *
 * @param {World} world
 * @param {number} eid
 */
declare const removeEntity: (world: World, eid: number, reset?: boolean) => void;
/**
 *  Returns an array of components that an entity possesses.
 *
 * @param {*} world
 * @param {*} eid
 */
declare const getEntityComponents: (world: World, eid: number) => TODO;
/**
 * Checks the existence of an entity in a world
 *
 * @param {World} world
 * @param {number} eid
 */
declare const entityExists: (world: World, eid: number) => boolean;

declare const Prefab: {};
/**
 * Defines a prefab, a reusable collection of components that can be added to an entity, with optional components, set/reset callbacks, and reference object.
 *
 * @param definition - Optional object containing prefab definition.
 * @param definition.components - Array of components or components with parameters.
 * @param definition.ref - Reference object to be used as the prefab node.
 * @returns The created prefab node.
 */
declare const definePrefab: <Params = void, Ref extends {} = {}>(definition?: {
    components?: ComponentOrWithParams[];
    onSet?: (world: World, eid: number, params: Params) => void;
    onAdd?: (world: World, eid: number) => void;
    onRemove?: (world: World, eid: number) => void;
    ref?: Ref;
}) => PrefabNode<Params>;
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
declare const registerPrefab: (world: World, prefab: PrefabNode) => number;
/**
 * Gets the entity ID (EID) for the given prefab in the specified world.
 *
 * @param world - The world to get the prefab EID from.
 * @param prefab - The prefab to get the EID for.
 * @returns The entity ID for the given prefab in the specified world.
 */
declare const getPrefabEid: (world: World, prefab: PrefabNode) => number | undefined;
/**
 * Gets the prefab matching this entity ID.
 *
 * @param world - The world to get the prefab EID from.
 * @param prefab - The prefab to get the EID for.
 * @returns The entity ID for the given prefab in the specified world.
 */
declare const getPrefab: (world: World, eid: number) => PrefabNode | undefined;

declare const registerQuery: <W extends World>(world: W, query: Query) => void;
/**
 * Defines a query function which returns a matching set of entities when called on a world.
 *
 * @param {array} components
 * @returns {function} query
 */
declare const defineQuery: (components: (Component | QueryModifierTuple)[]) => Query;
declare function query<W extends World>(world: W, components: (Component | QueryModifierTuple)[]): QueryResult;
declare function query<W extends World>(world: W, queue: Queue): QueryResult;
declare const commitRemovals: (world: World) => void;
/**
 * Removes a query from a world.
 *
 * @param {World} world
 * @param {function} query
 */
declare const removeQuery: (world: World, query: Query) => void;
/**
 * Given an existing query, returns a new function which returns entities who have been added to the given query since the last call of the function.
 *
 * @param {function} query
 * @returns {function} enteredQuery
 */
declare const enterQuery: (query: Query) => (world: World) => readonly number[];
/**
 * Given an existing query, returns a new function which returns entities who have been removed from the given query since the last call of the function.
 *
 * @param {function} query
 * @returns {function} enteredQuery
 */
declare const exitQuery: (query: Query) => (world: World) => readonly number[];

declare const Not: (c: Component) => QueryModifierTuple;

declare function defineEnterQueue(query: Query): Queue;
declare function defineEnterQueue(components: Component[]): Queue;
declare function defineExitQueue(query: Query): Queue;
declare function defineExitQueue(components: Component[]): Queue;

declare const archetypeHash: (world: World, components: (Component | QueryModifierTuple)[]) => string;

/**
 * Defines a new relation type with optional configuration options.
 *
 * @param definition - An optional object that defines the relation options.
 * @param definition.component - A factory function that creates the relation component.
 * @param definition.exclusive - Whether the relation is exclusive (i.e., an entity can only have one instance of this relation).
 * @param definition.autoRemoveSubject - A boolean indicating whether the relation component should be automatically removed when the subject entity is removed.
 * @param definition.onTargetRemoved - A callback function that is called when a target entity of this relation is removed.
 * @returns The defined relation type.
 */
declare const defineRelation: <T extends Component>(definition?: {
    component?: () => T;
    exclusive?: boolean;
    autoRemoveSubject?: boolean;
    onTargetRemoved?: (world: World, subject: number, target: number) => void;
}) => RelationType<T>;
/**
 * Creates or retrieves a relation component for the given relation and target.
 *
 * @param relation - The relation type to use.
 * @param target - The target for the relation.
 * @returns The relation component for the given relation and target.
 * @throws {Error} If the relation or target is undefined.
 */
declare const Pair: <T extends Component>(relation: RelationType<T>, target: RelationTarget) => T;
declare const Wildcard: RelationType<any> | string;
declare const IsA: RelationType<any>;
declare const ChildOf: RelationType<Component>;
declare const ParentOf: RelationType<Component>;
/**
 * Retrieves the relation targets for the given entity in the specified world.
 *
 * @param world - The world to search for the entity.
 * @param relation - The relation type to use.
 * @param eid - The entity ID to search for.
 * @returns An array of relation targets for the given entity and relation.
 */
declare const getRelationTargets: (world: World, relation: RelationType<any>, eid: number) => any[];
declare const getParent: (world: World, eid: number) => any;
declare const getChild: (world: World, eid: number, options?: {
    components?: (Component | QueryModifierTuple)[];
    deep?: boolean;
}) => number | undefined;
declare const getChildren: (world: World, eid: number, options?: {
    components?: (Component | QueryModifierTuple)[];
    deep?: boolean;
}) => number[];

type System<W extends World = World, R extends any[] = any[]> = (world: W, ...args: R) => W;

/**
 * Defines a new system function.
 *
 * @param {function} update
 * @returns {function}
 */
declare const defineSystem: <W extends World = World, R extends any[] = any[]>(update: (world: W, ...args: R) => void) => System<W, R>;

declare const pipe: (...fns: Function[]) => (input: any) => any;

declare const worlds: World[];
declare const flushRemovedEntities: (world: World) => void;
declare const getEntityCursor: (world: World) => number;
declare const getRecycledEntities: (world: World) => number[];
declare function defineWorld<W extends object = {}>(world?: W): W & World;
declare function registerWorld(world: World): void;
/**
 * Creates a new world.
 *
 * @returns {object}
 */
declare function createWorld<W extends object = {}>(w?: W): W & World;
/**
 * Resets a world.
 *
 * @param {World} world
 * @returns {object}
 */
declare const resetWorld: (world: World) => World;
/**
 * Deletes a world.
 *
 * @param {World} world
 */
declare const deleteWorld: (world: World) => void;
/**
 * Returns all components registered to a world
 *
 * @param {World} world
 * @returns Array
 */
declare const getWorldComponents: (world: World) => Component[];
/**
 * Returns all existing entities in a world
 *
 * @param {World} world
 * @returns Array
 */
declare const getAllEntities: (world: World) => number[];

declare function withParams<P extends PrefabNode>(prefab: P, params: P extends PrefabNode<infer Params> ? Params : never): [P, P extends PrefabNode<infer Params> ? Params : never];
declare function withParams<C extends Component>(component: C, params: C extends Component<any, infer Params> ? Params : never): [C, C extends Component<any, infer Params> ? Params : never];

declare const SYMBOLS: {
    $prefabComponents: typeof $prefabComponents;
    $worldToEid: typeof $worldToEid;
    $children: typeof $children;
    $ancestors: typeof $ancestors;
    $pairsMap: typeof $pairsMap;
    $isPairComponent: typeof $isPairComponent;
    $relation: typeof $relation;
    $pairTarget: typeof $pairTarget;
    $onTargetRemoved: typeof $onTargetRemoved;
    $exclusiveRelation: typeof $exclusiveRelation;
    $autoRemoveSubject: typeof $autoRemoveSubject;
    $relationTargetEntities: typeof $relationTargetEntities;
    $component: typeof $component;
    $modifier: typeof $modifier;
    $queries: typeof $queries;
    $notQueries: typeof $notQueries;
    $hashToUncachedQuery: typeof $hashToUncachedQuery;
    $queriesHashMap: typeof $queriesHashMap;
    $querySparseSet: typeof $querySparseSet;
    $queueRegisters: typeof $queueRegisters;
    $queryDataMap: typeof $queryDataMap;
    $dirtyQueries: typeof $dirtyQueries;
    $queryComponents: typeof $queryComponents;
    $enterQuery: typeof $enterQuery;
    $exitQuery: typeof $exitQuery;
    $componentToInstance: typeof $componentToInstance;
    $componentCount: typeof $componentCount;
    $onAdd: typeof $onAdd;
    $onRemove: typeof $onRemove;
    $onReset: typeof $onReset;
    $onSet: typeof $onSet;
    $onRegister: typeof $onRegister;
    $createStore: typeof $createStore;
    $entityMasks: typeof $entityMasks;
    $entityComponents: typeof $entityComponents;
    $entitySparseSet: typeof $entitySparseSet;
    $entityArray: typeof $entityArray;
    $entityIndices: typeof $entityIndices;
    $removedEntities: typeof $removedEntities;
    $bitflag: typeof $bitflag;
    $localEntities: typeof $localEntities;
    $localEntityLookup: typeof $localEntityLookup;
    $entityCursor: typeof $entityCursor;
    $removed: typeof $removed;
    $removedOut: typeof $removedOut;
    $recycled: typeof $recycled;
    $eidToPrefab: typeof $eidToPrefab;
};

export { ChildOf, type Component, type ComponentInstance, type ComponentOrWithParams, type Constructor, type IWorld, IsA, Not, Pair, ParentOf, Prefab, type PrefabNode, type Query, type QueryData, type QueryModifier, type QueryModifierTuple, type QueryResult, type Queue, type RelationOptions, type RelationTarget, type RelationType, SYMBOLS, type System, type TODO, type TypedArray, TYPES_ENUM as Types, type UncachedQuery, type UncachedQueryData, Wildcard, type World, addComponent, addComponents, addEntity, archetypeHash, commitRemovals, createWorld, defineComponent, defineEnterQueue, defineExitQueue, definePrefab, defineQuery, defineRelation, defineSystem, defineWorld, deleteWorld, enterQuery, entityExists, exitQuery, flushRemovedEntities, getAllEntities, getChild, getChildren, getEntityComponents, getEntityCursor, getParent, getPrefab, getPrefabEid, getRecycledEntities, getRelationTargets, getStore, getWorldComponents, hasComponent, pipe, query, registerComponent, registerComponents, registerPrefab, registerQuery, registerWorld, removeComponent, removeComponents, removeEntity, removeQuery, resetWorld, setStore, withParams, worlds };
