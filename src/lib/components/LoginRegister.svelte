<script lang="ts">

    let createUser = $state(false);

</script>

<div class="dropdown navbar-nav">
    <button
        type="button"
        class="nav-link dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-auto-close="false"
    >
        Login / Register
    </button>
    <form class="dropdown-menu dropdown-menu-end p-4" style="width: 500px;" method="POST">
        <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input
                type="email"
                class="form-control"
                id="email"
                placeholder="email@example.com"
                name="email"
                required
            />
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Password"
                name="password"
                required
            />
        </div>
        {#if !createUser}
            <button type="submit" class="btn btn-primary">Sign in</button>
            <div class="d-flex justify-content-between mt-3">
                <!-- <a class="nav-link" href="/">Forgot Password?</a> -->
                <button class="nav-link" onclick={(event) => {event.preventDefault(); createUser = true}}>Create Account</button>
            </div>
        {:else}
            <div class="d-flex justify-content-between mt-3">
                <button type="submit" class="btn btn-primary">Register</button>
                <button class="nav-link" onclick={(event) => {event.preventDefault(); createUser = false}}>Cancel</button>
            </div>
        {/if}


        
    </form>
</div>