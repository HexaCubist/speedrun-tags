<script lang="ts">
	import { appState, UIStates, type appStateType } from '$lib/appState.svelte.js';
	import Dashboard from '$lib/components/dashboard/dashboard.svelte';
	import { LocationState } from '$lib/location.svelte';
	import { TagList } from '$lib/tags.svelte';
	import { getContext } from 'svelte';
	let { data } = $props();

	let myAppState = getContext<appStateType>('appState');
	let tags = getContext<TagList>('tags');
	let firstTag = $derived(tags.allTags[0]);
</script>

<div class="hero">
	<div class="hero-content text-justify">
		<div class="max-w-md px-2">
			{#if tags.nextTag === firstTag && !myAppState.value.uiState.includes(UIStates.UnlockedDashboard)}
				<h1 class="text-5xl font-bold">Secret Santa 🎄</h1>
				<div>
					<p class="mb-2">
						Hey Mike! For your secret santa this year, I've put together a bit of a challenge. It's
						a treasure hunt that will take you across the Kensington campus, with each location
						locked behind a timer.
					</p>
					<p>
						Each location will be given to you as compass directions from your current location.
						You'll need to find the location and tag your phone against the NFC card to unlock the
						next location.
					</p>
				</div>
				<ul class="steps steps-vertical">
					<li
						class="step"
						data-content={myAppState.location.state === LocationState.complete ? '✓' : undefined}
						class:step-primary={myAppState.location.state === LocationState.accepted ||
							LocationState.complete}
						class:step-danger={myAppState.location.state === LocationState.accepted ||
							LocationState.complete}
					>
						<div class="text-left">
							Allow Location Access
							{#if myAppState.location.state === LocationState.rejected}
								<button class="btn btn-sm btn-danger" onclick={myAppState.location.request}
									>Enable location permission to continue...</button
								>
							{:else if myAppState.location.state === LocationState.accepted}
								<button class="btn btn-sm btn-secondary" disabled>Loading...</button>
							{:else if myAppState.location.state === LocationState.unrequested}
								<button
									class="btn btn-sm btn-primary"
									onclick={() => {
										myAppState.location.request().then(() => {
											myAppState.location.state = LocationState.complete;
										});
									}}>Get location...</button
								>
							{/if}
						</div>
					</li>
					<li class="step" class:step-primary={firstTag.distance < 10}>
						<div class="text-left">
							Navigate to the first location ({Math.round(firstTag.distance)} metre{tags.allTags[0]
								.distance === 1
								? ''
								: 's'} away)

							{#if myAppState.location.state === LocationState.complete}
								<button
									class="btn btn-sm btn-primary"
									onclick={() => myAppState.value.uiState.push(UIStates.UnlockedDashboard)}
									>Get Started</button
								>
							{:else if myAppState.location.state === LocationState.accepted || myAppState.location.state === LocationState.requested}
								<button class="btn btn-sm btn-secondary" disabled
									>Getting GPS match (if this takes a long time reload the page)</button
								>
							{/if}
						</div>
					</li>
					<li class="step">Tag your phone against the NFC card</li>
				</ul>
				<br />
			{:else}
				<Dashboard {tags} />
			{/if}
		</div>
	</div>
</div>
