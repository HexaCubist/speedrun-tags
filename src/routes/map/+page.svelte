<script lang="ts">
	import { TagList } from '$lib/tags.svelte';
	import Map from '$lib/components/map/map.svelte';
	import { type appStateType } from '$lib/appState.svelte.js';
	import { getContext } from 'svelte';
	let { data } = $props();
	let myAppState = getContext<appStateType>('appState');
	let tags = getContext<TagList>('tags');
</script>

<Map {tags} />
