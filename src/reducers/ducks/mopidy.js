export const UPDATE_CONNECTED = 'mopidy/UPDATE_CONNECTED';

export function reducer(state = {}, action = {}) {
	switch (action.type) {
		case UPDATE_CONNECTED:
			return Object.assign({}, state, { connected: action.payload });
		default:
			return state;
	}
}

export function updateMopidyConnected(connected) {
	return {type: UPDATE_CONNECTED, payload: connected};
}