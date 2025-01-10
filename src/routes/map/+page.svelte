<script lang="ts">
	import { Map, Geocoder, Marker, controls } from '@beyonk/svelte-mapbox';
	import { env } from '$env/dynamic/public';
	const { GeolocateControl, NavigationControl, ScaleControl } = controls;

	let mapComponent = $state();
</script>

<div class="h-full">
	<Map
		class="h-full"
		accessToken={env.PUBLIC_MAPBOX_TOKEN}
		bind:this={mapComponent}
		on:recentre={(e) => console.log(e.detail.center.lat, e.detail.center.lng)}
		options={{ scrollZoom: false }}
	>
		<Marker
			lat={51.497799}
			lng={-0.17922}
			color="rgb(255,255,255)"
			label="some marker label"
			popupClassName="class-name"
		/> // built in Marker component
		<NavigationControl />
		<GeolocateControl options={{ some: 'control-option' }} />
		<ScaleControl />
	</Map>
</div>
