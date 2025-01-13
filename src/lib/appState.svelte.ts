import { browser } from '$app/environment';
import { GpsLocation } from './location.svelte';

export enum UIStates {
	UnlockedDashboard,
	Finished
}

export class LocalStore<T> {
	value = $state<T>() as T;
	key = '';

	constructor(key: string, value: T) {
		this.key = key;
		this.value = value;

		if (browser) {
			const item = localStorage.getItem(key);
			if (item) this.value = this.deserialize(item);
		}

		$effect(() => {
			localStorage.setItem(this.key, this.serialize(this.value));
		});
	}

	serialize(value: T): string {
		return JSON.stringify(value);
	}

	deserialize(item: string): T {
		return JSON.parse(item);
	}
}

export function localStore<T>(key: string, value: T) {
	return new LocalStore(key, value);
}

export const appState = () => {
	const store = localStore('appState', {
		tagState: {} as Record<string, number | false>,
		uiState: [] as UIStates[],
		sessionID: Date.now().toString(),
		previousWins: {} as Record<string, Record<string, number>>
	});
	const res = store as typeof store & {
		location: GpsLocation;
		newSession: () => void;
	};
	res.location = new GpsLocation();
	res.newSession = () => {
		if (!confirm('Are you sure you want to start a new session?')) return;
		res.value.sessionID = Date.now().toString();
		res.value.tagState = {};
		res.value.uiState = [];
		window.setTimeout(() => {
			window.location.reload();
		}, 300);
	};
	if (!res.value.sessionID) res.newSession();
	if (!res.value.previousWins) res.value.previousWins = {};

	return res;
};

export type appStateType = ReturnType<typeof appState>;
