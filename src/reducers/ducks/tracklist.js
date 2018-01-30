export const UPDATE = 'tracklist/UPDATE';
export const TOGGLE_VOTE = 'tracklist/TOGGLE_VOTE';
export const TOGGLE_FETCHING = 'tracklist/TOGGLE_FETCHING';

export function reducer(state = [], action = {}) {
	switch (action.type) {
		case UPDATE:
			return action.payload;
		case TOGGLE_VOTE:
		console.log("GOT A VOTE: " + action.payload);
			return state.map(track =>
        (track.uri === action.payload) 
          ? {...track, voted: !track.voted}
          : track
      )
    case TOGGLE_FETCHING:
    	console.log("GOT A FETCHING: " + action.payload);
			return state.map(track =>
	      (track.uri === action.payload) 
	        ? {...track, fetching: !track.fetching}
	        : track
	    );
		default:
			return state;
	}
}

export function updateTracklist(tracklist) {
	return {type: UPDATE, payload: tracklist};
}

export function toggleTracklistVoted(uri) {
	return {type: TOGGLE_VOTE, payload: uri};
}

export function toggleTracklistFetching(uri) {
	return {type: TOGGLE_FETCHING, payload: uri};
}