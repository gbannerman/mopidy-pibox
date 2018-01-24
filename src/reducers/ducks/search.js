import { getMopidy } from '../../App.js';

export const UPDATE_SEARCH_TERM = 'search/UPDATE_SEARCH_TERM';
export const REQUEST_RESULTS = 'search/REQUEST_RESULTS';
export const RECEIVE_RESULTS = 'search/RECEIVE_RESULTS';
export const FAILURE_RESULTS = 'search/FAILURE_RESULTS';

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

export function search(searchTerms) {
	return function (dispatch) {
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