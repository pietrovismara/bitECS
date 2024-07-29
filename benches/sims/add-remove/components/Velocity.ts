import { defineComponent, onRemove } from '@bitecs/core';

export const Velocity = defineComponent(() => ({
	x: [] as number[],
	y: [] as number[],
}));

onRemove(Velocity, (world, store, eid, reset) => {
	if (reset) {
		delete store.x[eid];
		delete store.y[eid];
	}
});
