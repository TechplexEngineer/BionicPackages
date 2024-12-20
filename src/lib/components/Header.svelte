<script>
	import { page } from '$app/stores';

	const pages = [
		{ title: 'Home', href: '/' },
		{ title: 'Bus', href: '/bus' },
		// { title: 'Audio', href: '/audio' },
		// { title: 'Config', href: '/config' },
		// { title: 'Controller', href: '/controller' },
		// { title: 'Script', href: '/script' }
	];
</script>

<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">HeatPi</a>
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
	</div>
</nav>
