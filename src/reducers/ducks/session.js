import * as pibox from 'services/pibox';
import { getMopidy } from '../../App.js';

export const SEND_FORM = 'session/SEND_FORM';
export const SUCCESS_FORM = 'session/SUCCESS_FORM';
export const FAILURE_FORM = 'session/FAILURE_FORM';
export const REQUEST_PLAYLISTS = 'session/REQUEST_PLAYLISTS';
export const SUCCESS_PLAYLISTS = 'session/SUCCESS_PLAYLISTS';
export const FAILURE_PLAYLISTS = 'session/FAILURE_PLAYLISTS';
export const RETRIEVE_CURRENT = 'session/RETRIEVE_CURRENT';
export const SUCCESS_CURRENT = 'session/SUCCESS_CURRENT';
export const FAILURE_CURRENT = 'session/FAILURE_CURRENT';
// export const TOGGLE_FETCHING = 'session/TOGGLE_FETCHING';

export function reducer(state = {}, action = {}) {
	switch (action.type) {
		case SEND_FORM:
			return Object.assign({}, state, { sending: true, error: null});
		case SUCCESS_FORM:
			return Object.assign({}, state, { sending: false, started: true, skipThreshold: action.payload });
		case FAILURE_FORM:
			return Object.assign({}, state, { sending: false, error: action.payload });
		case REQUEST_PLAYLISTS:
			return Object.assign({}, state, { fetching: true, error: null });
		case SUCCESS_PLAYLISTS:
			return Object.assign({}, state, { fetching: false, playlists: action.payload });
		case FAILURE_PLAYLISTS:
			return Object.assign({}, state, { fetching: false, error: action.payload });
		case RETRIEVE_CURRENT:
			return Object.assign({}, state, { fetching: true, error: null });
		case SUCCESS_CURRENT:
			return Object.assign({}, state, { fetching: false, started: action.payload.started, skipThreshold: action.payload.skipThreshold });
		case FAILURE_CURRENT:
			return Object.assign({}, state, { fetching: false, error: action.payload });
		// case UPDATE_STARTED:
		// 	return Object.assign({}, state, { started: action.payload });
		default:
			return state;
	}
}

export function sendSessionForm() {
	return {type: SEND_FORM};
}

export function successSessionForm(skipThreshold) {
	return {type: SUCCESS_FORM, payload: skipThreshold};
}

export function failureSessionForm(error) {
	return {type: FAILURE_FORM, payload: error}
}

export function requestPlaylists() {
	return {type: REQUEST_PLAYLISTS};
}

export function successPlaylists(playlists) {
	return {type: SUCCESS_PLAYLISTS, payload: playlists};
}

export function failurePlaylists(error) {
	return {type: FAILURE_PLAYLISTS, payload: error}
}

export function retrieveCurrentSession() {
	return {type: RETRIEVE_CURRENT};
}

export function successCurrentSession(session) {
	return {type: SUCCESS_CURRENT, payload: session};
}

export function failureCurrentSession(error) {
	return {type: FAILURE_CURRENT, payload: error}
}

// export function updateSessionStarted(started) {
// 	return {type: UPDATE_STARTED, payload: started};
// }

export function submitSessionForm(values) {

	return function (dispatch, getState) {
		dispatch(sendSessionForm());

    pibox.createNewSession(values.skips, values.playlist)
    .then((response) => {
      dispatch(successSessionForm(values.skips));
    })
    .catch((error) => {
      console.error(error.response);
      dispatch(failureSessionForm());
    });
	}
}

export function loadPlaylists() {

	return function (dispatch, getState) {
		dispatch(requestPlaylists());

    getMopidy().playlists.asList()
    .then((response) => {
      dispatch(successPlaylists(response));
    })
    .catch((error) => {
      console.error(error.response);
      dispatch(failurePlaylists());
    });
	}
}

export function retrieveSession() {

	return function (dispatch, getState) {
		dispatch(retrieveCurrentSession())

		pibox.getSession()
    .then((response) => {
      dispatch(successCurrentSession(response.data))
    })
    .catch((error) => {
      console.error(error.response);
      dispatch(failureCurrentSession());
    });
	}
}