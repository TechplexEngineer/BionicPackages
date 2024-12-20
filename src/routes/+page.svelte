<script lang="ts">
	import type { PageData } from './$types';
	import ControlForm from '$lib/components/ControlForm.svelte';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();
</script>

<div class="container">
	<div class="d-flex justify-content-between">
		<h1>Shipments</h1>
		<form action="?/add" method="post" use:enhance>
			<div class="row">
				<div class="mb-3 col-4">
					<label for="nameField" class="form-label">Name / Description</label>
					<input type="text" class="form-control" id="nameField" name="name" />
				</div>
				<div class="mb-3 col-3">
					<label for="trackingNumberField" class="form-label">Tracking Number</label>
					<input
						type="text"
						class="form-control"
						id="trackingNumberField"
						name="tracking"
						required
					/>
				</div>
				<div class="mb-3 col-4">
					<label for="carrierField" class="form-label">Carrier</label>
					<select class="form-control" id="carrierField" name="carrier" required>
						<option disabled selected hidden="" value="-1">-- Choose a carrier --</option>
						<optgroup label="Common">
							<option value="USPS">USPS</option>
							<option value="FedEx">FedEx</option>
							<option value="UPS">UPS</option>
						</optgroup>
						<optgroup label="Other">
							<option value="AmazonMws">AmazonMws</option>
							<option value="APC">APC</option>
							<option value="Asendia">Asendia</option>
							<option value="AsendiaUsa">Asendia USA</option>
							<option value="AustraliaPost">Australia Post</option>
							<option value="AxlehireV3">AxlehireV3</option>
							<option value="BetterTrucks">Better Trucks</option>
							<option value="Bond">Bond</option>
							<option value="CanadaPost">Canada Post</option>
							<option value="Canpar">Canpar</option>
							<option value="ColumbusLastMile">CDL Last Mile Solutions</option>
							<option value="Chronopost">Chronopost</option>
							<option value="CloudSort">CloudSort</option>
							<option value="CourierExpress">Courier Express</option>
							<option value="CouriersPlease">CouriersPlease</option>
							<option value="DaiPost">Dai Post</option>
							<option value="DeliverIt">DeliverIt</option>
							<option value="DeutschePost">Deutsche Post</option>
							<option value="DeutschePostUK">Deutsche Post UK</option>
							<option value="DHLEcommerceAsia">DHL eCommerce Asia</option>
							<option value="DhlEcs">DHL eCommerce Solutions</option>
							<option value="DHLExpress">DHL Express</option>
							<option value="DPD">DPD</option>
							<option value="DPDUK">DPD UK</option>
							<option value="ePostGlobal">ePost Global</option>
							<option value="Estafeta">Estafeta</option>
							<option value="Evri">Evri</option>
							<option value="Fastway">Fastway</option>
							<option value="FedExCrossBorder">FedEx Cross Border</option>
							<option value="FedExMailview">FedEx Mailview</option>
							<option value="FedExSameDayCity">FedEx SameDay City</option>
							<option value="FedexSmartPost">FedEx SmartPost</option>
							<option value="FirstMile">FirstMile</option>
							<option value="Globegistics">Globegistics</option>
							<option value="GSO">GSO</option>
							<option value="InterlinkExpress">Interlink Express</option>
							<option value="JPPost">JP Post</option>
							<option value="KuronekoYamato">Kuroneko Yamato</option>
							<option value="LaPoste">La Poste</option>
							<option value="LaserShipV2">LaserShip</option>
							<option value="LoomisExpress">Loomis Express</option>
							<option value="LSO">LSO</option>
							<option value="Newgistics">Newgistics</option>
							<option value="OnTrac">OnTrac</option>
							<option value="OsmWorldwide">Osm Worldwide</option>
							<option value="Parcelforce">Parcelforce</option>
							<option value="Parcll">PARCLL</option>
							<option value="PassportGlobal">Passport</option>
							<option value="PostNL">PostNL</option>
							<option value="Purolator">Purolator</option>
							<option value="RoyalMail">Royal Mail</option>
							<option value="OmniParcel">SEKO OmniParcel</option>
							<option value="Sendle">Sendle</option>
							<option value="SFExpress">SF Express</option>
							<option value="Sonic">Sonic</option>
							<option value="SpeeDee">Spee-Dee</option>
							<option value="StarTrack">StarTrack</option>
							<option value="Swyft">Swyft</option>
							<option value="TForce">TForce Logistics</option>
							<option value="Toll">Toll</option>
							<option value="UDS">UDS</option>
							<option value="UPSIparcel">UPS i-parcel</option>
							<option value="UPSMailInnovations">UPS Mail Innovations</option>
							<option value="Veho">Veho</option>
							<option value="XDelivery">XDelivery</option>
							<option value="Yanwen">Yanwen</option>
						</optgroup>
					</select>
				</div>
				<div class="col-1">
					<label for="nameField" class="form-label">&nbsp;</label>
					<button class="btn btn-primary">Add</button>
				</div>
			</div>
		</form>
	</div>

	{#if data.errors && data.errors.length > 0}
		<div class="alert alert-danger" role="alert">
			{#each data.errors as error}
				<p>{error}</p>
			{/each}
		</div>
	{/if}

	<table class="table table-striped">
		<thead>
			<tr>
				<th>Name</th>
				<th>Status</th>
				<th>Est. Delivery</th>
				<th>Tracking</th>
				<th>Carrier</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each data.packages as pkg}
				<tr>
					<td>{pkg.name}</td>
					<td>{pkg.status}</td>
					<td>{pkg.estDelivery}</td>
					<td><a href={pkg.trackingUrl}>{pkg.trackingNumber}</a></td>
					<td>{pkg.carrier}</td>
					<td></td>
				</tr>
			{:else}
				<tr>
					<td colspan="6">No packages found</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<a href="https://slack.com/oauth/v2/authorize?scope=bookmarks%3Awrite%2Cchat%3Awrite%2Ccommands%2Cincoming-webhook&amp;user_scope=&amp;redirect_uri=https%3A%2F%2Fbionicpackages.pages.dev%2Foauth%2Fredirect&amp;client_id=9053818103.8203682543349" style="align-items:center;color:#000;background-color:#fff;border:1px solid #ddd;border-radius:4px;display:inline-flex;font-family:Lato, sans-serif;font-size:16px;font-weight:600;height:48px;justify-content:center;text-decoration:none;width:236px"><svg xmlns="http://www.w3.org/2000/svg" style="height:20px;width:20px;margin-right:12px" viewBox="0 0 122.8 122.8"><path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path><path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path><path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path><path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"></path></svg>Add to Slack</a>
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
