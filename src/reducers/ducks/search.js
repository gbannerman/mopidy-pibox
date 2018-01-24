import { getMopidy } from '../../App.js';
import { toast } from 'react-toastify';

export const UPDATE_SEARCH_TERM = 'search/UPDATE_SEARCH_TERM';
export const REQUEST_RESULTS = 'search/REQUEST_RESULTS';
export const RECEIVE_RESULTS = 'search/RECEIVE_RESULTS';
export const FAILURE_RESULTS = 'search/FAILURE_RESULTS';
export const CLEAR_RESULTS = 'search/CLEAR_RESULTS';

export function reducer(state = {fetching: false}, action = {}) {
	switch (action.type) {
		case UPDATE_SEARCH_TERM:
			return Object.assign({}, state, { term: action.payload });
		case REQUEST_RESULTS:
			return Object.assign({}, state, { fetching: true });
		case 	RECEIVE_RESULTS:
			return Object.assign({}, state, { fetching: false, results: action.payload });
		case FAILURE_RESULTS:
			return Object.assign({}, state, { fetching: false, error: action.payload });
		case 	CLEAR_RESULTS:
			return Object.assign({}, state, { results: [] });
		default:
			return state;
	}
}

export function updateSearchTerm(searchTerm) {
	return {type: UPDATE_SEARCH_TERM, payload: searchTerm};
}

export function requestSearchResults() {
	return {type: REQUEST_RESULTS};
}

export function receiveSearchResults(searchResults) {
	return {type: RECEIVE_RESULTS, payload: searchResults};
}

export function failureSearchResults(error) {
	return {type: FAILURE_RESULTS, payload: error};
}

export function clearSearchResults(error) {
	return {type: CLEAR_RESULTS};
}

export function search(searchTerms) {
	return function (dispatch, getState) {
		console.log(getState());
		dispatch(requestSearchResults());

		getMopidy().library.search({'any': searchTerms}, ['spotify:'], false)
		.then((results) => {
      if (results[0]) {
      	dispatch(updateSearchTerm(searchTerms.join(' ')));
        dispatch(receiveSearchResults(results[0].tracks));
      } else {
        dispatch(failureSearchResults("No results"));
      }
    })
    .catch((err) => dispatch(failureSearchResults(err)));
	}
}

export function queueTrack(selectedTrack, validCallback) {
	return function (dispatch, getState) {
		getMopidy().history.getHistory().done((history) => {
			if (history.filter(tuple => (tuple[1].uri === selectedTrack.uri)).length > 0) {
				// SEND WARNING
				let message = "This track has already been played";
				toast.warn(message, {
					position: toast.POSITION.BOTTOM_CENTER,
					autoClose: 3500
				});
			} else if (getState().tracklist.filter(track => (track.uri === selectedTrack.uri)).length > 0) {
				// SEND WARNING
				let message = "This track has already been queued";
				toast.warn(message, {
					position: toast.POSITION.BOTTOM_CENTER,
					autoClose: 3500
				});
			} else {
				getMopidy().tracklist.add([selectedTrack], null, null, null).done(() => {
					// SEND INFO
					let message = selectedTrack.name + " was added to the queue";
					toast.info(message, {
						position: toast.POSITION.BOTTOM_CENTER
					});
					if (getState().playback.state === 'stopped') {
						getMopidy().playback.play();
					}
					validCallback();
				});
			}
		});
	}
}