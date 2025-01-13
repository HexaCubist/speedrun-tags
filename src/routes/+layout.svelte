<script lang="ts">
	import '../app.postcss';
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';
	import { appState, UIStates } from '$lib/appState.svelte';
	import { TagList } from '$lib/tags.svelte';
	import { onMount, setContext } from 'svelte';
	import { LocationState } from '$lib/location.svelte';
	import JSConfetti from 'js-confetti';

	let { children, data } = $props();
	let myAppState = appState();
	setContext('appState', myAppState);
	let tags = TagList.fromData(data.tags, myAppState);
	setContext('tags', tags);

	let jsConfetti: JSConfetti | undefined;
	onMount(() => {
		jsConfetti = new JSConfetti();
	});
	let lastNumFound = tags.foundTags.length;
	$effect(() => {
		if (tags.foundTags.length > lastNumFound) {
			jsConfetti?.addConfetti();
			console.log('Confetti!');
		}
		lastNumFound = tags.foundTags.length;
	});
</script>

<svelte:head>
	<title>Grand(er) Challenge</title>
	<meta name="description" content="A scavenger hunt for secret santa" />
</svelte:head>

<div class="bg-base-200 h-screen">
	<div class="wrapper h-full overflow-x-hidden overflow-y-auto pb-20">
		{@render children()}
	</div>

	<div class="fixed bottom-0 w-full">
		<div class="bg-base-100 w-full">
			<div class="dock relative">
				<a class:dock-active={page.route.id === '/'} href="/">
					<Icon icon="material-symbols:home-outline-rounded" />
					<span class="dock-label">Home</span>
				</a>

				<a class:dock-active={page.route.id === '/map'} href="/map">
					<Icon icon="material-symbols:map-outline-rounded" />
					<span class="dock-label">Map</span>
				</a>

				<a class:dock-active={page.route.id === '/info'} href="/info">
					<Icon icon="material-symbols:info-outline-rounded" />
					<span class="dock-label">Info</span>
				</a>
			</div>
		</div>
		<div class="bg-base-100 bottom-0 flex h-4 w-full p-0.5">
			<progress
				class="progress bottom-0 h-full grow"
				value={tags.foundTags.length}
				max={data.tags.length}
			></progress>
			<p class="relative z-10 px-2 text-center text-xs leading-none text-nowrap">
				{tags.foundTags.length} / {data.tags.length}
			</p>
		</div>
	</div>
</div>
