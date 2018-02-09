import * as toast from 'services/toast';
import * as pibox from 'services/pibox';

export const UPDATE = 'tracklist/UPDATE';
export const TOGGLE_VOTE = 'tracklist/TOGGLE_VOTE';
export const UPDATE_VOTE_COUNT = 'tracklist/UPDATE_VOTE_COUNT';
export const TOGGLE_FETCHING = 'tracklist/TOGGLE_FETCHING';

export function reducer(state = [], action = {}) {
	switch (action.type) {
		case UPDATE:
			return action.payload;
		case TOGGLE_VOTE:
			return state.map(track =>
        (track.info.uri === action.payload) 
          ? {...track, voted: !track.voted}
          : track
      );
		case UPDATE_VOTE_COUNT:
			return state.map(track =>
        (track.info.uri === action.payload.uri) 
          ? {...track, votes: action.payload.votes}
          : track
      );
    case TOGGLE_FETCHING:
			return state.map(track =>
	      (track.info.uri === action.payload) 
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

export function updateTracklistVoteCount(update) {
	return {type: UPDATE_VOTE_COUNT, payload: update};
}

export function toggleTracklistFetching(uri) {
	return {type: TOGGLE_FETCHING, payload: uri};
}

export function voteToSkip(track, fingerprint) {

	return function (dispatch, getState) {
		dispatch(toggleTracklistFetching(track));

		pibox.submitSkipVote(fingerprint, track.info.uri)
    .then((response) => {
      dispatch(toggleTracklistVoted(track.info.uri));
    })
    .catch((error) => {
      dispatch(toggleTracklistFetching(track.info.uri));
      if (error.response.data.code === '15') {
        dispatch(toggleTracklistVoted(track.info.uri));
        toast.warningToast("You have already voted to skip this track");
      } else {
        console.error(error.response);
        toast.warningToast("An error occurred, please try again");
      }
    });
	}
}

export function getTracklist() {

	return function (dispatch, getState) {

		pibox.getTracklist()
	  .then((response) => {
	    response.data.tracklist.map((track) => {
	      track.fetching = false;
	      track.voted = false;
	      return track;
	    });
	    dispatch(updateTracklist(response.data.tracklist));
	  })
	  .catch((error) => {
	    console.error(error.response);
	  	toast.warningToast("An error occurred when loading the tracklist");
	  });
	}
}