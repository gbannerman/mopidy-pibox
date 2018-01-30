import { toast } from 'react-toastify';
import { css } from 'glamor';
import axios from 'axios';

export const UPDATE = 'tracklist/UPDATE';
export const TOGGLE_VOTE = 'tracklist/TOGGLE_VOTE';
export const TOGGLE_FETCHING = 'tracklist/TOGGLE_FETCHING';

export function reducer(state = [], action = {}) {
	switch (action.type) {
		case UPDATE:
			return action.payload;
		case TOGGLE_VOTE:
			return state.map(track =>
        (track.uri === action.payload) 
          ? {...track, voted: !track.voted}
          : track
      )
    case TOGGLE_FETCHING:
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

export function voteToSkip(track, fingerprint) {

	let warningToast = (message) => {
	  toast(message, {
	    autoClose: 3500,
	    className: css({
	      backgroundColor: "#FF9800",
	      color: "#FFFFFF"
	    })
	  });
	};

	return function (dispatch, getState) {
		dispatch(toggleTracklistFetching(track));

		axios.post('/pibox/api/vote', {
      uri: track.uri,
      fingerprint:fingerprint
    })
    .then((response) => {
      dispatch(toggleTracklistVoted(track.uri));
    })
    .catch((error) => {
      dispatch(toggleTracklistFetching(track.uri));
      if (error.response.data.code === '15') {
        dispatch(toggleTracklistVoted(track.uri));
        warningToast("You have already voted to skip this track");
      } else {
        console.error(error.response);
        warningToast("An error occurred, please try again");
      }
    });
	}
}