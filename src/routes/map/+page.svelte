<script lang="ts">
	import { env } from '$env/dynamic/public';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import RulerControl from '@mapbox-controls/ruler';

	let map: mapboxgl.Map | undefined = $state();
	let mapContainer: HTMLDivElement | undefined = $state();
	let lat = $state(51.498032);
	let lng = $state(-0.176775);
	let zoom = $state(15);

	onMount(() => {
		if (mapContainer) {
			map = new mapboxgl.Map({
				container: mapContainer,
				style: 'mapbox://styles/hexacubist/cm5qs3pnk00jh01pl8nfh5vtv',
				center: [lng, lat],
				zoom: zoom,
				accessToken: env.PUBLIC_MAPBOX_TOKEN
			});
			map.addControl(new mapboxgl.NavigationControl());
			map.addControl(new RulerControl(), 'bottom-right');
		}
	});
</script>

<div class="h-full">
	<div class="map-container h-full" bind:this={mapContainer}></div>
</div>
