<script lang="ts">
	import { dev } from '$app/environment';
	import type { appStateType } from '$lib/appState.svelte';
	import type { TagList } from '$lib/tags.svelte';
	import Map from '../map/map.svelte';
	import Scoreboard from './scoreboard.svelte';

	let { tags, appState }: { tags: TagList; appState: appStateType } = $props();

	let nextTag = $derived(tags.nextTag);
	let percentFound = $derived(tags.foundTags.length / tags.allTags.length);
</script>

<h1 class="my-4 text-center text-4xl font-bold">You win! 🎉</h1>
<Scoreboard {appState} {tags}></Scoreboard>

<div class="m-2">
	<button onclick={() => appState.newSession()} class="btn btn-primary btn-block block text-center"
		>Start again</button
	>
</div>
