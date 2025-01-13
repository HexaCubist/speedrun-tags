<script lang="ts">
	import { type TagList } from '$lib/tags.svelte';
	import { GpsLocation } from '$lib/location.svelte';
	import type { Tag } from '$lib/tags.svelte';
	import Icon from '@iconify/svelte';

	let { userLocation, tagList, tag }: { userLocation: GpsLocation; tagList: TagList; tag: Tag } =
		$props();
	let isCurrent = $derived(tag.data.id === tagList.nextTag?.data.id);
	let isFuture = $derived(!!tagList.unfoundTags.find((t) => t.data.id === tag.data.id));
	let isPast = $derived(!!tagList.foundTags.find((t) => t.data.id === tag.data.id));
	$effect(() => console.log(isCurrent, isFuture, isPast));
</script>

<div class="tooltip relative" data-tip="Open Map">
	{#if isCurrent}
		<div class="ping absolute h-7 w-7 animate-ping rounded-full bg-orange-400 opacity-50"></div>
	{/if}
	<a
		class="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-md transition"
		class:bg-orange-400={isCurrent}
		class:bg-red-400={!isCurrent && isFuture}
		class:bg-green-600={isPast}
		href={tag.link}
	>
		<div class="wrapper scale-150 transition">
			<Icon icon="material-symbols:nfc-outline-rounded" class="text-white" />
		</div>
	</a>
</div>

<div class="bg-green-600 bg-orange-400 bg-red-400"></div>
