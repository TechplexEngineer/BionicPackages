<script>
	import { page } from '$app/stores';

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
		<div class="dropdown navbar-nav">
			<button type="button" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="false">
				Login / Register
			</button>
			<form class="dropdown-menu dropdown-menu-end p-4" style="width: 500px;">
			  <div class="mb-3">
				<label for="exampleDropdownFormEmail2" class="form-label">Email address</label>
				<input type="email" class="form-control" id="exampleDropdownFormEmail2" placeholder="email@example.com">
			  </div>
			  <div class="mb-3">
				<label for="exampleDropdownFormPassword2" class="form-label">Password</label>
				<input type="password" class="form-control" id="exampleDropdownFormPassword2" placeholder="Password">
			  </div>
			  <div class="mb-3">
				<div class="form-check">
				  <input type="checkbox" class="form-check-input" id="dropdownCheck2">
				  <label class="form-check-label" for="dropdownCheck2">
					Remember me
				  </label>
				</div>
			  </div>
			  <button type="submit" class="btn btn-primary">Sign in</button>
			  <div class="d-flex justify-content-between mt-3">
					<a href="">Forgot Password?</a>
					<a href="">Create Account</a>
				</div>
			</form>
			
		  </div>

		
	</div>
</nav>
