<script lang="ts">
	import { enhance } from '$app/forms';
    import type { PageData, ActionData } from './$types';

    let { data, form }: { data: PageData, form: ActionData } = $props();
</script>

<form class="container" method="POST" action="?/scan" use:enhance>
    <div class="d-flex justify-content-between">
        <h1>I2C Bus</h1>
        <div>
            <button class="btn btn-primary mt-2">Scan</button>
        </div>
    </div>
    
    <ul>
        {#each form?.deviceAddresses || [] as address}
            <li>{address}</li>
        {:else}
            <li>No devices found</li>
        {/each}
    </ul>
    

</form>