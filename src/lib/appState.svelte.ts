import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { GpsLocation } from './location.svelte';
import { persisted } from 'svelte-persisted-store';

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

		if (browser)
			window.setInterval(() => {
				const newData = localStorage.getItem(this.key);
				if (newData && newData !== this.serialize(this.value)) {
					this.value = this.deserialize(newData);
				}
			}, 500);
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
	const store = persisted('appState-persisted', {
		tagState: {} as Record<string, number | false>,
		uiState: [] as UIStates[],
		sessionID: Date.now().toString(),
		previousWins: {} as Record<string, Record<string, number>>
	});
	let restartingSession = false;
	const res = {
		store,
		newSession() {
			if (!confirm('Are you sure you want to start a new session?')) return;
			restartingSession = true;
			store.update((v) => ({
				...v,
				sessionID: Date.now().toString(),
				tagState: {},
				uiState: []
			}));
		},
		location: new GpsLocation()
	};
	if (!get(store).sessionID && !restartingSession) res.newSession();

	return res;
};

export type appStateType = ReturnType<typeof appState>;
