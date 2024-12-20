<script lang="ts">
	import type { PageData } from './$types';
	import ControlForm from '$lib/components/ControlForm.svelte';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	let lastRefreshed = $state(new Date());

	onMount(() => {
		console.log('Mounted');

		const interval = setInterval(() => {
			console.log('Refreshing data');
			invalidateAll();
			lastRefreshed = new Date();
		}, 1000 * 30);
		return () => clearInterval(interval);
	});

	let { data }: { data: PageData } = $props();

	let durationHrs = $state(1);
</script>

<div class="container">
	<div class="d-flex justify-content-between">
		<h1>Home Heating Control</h1>
		<small>
			<button type="button" class="btn btn-outline-secondary">
				Last refreshed: {new Date(lastRefreshed).toLocaleString('en-US', {
					hour: 'numeric',
					minute: 'numeric',
					second: 'numeric',
					hour12: true,
					month: '2-digit',
					day: '2-digit',
					year: '2-digit'
				})}
			</button>
		</small>
		<div>
			<button type="button" class="btn btn-outline-primary">
				Top <span class="badge text-bg-secondary">{data.temps.top}</span>
			</button>
			<button type="button" class="btn btn-outline-primary">
				Mid <span class="badge text-bg-secondary">{data.temps.mid}</span>
			</button>
			<button type="button" class="btn btn-outline-primary">
				Bot <span class="badge text-bg-secondary">{data.temps.bot}</span>
			</button>
		</div>
	</div>

	{#if data.errors && data.errors.length > 0}
	<div class="alert alert-danger" role="alert">
		{#each data.errors as error}
			<p>{error}</p>
		{/each}
	</div>
	{/if}

	<div class="form-group mb-3">
		<label class="control-label" for="duration">Duration (Hour)</label>
		<div class="input-group">
			<input name="duration" type="text" bind:value={durationHrs} class="form-control" />
			<button class="btn btn-outline-secondary" type="button" onclick={() => (durationHrs = 4)}
				>4hr</button
			>
			<button class="btn btn-outline-secondary" type="button" onclick={() => (durationHrs = 2)}
				>2hr</button
			>
			<button class="btn btn-outline-secondary" type="button" onclick={() => (durationHrs = 1)}
				>1hr</button
			>
			<button class="btn btn-outline-secondary" type="button" onclick={() => (durationHrs = 0.5)}
				>30min</button
			>
			<button class="btn btn-outline-secondary" type="button" onclick={() => (durationHrs = 0.25)}
				>15min</button
			>
		</div>
	</div>

	<table class="table table-striped">
		<thead>
			<tr>
				<th></th>
				<th>Zone</th>
				<th>Status</th>
				<th>Force/Control</th>
				<th>Setting active until</th>
			</tr>
		</thead>
		<tbody>
			{#each data.zones as zone}
				<tr>
					<td>{zone.id}</td>
					<td>{zone.name}</td>
					<td>
						{#if zone.status === 'on'}
							<div class="circle on" title="On"></div>
						{:else if zone.status === 'off'}
							<div class="circle off" title="Off"></div>
						{:else}
							<div class="circle" title="Unknown"></div>
						{/if}
					</td>
					<td>
						<ControlForm {zone} {durationHrs} />
					</td>
					<td
						>{zone.settingActiveUntil
							? new Date(zone.settingActiveUntil).toLocaleString('en-US', {
									hour: 'numeric',
									minute: 'numeric',
									hour12: true,
									month: '2-digit',
									day: '2-digit',
									year: '2-digit'
								})
							: '--'}</td
					>
				</tr>{/each}
		</tbody>
	</table>
</div>

<style>
	.circle {
		width: 15px;
		height: 15px;
		background: blue;
		-moz-border-radius: 50px;
		-webkit-border-radius: 50px;
		border-radius: 50px;
		color: transparent;
		display: inline-block;
	}
	.circle.on {
		background: green;
	}
	.circle.off {
		background: red;
	}
</style>
