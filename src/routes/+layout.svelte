<script lang="ts">
	import '../app.postcss';
	import Icon from '@iconify/svelte';
	import { page } from '$app/state';
	let { children } = $props();
</script>

<div class="flex h-screen flex-col">
	<div class="wrapper grow">
		{@render children()}
	</div>

	<div class="dock">
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
