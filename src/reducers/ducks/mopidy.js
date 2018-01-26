export const UPDATE_CONNECTED = 'mopidy/UPDATE_CONNECTED';
export const UPDATE_FINGERPRINT = 'mopidy/UPDATE_FINGERPRINT';

export function reducer(state = {}, action = {}) {
	switch (action.type) {
		case UPDATE_CONNECTED:
			return Object.assign({}, state, { connected: action.payload });
		case UPDATE_FINGERPRINT:
			return Object.assign({}, state, { fingerprint: action.payload });
		default:
			return state;
	}
}

export function updateMopidyConnected(connected) {
	return {type: UPDATE_CONNECTED, payload: connected};
}

export function updateFingerprint(fingerprint) {
	return {type: UPDATE_FINGERPRINT, payload: fingerprint};
}