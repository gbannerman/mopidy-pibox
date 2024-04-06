import React from "react";

const defaultSessionContext = {
  playlistName: "Unknown Playlist",
  skipThreshold: 3,
  startedAt: null,
  playedTracks: [],
  remainingPlaylistTracks: [],
};

export const SessionContext = React.createContext(defaultSessionContext);

export const useSession = () => React.useContext(SessionContext);
