<script lang="ts">
	import { page } from '$app/stores';
	import LoginRegister from './LoginRegister.svelte';

	const pages = [
		{ title: 'Home', href: '/' },
		{ title: 'Packages', href: '/packages' }
		// { title: 'Audio', href: '/audio' },
		// { title: 'Config', href: '/config' },
		// { title: 'Controller', href: '/controller' },
		// { title: 'Script', href: '/script' }
	];
</script>

<nav class="navbar navbar-expand-lg navbar-bionics text-light" data-bs-theme="">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">BionicPackages</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarNav"
			aria-controls="navbarNav"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarNav">
			<ul class="navbar-nav">
				{#each pages as { title, href }}
					<li class="nav-item">
						<a
							{href}
							class={$page.url.pathname === href ? 'nav-link active' : 'nav-link'}
							aria-current={$page.url.pathname === href ? 'page' : undefined}>{title}</a
						>
					</li>
				{/each}
			</ul>
		</div>
		<!-- <LoginRegister/> -->
	</div>
</nav>
