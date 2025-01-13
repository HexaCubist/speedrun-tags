<script lang="ts">
	import { page } from '$app/state';
	import type { appStateType } from '$lib/appState.svelte';
	import { timer, type TagList } from '$lib/tags.svelte';
	import moment from 'moment';
	import { getContext, onMount } from 'svelte';

	let { data } = $props();
	let myAppState = getContext<appStateType>('appState');
	let tags = getContext<TagList>('tags');
</script>

<div class="bg-base-100 m-2 overflow-clip overflow-x-auto rounded-xl shadow">
	<table class="table">
		<!-- head -->
		<thead>
			<tr>
				<th></th>
				<th>Name</th>
				<th>Time Found</th>
			</tr>
		</thead>
		<tbody>
			{#each tags.foundTags as tag, i}
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
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>
