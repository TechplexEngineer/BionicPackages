<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-hot-french-toast';
	import Header from '$lib/components/Header.svelte';
	import '../app.scss';
	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	onMount(async () => {
		if (!browser) return;

		// this is enough for most components
		await import('bootstrap');
	});
</script>

<Toaster />

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>

	<footer>
		<p>
			<a href="https://github.com/TechplexEngineer/HeatPi">HeatPi</a> - Home Heating Control System
		</p>
	</footer>
</div>

<style>
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}
	main {
		margin-top: 20px;
	}
</style>
