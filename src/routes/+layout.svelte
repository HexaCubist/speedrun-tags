<script lang="ts">
	import '../app.postcss';
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';
	let { children, data } = $props();

	let progress = $state(0);
</script>

<div class="bg-base-200 flex h-screen flex-col">
	<div class="wrapper grow">
		{@render children()}
	</div>

	<div class="bg-base-100 fixed bottom-0 w-full">
		<div class="dock relative mb-4">
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
	<div class="bottom-0 flex h-4 w-full p-0.5">
		<progress class="progress bottom-0 h-full grow" value={progress} max={data.tags.length}
		></progress>
		<p class="relative z-10 px-2 text-center text-xs leading-none text-nowrap">
			{progress} / {data.tags.length}
		</p>
	</div>
</div>
