<script lang="ts">
	import { env } from '$env/dynamic/public';
	import mapboxgl from 'mapbox-gl';
	import { getContext, mount, onMount } from 'svelte';
	import RulerControl from '@mapbox-controls/ruler';
	import { LocationState } from '$lib/location.svelte';
	import LocationMarker from './location-marker.svelte';
	import type { Tag, TagList } from '$lib/tags.svelte';
	import TagMarker from './tag-marker.svelte';
	import type { appStateType } from '$lib/appState.svelte';

	let { tags }: { tags: TagList } = $props();

	let map: mapboxgl.Map | undefined = $state();
	let mapContainer: HTMLDivElement | undefined = $state();
	let lat = $state(51.498032);
	let lng = $state(-0.176775);
	let zoom = $state(15);

	const myAppState = getContext<appStateType>('appState');
	const userLocation = myAppState.location;

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

	let marker: mapboxgl.Marker | undefined = $state();
	$effect(() => {
		if (
			map &&
			userLocation.state === LocationState.complete &&
			userLocation.lat &&
			userLocation.lon
		) {
			// map.flyTo({
			// 	center: [userLocation.lon, userLocation.lat],
			// 	zoom: 15
			// });
			if (marker) {
				marker.setLngLat([userLocation.lon, userLocation.lat]);
			} else {
				const markerEl = document.createElement('div');
				mount(LocationMarker, { props: { userLocation }, target: markerEl });
				marker = new mapboxgl.Marker({
					anchor: 'center',
					element: markerEl
				})
					.setLngLat([userLocation.lon, userLocation.lat])
					.addTo(map);
			}
		}
	});
	let markerList: mapboxgl.Marker[] = [];
	$effect(() => {
		if (map && tags) {
			let thisMap = map;
			markerList.forEach((marker) => marker.remove());
			markerList = [...tags.foundTags, ...(tags.nextTag ? [tags.nextTag] : [])].map((tag) => {
				const el = document.createElement('div');
				mount(TagMarker, { props: { userLocation, tagList: tags, tag }, target: el });
				return new mapboxgl.Marker({
					element: el
				})
					.setLngLat([tag.lon, tag.lat])
					.addTo(thisMap);
			});
		}
	});
</script>

<div class="h-full">
	<div class="map-container h-full" bind:this={mapContainer}></div>
</div>
