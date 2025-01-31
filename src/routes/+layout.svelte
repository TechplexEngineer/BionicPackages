<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-hot-french-toast';
	import Header from '$lib/components/Header.svelte';
	import '../app.scss';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	onMount(async () => {
		if (!browser) return;

		// this is enough for most components
		await import('bootstrap');
	});

	const convertFlashTypeToBoostrapClass = (flashType: string): string => {
		switch (flashType) {
			case 'success':
				return 'alert-success';
			case 'error':
				return 'alert-danger';
			case 'warning':
				return 'alert-warning';
			case 'info':
				return 'alert-info';
			default:
				return 'alert-primary';
		}
	};

	const flash = getFlash(page);
</script>

<Toaster />

<div class="app">
	<Header />

	<main>
		<div class="container">
			{#if $flash}
				{@const alertClass = convertFlashTypeToBoostrapClass($flash.type)}
				<div class={`alert ${alertClass}`} role="alert">{$flash.message}</div>
			{/if}
		</div>

		{@render children()}
	</main>

	<footer class="sticky-footer">
		<p>
			<a href="https://github.com/TechplexEngineer/BionicPackages">BionicPackages</a> - Package Tracking
			System
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
