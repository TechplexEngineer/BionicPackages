<script lang="ts">
	import { enhance } from '$app/forms';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<form method="post" use:enhance>
    <div class="row">
        <div class="mb-3 col-4">
            <label for="nameField" class="form-label">Message</label>
            <input type="text" class="form-control" id="nameField" name="message" value="Success" />
        </div>

        <div class="mb-3 col-4">
            <label for="carrierField" class="form-label">Type</label>
            <select class="form-control" id="carrierField" name="type">
                
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                
            </select>
        </div>
        <div class="col-1">
            <label for="nameField" class="form-label">&nbsp;</label>
            <button class="btn btn-primary">Add</button>
        </div>
    </div>
</form>