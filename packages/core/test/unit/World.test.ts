import assert, { strictEqual } from 'assert';
import { describe, it } from 'vitest';
import { $componentToInstance } from '../../src/component/symbols.js';
import { $entityMasks } from '../../src/entity/symbols.js';
import { $dirtyQueries, $queries, $queryDataMap } from '../../src/query/symbols.js';
import { createWorld } from '../../src/world/World.js';
import { $bitflag } from '../../src/world/symbols.js';

describe('World Unit Tests', () => {
	it('should initialize all private state', () => {
		const world = createWorld();

		strictEqual(Object.keys(world).length, 0);

		assert(Array.isArray(world[$entityMasks]));

		strictEqual(world[$entityMasks][0].constructor.name, 'Array');
		strictEqual(world[$entityMasks][0].length, 0);

		strictEqual(world[$bitflag], 1);

		strictEqual(world[$componentToInstance].constructor.name, 'Map');
		strictEqual(world[$queryDataMap].constructor.name, 'Map');
		strictEqual(world[$queries].constructor.name, 'Set');
		strictEqual(world[$dirtyQueries].constructor.name, 'Set');
	});
});
