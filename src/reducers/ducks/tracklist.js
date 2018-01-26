export const UPDATE = 'tracklist/UPDATE';

export function reducer(state = [], action = {}) {
	switch (action.type) {
		case UPDATE:
			return action.payload;
		default:
			return state;
	}
}

export function updateTracklist(tracklist) {
	return {type: UPDATE, payload: tracklist};
}