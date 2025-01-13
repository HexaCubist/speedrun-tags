<script lang="ts">
	import { page } from '$app/state';
	import type { appStateType } from '$lib/appState.svelte';
	import Scoreboard from '$lib/components/dashboard/scoreboard.svelte';
	import { timer, type TagList } from '$lib/tags.svelte';
	import moment from 'moment';
	import { getContext, onMount } from 'svelte';

	let { data } = $props();
	let myAppState = getContext<appStateType>('appState');
	let tags = getContext<TagList>('tags');
</script>

<div class="bg-base-100 rounded-box m-2 overflow-clip overflow-x-auto shadow">
	<h2 class="m-4 mb-0 text-xl font-bold">Tags Found</h2>
	<table class="table">
		<!-- head -->
		<thead>
			<tr>
				<th></th>
				<th>Name</th>
				<th>Time Found</th>
				<th>Time to Find</th>
			</tr>
		</thead>
		<tbody>
			{#each tags.foundTags as tag, i}
				{@const lastTagFound = i === 0 ? undefined : tags.foundTags[i - 1]?.found}
				{#if tag.found}
					<tr>
						<td>
							<a href={tag.link}>
								{i + 1}
							</a>
						</td>
						<td>
							<a href={tag.link}>
								{tag.data.Name}
							</a>
						</td>
						<td>
							<a href={tag.link}>
								{#key timer.time}
									{moment(tag.found).fromNow()}
								{/key}
							</a>
						</td>
						<td>
							{#if !lastTagFound}
								<p></p>
							{:else}
								<a href={tag.link}>
									{#key timer.time}
										{moment(tag.found - lastTagFound).format('mm:ss')}
									{/key}
								</a>
							{/if}
						</td>
					</tr>
				{/if}
			{:else}
				<tr>
					<td colspan="4" class="text-center italic py-5">No tags found yet...</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<Scoreboard appState={myAppState} {tags}></Scoreboard>

<div class="m-2">
	<button onclick={() => appState.newSession()} class="btn btn-primary btn-block block text-center"
		>Start again</button
	>
</div>
