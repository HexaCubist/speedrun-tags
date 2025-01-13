<script lang="ts">
	import { page } from '$app/state';
	import type { appStateType } from '$lib/appState.svelte';
	import type { TagList } from '$lib/tags.svelte';
	import { getContext, onMount } from 'svelte';

	let { data } = $props();
	let myAppState = getContext<appStateType>('appState');
	let tags = getContext<TagList>('tags');

	const foundTag = tags.allTags.find((tag) => tag.data.id === page.params.id);
	const isNextTag = foundTag?.data.id === tags.nextTag?.data.id;

	let timeTillRedirect = $state(3);

	onMount(() => {
		if (!foundTag?.found && isNextTag) {
			foundTag?.find();
		}
		const interval = setInterval(() => {
			timeTillRedirect--;
			if (timeTillRedirect <= 0) {
				clearInterval(interval);
				window.location.href = '/';
			}
		}, 1000);
	});
</script>

<div class="hero">
	<div class="hero-content">
		<div class="max-w-md px-2">
			{#if foundTag && isNextTag}
				<h1 class="text-center text-5xl font-bold">New Tag 🎉</h1>
				<div>
					<p class="mb-2">
						You've found <i>{foundTag.data.Name}</i>! Congrats - redirecting in {timeTillRedirect} second{timeTillRedirect ===
						1
							? ''
							: 's'}...
					</p>
				</div>
			{:else if foundTag && foundTag.found}
				<h1 class="text-center text-5xl font-bold">Tag already found!</h1>
				<div>
					<p class="mb-2">Please try again.</p>
				</div>
			{:else if foundTag}
				<h1 class="text-center text-5xl font-bold">Wrong tag!</h1>
				<div>
					<p class="mb-2">
						You're doing things a bit out of order: this tag is not the next one. Come back here in
						a bit!
					</p>
				</div>
			{:else}
				<h1 class="text-center text-5xl font-bold">Tag not found!</h1>
				<div>
					<p class="mb-2">Please try again.</p>
				</div>
			{/if}
		</div>
	</div>
</div>
