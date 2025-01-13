<script lang="ts">
	import { page } from '$app/state';
	import type { appStateType } from '$lib/appState.svelte';
	import { awardLabels, AwardType, calculateAward, finishThresholds } from '$lib/award';
	import Scoreboard from '$lib/components/dashboard/scoreboard.svelte';
	import { timer, type TagList } from '$lib/tags.svelte';
	import moment from 'moment';
	import { getContext, onMount } from 'svelte';

	let { appState, tags }: { appState: appStateType; tags: TagList } = $props();

	const prevWins = $derived(
		Object.keys(appState.value.previousWins)
			.map((winID) => {
				const checkpoints = appState.value.previousWins[winID];
				const foundTags = Object.keys(checkpoints);
				const first = foundTags[0];
				const lastTag = foundTags[foundTags.length - 1];
				const time = checkpoints[lastTag] - checkpoints[first];
				const isCurrent = winID === appState.value.sessionID;
				return {
					duration: time,
					finishTime: checkpoints[lastTag],
					award: calculateAward(tags, time),
					isCurrent,
					checkpoints
				};
			})
			.sort((a, b) => a.duration - b.duration)
	);

	const thresholds = finishThresholds(tags);

	let currentWin = $derived(prevWins.find((win) => win.isCurrent));
</script>

<div class="mx-2">
	<div class="stats w-full bg-slate-800 text-slate-100 shadow">
		<div class="stat text-slate-50" class:bg-green-700={currentWin?.award === AwardType.Platinum}>
			<div class="stat-title text-slate-100">{awardLabels[AwardType.Platinum]}</div>
			<div class="stat-value text-lg">{moment(thresholds.platinum, 'x').format('mm:ss.SS')}</div>
		</div>
		<div class="stat text-amber-300" class:bg-green-700={currentWin?.award === AwardType.Gold}>
			<div class="stat-title text-amber-400">{awardLabels[AwardType.Gold]}</div>
			<div class="stat-value text-lg">{moment(thresholds.gold, 'x').format('mm:ss.SS')}</div>
		</div>
		<div class="stat text-gray-300" class:bg-green-700={currentWin?.award === AwardType.Silver}>
			<div class="stat-title text-gray-400">{awardLabels[AwardType.Silver]}</div>
			<div class="stat-value text-lg">{moment(thresholds.silver, 'x').format('mm:ss.SS')}</div>
		</div>
		<div class="stat text-orange-300" class:bg-green-700={currentWin?.award === AwardType.Bronze}>
			<div class="stat-title text-orange-400">{awardLabels[AwardType.Bronze]}</div>
			<div class="stat-value text-lg">{moment(thresholds.bronze, 'm').format('mm:ss.SS')}</div>
		</div>
	</div>
</div>

{#if currentWin}
	<div class="rounded-box bg-base-100 m-2 p-4 shadow">
		{#if currentWin.award !== AwardType.None}
			<h3 class="font-bold">Congrats on getting {awardLabels[currentWin.award]}!</h3>
			<p class="text-balance">
				You found all the tags in {moment.duration(currentWin.duration, 'milliseconds').humanize()}!
				Speak to Zac to claim your prize ❤️
			</p>
		{:else}
			<p>Keep going! You can do it!</p>
		{/if}
	</div>
{/if}

{#if Object.keys(appState.value.previousWins).length > 0}
	<div class="bg-base-100 rounded-box m-2 overflow-clip overflow-x-auto shadow">
		<h2 class="m-4 mb-0 text-xl font-bold">Scoreboard</h2>
		<table class="table">
			<!-- head -->
			<thead>
				<tr>
					<th>Time Found</th>
					<th>Time to Find</th>
					<th>Award</th>
				</tr>
			</thead>
			<tbody>
				{#each prevWins as win, i}
					<tr class:bg-accent={win.isCurrent} class:text-accent-content={win.isCurrent}>
						<td>
							{moment(win.finishTime).fromNow()}
						</td>
						<td>
							{moment(win.duration, 'x').format('mm:ss.SS')}
						</td>
						<td>
							{awardLabels[win.award]}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
