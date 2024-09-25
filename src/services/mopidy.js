import axios from "axios";
import MopidyConnection from "mopidy";
import { getFingerprint } from "./fingerprint";
import { BACKEND_PRIORITY_ORDER } from "components/search/Search";

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
  const hostname = location.hostname;
  const port = location.port ? `:${location.port}` : "";
  const protocol =
    typeof document !== "undefined" && document.location.protocol === "https:"
      ? "wss://"
      : "ws://";
  const baseWebsocketUrl = `${protocol}${hostname}${port}`;
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
      const artworkUri = result[uri].length ? result[uri][0].uri : "";
      resolve(artworkUri);
    });
  });

export const getHistory = async () => {
  const history = await mopidy.history.getHistory();
  const session = await getCurrentSession();

  const sessionHistory = history.filter((x) => x[0] >= session.startTime);
  return sessionHistory.map((tuple) => tuple[1].uri);
};

export const getConfig = async () => {
  const result = await axios.get("/pibox/config");
  return result.data;
};

export const getCurrentSession = async () => {
  const result = await axios.get("/pibox/api/session");
  return result.data;
};

export const getPlaylists = async () => {
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

export const startSession = async (
  skipThreshold,
  playlist,
  automaticallyStartPlaying,
) => {
  const result = await axios.post("/pibox/api/session", {
    skipThreshold,
    playlist,
    autoStart: automaticallyStartPlaying,
  });
  return result.data;
};

export const endSession = async () => {
  const result = await axios.delete("/pibox/api/session");
  return result.data;
};

export const searchLibrary = (searchTerms) =>
  new Promise((resolve) => {
    mopidy.library
      .search({
        query: { any: searchTerms },
        exact: false,
      })
      .then((result) => {
        result.sort((a, b) => {
          const [backendA] = a.uri.split(":");
          const [backendB] = b.uri.split(":");
          const resultA = BACKEND_PRIORITY_ORDER.indexOf(backendA);
          return (
            (resultA === -1 ? Number.MAX_VALUE : resultA) -
            BACKEND_PRIORITY_ORDER.indexOf(backendB)
          );
        });
        const results = result.reduce((tracks, backendResult) => {
          tracks.push(...(backendResult.tracks || []));
          return tracks;
        }, []);
        resolve(results);
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
  } catch {
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

export const skipCurrentTrack = async () => {
  await mopidy.playback.next();
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

export const onPlaybackChanged = (callback) => {
  const fn = (playback) => callback(playback.new_state);
  mopidy.on("event:playbackStateChanged", fn);
  return () => mopidy.off("event:playbackStateChanged", fn);
};

export const onTracklistChanged = (callback) => {
  const fn = async () => {
    const tracklist = await getTracklist();
    callback(tracklist);
  };
  mopidy.on("event:tracklistChanged", fn);
  return () => mopidy.off("event:tracklistChanged", fn);
};

export const onTrackPlaybackEnded = (callback) => {
  const fn = () => callback();
  mopidy.on("event:trackPlaybackEnded", fn);
  return () => mopidy.off("event:trackPlaybackEnded", fn);
};

export const onSessionStarted = (callback) => {
  const fn = (event) => callback(event.detail);
  document.addEventListener("pibox:sessionStart", fn);
  return () => document.removeEventListener("pibox:sessionStart", fn);
};

export const onSessionEnded = (callback) => {
  const fn = () => callback();
  document.addEventListener("pibox:sessionEnd", fn);
  return () => document.removeEventListener("pibox:sessionEnd", fn);
};
