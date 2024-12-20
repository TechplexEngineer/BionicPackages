<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ChangeEventHandler } from 'svelte/elements';
	import type { Zone } from '../../routes/proxy+page.server';

	let { zone, durationHrs }: { zone: Zone; durationHrs: number } = $props();

	let form = $state<HTMLFormElement>();

	const radioBtnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		// console.log('radioBtnChange', zone.id, event.currentTarget.value);
		form?.requestSubmit();
	};
</script>

<form action="?/set" method="post" use:enhance bind:this={form}>
	<input
		type="radio"
		name="control"
		value="on"
		checked={zone.control == 'on'}
		onchange={radioBtnChange}
	/>
	On
	<input
		type="radio"
		name="control"
		value="off"
		checked={zone.control == 'off'}
		onchange={radioBtnChange}
	/>
	Off
	<input
		type="radio"
		name="control"
		value="thermostat"
		checked={zone.control != 'on' && zone.control != 'off'}
		onchange={radioBtnChange}
	/>
	Thermostat
	<input type="hidden" name="zone" value={zone.id} />
	<input type="hidden" name="durationhrs" bind:value={durationHrs} />
</form>
