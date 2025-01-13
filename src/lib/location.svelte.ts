import { browser } from '$app/environment';
import { onMount } from 'svelte';

export enum LocationState {
	unrequested,
	requested,
	accepted,
	rejected,
	complete
}

export class GpsLocation {
	state: LocationState = $state(LocationState.unrequested);
	lat: number | undefined = $state();
	lon: number | undefined = $state();
	acc: number | undefined = $state();
	heading: number | null = $state(null);
	private watchId: number | null = null;
	constructor() {
		$effect(() => {
			console.log('!!', this.state, this.lat, this.lon, this.acc, this.heading);
		});
		if (browser) {
			navigator.permissions.query({ name: 'geolocation' }).then((result) => {
				if (result.state === 'prompt') {
					this.request();
				}
				if (result.state === 'granted') {
					this.state = LocationState.accepted;
					this.request();
					this.watch();
				} else if (result.state === 'denied') {
					this.state = LocationState.rejected;
					result.onchange = () => {
						if (result.state === 'granted') {
							this.state = LocationState.accepted;
							this.request();
							this.watch();
						}
					};
				}
			});
		}
	}
	public request() {
		return new Promise<this>((resolve, reject) => {
			this.state = LocationState.requested;
			console.log('requesting');
			navigator.geolocation.getCurrentPosition(
				(position) => {
					console.log('got position', position);
					this.state = LocationState.complete;
					this.lat = position.coords.latitude;
					this.lon = position.coords.longitude;
					this.acc = position.coords.accuracy;
					this.heading = position.coords.heading;
					resolve(this);
				},
				(err) => {
					console.error(err);
					this.state = LocationState.rejected;
					reject(this);
				}
			);
		});
	}
	public watch() {
		if (this.watchId) {
			this.unwatch();
		}
		this.watchId = navigator.geolocation.watchPosition((position) => {
			this.state = LocationState.complete;
			this.lat = position.coords.latitude;
			this.lon = position.coords.longitude;
			this.acc = position.coords.accuracy;
			this.heading = position.coords.heading;
		});
	}

	public unwatch() {
		if (this.watchId) {
			navigator.geolocation.clearWatch(this.watchId);
			this.watchId = null;
		}
	}
}
