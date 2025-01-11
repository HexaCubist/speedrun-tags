enum LocationState {
	unrequested,
	requested,
	accepted,
	rejected,
	complete
}

export class Location {
	state: LocationState;
	lat: number;
	lon: number;
	constructor(self) {
		self.state = LocationState.unrequested;
	}
	request() {
		this.state = LocationState.requested;
		navigator.geolocation.getCurrentPosition((position) => {
			this.state = LocationState.accepted;
			this.lat = position.coords.latitude;
			this.lon = position.coords.longitude;
			position.coords.accuracy;
		});
	}
}
