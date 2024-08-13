import assert from 'assert';
import { describe, expect, it, vi } from 'vitest';
import { $componentMap } from '../../src/component/symbols.js';
import {
	addComponent,
	addComponents,
	addEntity,
	defineComponent,
	flushRemovedEntities,
	getStore,
	hasComponent,
	registerComponent,
	removeComponent,
	removeEntity,
	setStore,
	withParams,
} from '../../src/index.js';
import { createWorld } from '../../src/world/World.js';

const TestComponent = defineComponent({
	store: () => ({ value: [] as number[] }),
	onSet: (world, store, eid, params: { value: number } = { value: 0 }) => {
		store.value[eid] = params.value;
	},
	onReset: (world, store, eid) => {
		delete store.value[eid];
	},
});

describe('Component Integration Tests', () => {
	it('should define a component with a store that gets registered per world', () => {
		const worldA = createWorld();
		const worldB = createWorld();

		const eidA = addEntity(worldA);
		addComponent(worldA, eidA, TestComponent);

		const storeA = getStore(worldA, TestComponent);

		// Gets added with default value of 0 to eid 0.
		expect(storeA).toMatchObject({ value: [0] });

		const eidB = addEntity(worldB);
		addComponent(worldB, eidB, TestComponent);

		const storeB = getStore(worldB, TestComponent);

		// Gets added with default value of 0 to eid 0.
		expect(storeB).toMatchObject({ value: [0] });
		expect(storeA).not.toBe(storeB);

		// Deletes the store from worldA when reset.
		removeComponent(worldA, eidA, TestComponent, true);
		expect(storeA.value[eidA]).toBe(undefined);
	});

	it('should register components on-demand', () => {
		const world = createWorld();

		registerComponent(world, TestComponent);
		assert(world[$componentMap].has(TestComponent));
	});

	it('should register components automatically upon adding to an entity', () => {
		const world = createWorld();
		const eid = addEntity(world);

		addComponent(world, eid, TestComponent);
		assert(world[$componentMap].has(TestComponent));
	});

	it('can define a component with ref', () => {
		const resource = new Float64Array(1000);
		const StaticComponent = defineComponent({ ref: { resource } });

		const world = createWorld();
		const eid = addEntity(world);

		addComponent(world, eid, StaticComponent);
		assert(hasComponent(world, eid, StaticComponent));
		assert(StaticComponent.resource === resource);
	});

	it('should add and remove components from an entity', () => {
		const world = createWorld();

		const eid = addEntity(world);

		addComponent(world, eid, TestComponent);
		assert(hasComponent(world, eid, TestComponent));

		removeComponent(world, eid, TestComponent);
		assert(hasComponent(world, eid, TestComponent) === false);
	});

	it('should add component with params', () => {
		const world = createWorld();

		const eid = addEntity(world);

		addComponent(world, eid, withParams(TestComponent, { value: 10 }));
		const store = getStore(world, TestComponent);
		assert(store.value[eid] === 10);
	});

	it('should create tag components', () => {
		const world = createWorld();
		const IsTag = defineComponent();

		const eid = addEntity(world);

		addComponent(world, eid, IsTag);
		assert(hasComponent(world, eid, IsTag));

		// Return the tag component from getStore.
		const tag = getStore(world, IsTag);
		assert(tag === IsTag);

		removeComponent(world, eid, IsTag);
		assert(hasComponent(world, eid, IsTag) === false);
	});

	it('should only remove the component specified', () => {
		const world = createWorld();
		const TestComponent = {};
		const TestComponent2 = {};

		const eid = addEntity(world);

		addComponent(world, eid, TestComponent);
		addComponent(world, eid, TestComponent2);
		assert(hasComponent(world, eid, TestComponent));
		assert(hasComponent(world, eid, TestComponent2));

		removeComponent(world, eid, TestComponent);
		assert(hasComponent(world, eid, TestComponent) === false);
		assert(hasComponent(world, eid, TestComponent2) === true);
	});

	it('should run cleanup function when removing a component', () => {
		const world = createWorld();

		const eid = addEntity(world);

		addComponent(world, eid, TestComponent);
		assert(hasComponent(world, eid, TestComponent));

		removeComponent(world, eid, TestComponent);
		assert(hasComponent(world, eid, TestComponent) === false);

		const store = getStore(world, TestComponent);
		assert(store.value[eid] === undefined);
	});

	it('should correctly register more than 32 components', () => {
		const world = createWorld();

		const eid = addEntity(world);

		Array(1024)
			.fill(null)

			.map((_) => ({}))
			.forEach((c) => {
				addComponent(world, eid, c);
				assert(hasComponent(world, eid, c));
			});
	});

	it('should add components to entities after recycling', () => {
		const world = createWorld();
		let eid = 0;

		for (let i = 0; i < 10; i++) {
			addEntity(world);
		}

		for (let i = 0; i < 10; i++) {
			removeEntity(world, i);
		}

		flushRemovedEntities(world);

		for (let i = 0; i < 10; i++) {
			eid = addEntity(world);
		}

		const component = {};
		addComponent(world, eid, component);

		assert(hasComponent(world, eid, component));
	});

	it('should add multiple components at once', () => {
		const world = createWorld();
		const A = {};
		const B = {};
		const C = {};

		const eid = addEntity(world);
		addComponents(world, eid, A, B, C);

		assert(hasComponent(world, eid, A));
		assert(hasComponent(world, eid, B));
		assert(hasComponent(world, eid, C));
	});

	it('should return the ref of a component when no store is provided', () => {
		const world = createWorld();
		const ref = { foo: 'bar' };
		const RefComponent = defineComponent({
			ref,
		});
		registerComponent(world, RefComponent);

		assert(getStore(world, RefComponent) === ref);
	});

	it('should replace the store of a component', () => {
		const world = createWorld();
		registerComponent(world, TestComponent);

		const mockStore = { value: [] };

		setStore(world, TestComponent, mockStore);

		assert(getStore(world, TestComponent) === mockStore);
	});

	it('calls onAdd before onSet', () => {
		const world = createWorld();

		let counter = 0;
		let addResult = 0;
		let setResult = 0;

		const onAdd = vi.fn(() => {
			counter++;
			addResult = counter;
		});
		const onSet = vi.fn(() => {
			counter++;
			setResult = counter;
		});

		const A = defineComponent({
			onAdd,
			onSet,
		});

		const eid = addEntity(world);
		addComponent(world, eid, A);

		assert(addResult === 1);
		assert(setResult === 2);
	});

	it('calls onRemove before onReset', () => {
		const world = createWorld();

		let counter = 0;
		let removeResult = 0;
		let resetResult = 0;

		const onRemove = vi.fn(() => {
			counter++;
			removeResult = counter;
		});
		const onReset = vi.fn(() => {
			counter++;
			resetResult = counter;
		});

		const A = defineComponent({
			onRemove,
			onReset,
		});

		const eid = addEntity(world);
		addComponent(world, eid, A);
		removeComponent(world, eid, A);

		assert(removeResult === 1);
		assert(resetResult === 2);
	});
});