import axios from "axios";
import MopidyConnection from "mopidy";
import { getFingerprint } from "./fingerprint";

let mopidy = null;
let connected = false;

export class PiboxError extends Error {
  constructor(message) {
    super(message);
    this.name = "PiboxError";
  }
}

const connectToMopidy = (webSocketUrl) =>
  new Promise((resolve) => {
    mopidy = new MopidyConnection({
      webSocketUrl,
    });

    mopidy.on("state", (event) => {
      console.debug(`Mopidy state change: ${event}`);
    });

    mopidy.on("state:online", () => {
      connected = true;
    });

    mopidy.on("state:offline", () => {
      connected = false;
    });

    mopidy.on("reconnectionPending", () => {
      connected = false;
    });

    mopidy.on("reconnecting", () => {
      connected = false;
    });

    resolve(mopidy);
  });

const connectToPibox = (websocketUrl) => {
  const piboxWebsocket = new WebSocket(websocketUrl);

  piboxWebsocket.onmessage = (message) => {
    var data = JSON.parse(message.data);

    let event;

    switch (data.type) {
      case "NEW_VOTE":
        event = new CustomEvent("pibox:newVote", {
          detail: data.payload,
        });
        break;

      case "SESSION_STARTED":
        event = new CustomEvent("pibox:sessionStart", {
          detail: data.payload,
        });
        break;

      case "SESSION_ENDED":
        event = new CustomEvent("pibox:sessionEnd", {
          detail: data.payload,
        });
        break;

      default:
        console.warn("Default pibox websocket statement hit");
        break;
    }

    document.dispatchEvent(event);
  };
};

export const initialiseMopidy = async () => {
  // eslint-disable-next-line no-restricted-globals
  const hostname = location.hostname;
  // eslint-disable-next-line no-restricted-globals
  const port = location.port ? `:${location.port}` : "";
  const baseWebsocketUrl = `ws://${hostname}${port}`;
  mopidy = await connectToMopidy(`${baseWebsocketUrl}/mopidy/ws/`);
  connectToPibox(`${baseWebsocketUrl}/pibox/ws`);
  return mopidy;
};

export const isConnected = () => connected;

export const getTracklist = async () => {
  const result = await axios.get("/pibox/api/tracklist/");
  return result.data.tracklist;
};

export const getCurrentTrack = () => mopidy.playback.getCurrentTrack();

export const getPlaybackState = () => mopidy.playback.getState();

export const getArtwork = (uri) =>
  new Promise((resolve) => {
    mopidy.library.getImages({ uris: [uri] }).then((result) => {
      resolve(result[uri][0].uri);
    });
  });

export const getHistory = async () => {
  const history = await mopidy.history.getHistory();
  const session = await getCurrentSession();

  const sessionHistory = history.filter((x) => x[0] >= session.startTime);
  return sessionHistory.map((tuple) => tuple[1].uri);
};

export const getCurrentSession = async () => {
  const result = await axios.get("/pibox/api/session");
  return result.data;
};

export const getSpotifyPlaylists = async () => {
  const playlists = await mopidy.playlists.asList();
  return playlists;
};

export const queueTrack = async (selectedTrack) => {
  const history = await getHistory();

  if (history.filter((uri) => uri === selectedTrack.uri).length > 0) {
    throw new PiboxError("Track has already been played");
  }

  const tracklist = await getTracklist();

  if (
    tracklist.filter((track) => track.info.uri === selectedTrack.uri).length > 0
  ) {
    throw new PiboxError("Track has already been queued");
  }

  await mopidy.tracklist.add({ tracks: [selectedTrack] });
  const updatedTracklist = [...tracklist, selectedTrack];
  return updatedTracklist;
};

export const startSession = async (skipThreshold, playlist) => {
  const result = await axios.post("/pibox/api/session", {
    skipThreshold,
    playlist,
  });
  return result.data;
};

export const endSession = async () => {
  const result = await axios.delete("/pibox/api/session");
  return result.data;
};

export const searchSpotify = (searchTerms) =>
  new Promise((resolve) => {
    mopidy.library
      .search({ query: { any: searchTerms }, uris: ["spotify:"], exact: false })
      .then((result) => {
        resolve(result[0].tracks || []);
      });
  });

export const voteToSkipTrack = async (uri) => {
  const fingerprint = getFingerprint();

  try {
    const result = await axios.post("/pibox/api/vote", {
      uri,
      fingerprint,
    });
    return result.data;
  } catch (error) {
    throw new PiboxError("User has already voted on this track");
  }
};

export const playIfStopped = async () => {
  const playbackState = await getPlaybackState();
  if (playbackState === "stopped") {
    mopidy.playback.play();
  }
};

export const togglePlaybackState = async () => {
  const currentPlaybackState = await getPlaybackState();
  if (currentPlaybackState === "paused") {
    mopidy.playback.resume();
  } else {
    mopidy.playback.pause();
  }
};

export const onConnectionChanged = (callback) =>
  mopidy.on("state", (event) => {
    switch (event) {
      case "state:online":
        callback(true);
        break;

      default:
        callback(false);
    }
  });

export const onPlaybackChanged = (callback) =>
  mopidy.on("event:playbackStateChanged", (playback) =>
    callback(playback.new_state)
  );

export const onTracklistChanged = (callback) =>
  mopidy.on("event:tracklistChanged", async () => {
    const tracklist = await getTracklist();
    callback(tracklist);
  });

export const onSessionStarted = (callback) =>
  document.addEventListener("pibox:sessionStart", (event) =>
    callback(event.detail)
  );

export const onSessionEnded = (callback) =>
  document.addEventListener("pibox:sessionEnd", () => callback());

export const onNewVote = (callback) =>
  document.addEventListener("pibox:newVote", (event) => callback(event.detail));
