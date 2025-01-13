import { browser } from '$app/environment';
import type { appStateType } from './appState.svelte';
import { distance } from '@turf/distance';
import { point } from '@turf/helpers';
import moment from 'moment';

export enum Status {
	Draft = 'draft',
	Published = 'published',
	Archived = 'archived'
}

export enum imagePresets {
	thumbnail = 'thumbnail',
	aspect = 'aspect-thumbnail',
	medium = 'medium',
	large = 'large',
	hero = 'hero',
	original = 'original'
}

export interface Image {
	id: string;
	src: Record<imagePresets, string>;
	alt: string;
	width: number;
	height: number;
	focal_point_x: number;
	focal_point_y: number;
}

export interface Location {
	coordinates: number[];
	type: 'Point';
}

export interface TagData {
	id: string;
	status: Status;
	sort: number;
	Name: string;
	Hint: string;
	hint_image: Image;
	location: Location;
}

export let timer = $state({ time: Date.now() });

if (browser) {
	setInterval(() => {
		timer.time = Date.now();
	}, 250);
}

const magicThreshold = 60 * 60 * 1000 * 5;

export class Tag {
	public data: TagData;
	public found: false | number = $state(false);
	public sinceFound = $derived.by(() => {
		if (this.found === false) return Infinity;
		const time = timer.time - this.found;
		if (time > magicThreshold) return '∞';
		return moment(time).format('mm:ss');
	});
	public distance = $derived.by(() => {
		if (!this.appState.location.lat || !this.appState.location.lon) return Infinity;
		const from = point([this.appState.location.lon, this.appState.location.lat]);
		const to = point([this.lon, this.lat]);
		console.log(from, to, distance(from, to, { units: 'meters' }));
		return Math.round(distance(from, to, { units: 'meters' }));
	});
	constructor(
		data: TagData,
		private appState: appStateType
	) {
		this.data = data;
		const { id, status, sort, Name, Hint, hint_image, location } = data;
		this.found = this.appState.value.tagState[this.data.id] || false;
	}
	get lat() {
		return this.data.location.coordinates[1];
	}
	get lon() {
		return this.data.location.coordinates[0];
	}
	get link() {
		return `http://maps.apple.com/?daddr=${this.lat},${this.lon}&dirflg=w`;
	}
	public find() {
		this.found = Date.now();
		this.appState.value.tagState[this.data.id] = Date.now();
	}
	public unfind() {
		this.found = false;
		this.appState.value.tagState[this.data.id] = false;
	}
}

export class TagList {
	nextTag = $derived.by(() => {
		return this.allTags.find((t) => !t.found);
	});
	lastTag = $derived.by(() => {
		return this.allTags.findLast((t) => t.found);
	});
	foundTags = $derived.by(() => {
		return this.allTags.filter((t) => t.found);
	});
	unfoundTags = $derived.by(() => {
		return this.allTags.filter((t) => !t.found);
	});
	constructor(public allTags: Tag[]) {}
	get allTagData() {
		return this.allTags.map((t) => t.data);
	}
	static fromData(data: TagData[], appState: appStateType) {
		return new TagList(data.map((t) => new Tag(t, appState)));
	}
}
