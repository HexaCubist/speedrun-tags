import { distance } from '@turf/distance';
import { point } from '@turf/helpers';
import type { TagList } from './tags.svelte';

export enum AwardType {
	Platinum = 'platinum',
	Gold = 'gold',
	Silver = 'silver',
	Bronze = 'bronze',
	None = 'none'
}

/**
 * Award times for a 5k run in milliseconds
 */
export const awardThresholds = {
	[AwardType.Platinum]: 20 * 60 * 1000,
	[AwardType.Gold]: 23 * 60 * 1000,
	[AwardType.Silver]: 26 * 60 * 1000,
	[AwardType.Bronze]: 28 * 60 * 1000,
	[AwardType.None]: Infinity
};

export const awardLabels = {
	[AwardType.Platinum]: '💎 Platinum',
	[AwardType.Gold]: '🥇 Gold',
	[AwardType.Silver]: '🥈 Silver',
	[AwardType.Bronze]: '🥉 Bronze',
	[AwardType.None]: 'No award'
};

/**
 * Calculate the award based on the tags and time
 * @param tags The tags to calculate the award for
 * @param time The time in seconds
 * @returns The award type
 */
export const calculateAward = (tags: TagList, time: number): AwardType => {
	// Calculate the distance between all points in order
	const distances = tags.allTags.map((tag, i) => {
		if (i === 0) return 0;
		const from = point([tags.allTags[i - 1].lon, tags.allTags[i - 1].lat]);
		const to = point([tag.lon, tag.lat]);
		return distance(from, to, { units: 'meters' });
	});
	const distanceSum = distances.reduce((acc, val) => acc + val, 0);
	// Scale time by distance
	const scalingFactor = distanceSum / 5000;
	const scaledTime = time / scalingFactor;
	for (const [award, threshold] of Object.entries(awardThresholds)) {
		if (scaledTime <= threshold) {
			return award as AwardType;
		}
	}
	return AwardType.None;
};

export const finishThresholds = (tags: TagList) => {
	const distances = tags.allTags.map((tag, i) => {
		if (i === 0) return 0;
		const from = point([tags.allTags[i - 1].lon, tags.allTags[i - 1].lat]);
		const to = point([tag.lon, tag.lat]);
		return distance(from, to, { units: 'meters' });
	});
	const distanceSum = distances.reduce((acc, val) => acc + val, 0);
	// Scale time by distance
	const scalingFactor = distanceSum / 5000;
	// Return copy of awardThresholds with scaled times

	return Object.fromEntries(
		Object.entries(awardThresholds).map(([award, threshold]) => {
			return [award, threshold * scalingFactor];
		})
	) as Record<AwardType, number>;
};
