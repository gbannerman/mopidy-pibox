import axios from 'axios';

export function submitSkipVote(fingerprint, track) {
	return (axios.post('/pibox/api/vote', {
    uri: track.uri,
    fingerprint: fingerprint
	}));
}