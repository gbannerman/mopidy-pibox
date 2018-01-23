export const UPDATE_TRACK = 'playback/UPDATE_TRACK';
export const UPDATE_IMAGE = 'playback/UPDATE_IMAGE';
export const UPDATE_STATE = 'playback/UPDATE_STATE';

export function reducer(state = {}, action = {}) {
	switch (action.type) {
		case UPDATE_TRACK:
			return Object.assign({}, state, { track: action.payload });
		case UPDATE_IMAGE:
			return Object.assign({}, state, { image: action.payload });
		case UPDATE_STATE:
			return Object.assign({}, state, { state: action.payload });
		default:
			return state;
	}
}

export function updateNowPlayingTrack(track) {
	return {type: UPDATE_TRACK, payload: track};
}

export function updateNowPlayingImage(imageUrl) {
	return {type: UPDATE_IMAGE, payload: imageUrl};
}

export function updatePlaybackState(playbackState) {
	return {type: UPDATE_STATE, payload: playbackState};
}