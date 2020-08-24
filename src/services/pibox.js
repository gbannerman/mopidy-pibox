import axios from "axios";

export function submitSkipVote(fingerprint, uri) {
  return axios.post("/pibox/api/vote", {
    uri: uri,
    fingerprint: fingerprint,
  });
}

export function createNewSession(skipThreshold, playlist) {
  return axios.post("/pibox/api/session", {
    skipThreshold,
    playlist,
  });
}

export function getSession() {
  return axios.get("/pibox/api/session");
}

export function getVotes(uri) {
  return axios.get("/pibox/api/vote/" + uri);
}

export function getTracklist() {
  return axios.get("/pibox/api/tracklist/");
}
