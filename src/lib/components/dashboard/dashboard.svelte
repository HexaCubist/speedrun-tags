<script lang="ts">
	import { dev } from '$app/environment';
	import type { TagList } from '$lib/tags.svelte';
	import Map from '../map/map.svelte';

	let { tags }: { tags: TagList } = $props();

	let nextTag = $derived(tags.nextTag);
	let percentFound = $derived(tags.foundTags.length / tags.allTags.length);
</script>

<div class="flex flex-col gap-2">
	<div class="stats bg-base-100 flex flex-wrap shadow">
		<div class="stat shrink grow basis-20">
			<div class="stat-title">Next Tag</div>
			<div class="stat-value">
				{#if nextTag}
					{nextTag.distance}m
				{:else}
					No tags
				{/if}
			</div>
			<div class="stat-desc">Metre{nextTag?.distance === 1 ? '' : 's'}</div>
		</div>
		<div class="stat shrink grow basis-20">
			<div class="stat-title">Tags Remaining</div>
			<div class="stat-value">{tags.unfoundTags.length}</div>
			<div class="stat-desc">Tag{tags.unfoundTags.length === 1 ? '' : 's'}</div>
		</div>
		<div class="stat flex shrink grow basis-20 items-center justify-center">
			<div class="stat-value">
				<div
					class="radial-progress bg-primary text-primary-content border-primary border-4"
					style:--value={percentFound * 100}
					style:--size="4rem"
					role="progressbar"
				>
					{Math.round(percentFound)}%
				</div>
			</div>
		</div>
		{#if tags.lastTag}
			<div class="stat shrink grow basis-20">
				<div class="stat-title">Challenge Time</div>
				<div class="stat-value">{tags.lastTag?.sinceFound}</div>
				<div class="stat-desc">Tag{tags.foundTags.length === 1 ? '' : 's'}</div>
			</div>
		{/if}
	</div>

	<div class="h-80">
		<Map {tags} />
	</div>

	<div class="flex flex-wrap gap-2">
		{#if dev}
			<button onclick={() => tags.nextTag?.find()} class="btn btn-primary"
				>Find next tag admin</button
			>

			<button onclick={() => tags.lastTag?.unfind()} class="btn btn-primary"
				>Unfind next tag admin</button
			>
		{/if}
		{#if tags.nextTag}
			<a href={tags.nextTag?.link} class="btn btn-primary">Open next tag in Google Maps</a>
		{/if}
	</div>
</div>
