<script lang="ts">
	import type { TagList } from '$lib/tags.svelte';
	import type { GpsLocation } from '$lib/location.svelte';
	import Icon from '@iconify/svelte';

	export let userLocation: GpsLocation;
	// export let tagList: TagList;
</script>

<div></div>

<div class="h-4 w-4 rounded-full border-2 border-blue-400 bg-white shadow-md">
	<div
		class="wrapper transition"
		style="transform: scale(1.5) rotate({userLocation.heading ?? 0}deg)"
	>
		<Icon icon="material-symbols:arrow-drop-up-rounded" class="text-blue-400" />
	</div>
</div>
