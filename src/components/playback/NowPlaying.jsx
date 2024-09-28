import React, { useState } from "react";
import Thumbnail from "components/common/Thumbnail";
import ArtistSentence from "components/common/ArtistSentence";
import PlaybackControls from "./PlaybackControls";
import { useEffect } from "react";
import {
  getArtwork,
  getCurrentTrack,
  onPlaybackChanged,
  getPlaybackState,
  togglePlaybackState,
  skipCurrentTrack,
} from "services/mopidy";
import NothingPlaying from "./NothingPlaying";
import { useAdmin } from "hooks/admin";
import { useSession } from "hooks/session";

const NowPlaying = () => {
  const { playlistNames } = useSession();

  const [artworkUrl, setArtworkUrl] = useState(null);
  const [track, setTrack] = useState(null);
  const [playbackState, setPlaybackState] = useState("stopped");
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const updateCurrentTrack = async () => {
      const currentTrack = await getCurrentTrack();
      setTrack(currentTrack);
    };

    const updatePlaybackState = async () => {
      const playbackState = await getPlaybackState();
      setPlaybackState(playbackState);
    };

    const cleanup = onPlaybackChanged(async () => {
      updateCurrentTrack();
      updatePlaybackState();
    });
    updateCurrentTrack();
    updatePlaybackState();

    return cleanup;
  }, []);

  useEffect(() => {
    const updateArtwork = async () => {
      if (track) {
        const artwork = await getArtwork(track.uri);
        setArtworkUrl(artwork);
      }
    };
    updateArtwork();
  }, [setArtworkUrl, track]);

  if (!track) {
    return <NothingPlaying />;
  }

  return (
    <div className="px-2">
      <h3 className="text-sm font-normal text-gray-400 text-center py-1">
        {playlistNames.length === 1
          ? `Playing from: ${playlistNames[0]}`
          : `Playing from ${playlistNames.length} playlist${playlistNames.length > 1 ? "s" : ""}`}
      </h3>
      <div className="flex flex-col items-center justify-evenly">
        <div className="flex flex-col items-center justify-end relative">
          <Thumbnail url={artworkUrl} />
          {isAdmin && (
            <PlaybackControls
              playbackState={playbackState}
              onPlayPauseClick={togglePlaybackState}
              onSkipClick={skipCurrentTrack}
            />
          )}
        </div>
        <div className="pt-7 basis-auto text-center m-2 max-w-full">
          <h2 className="text-xl font-bold py-1">{track.name}</h2>
          <h3 className="text-base font-medium text-gray-400 py-1">
            <ArtistSentence artists={track.artists} />
          </h3>
          <h3 className="text-base font-medium text-gray-400 py-1 text-ellipsis whitespace-nowrap overflow-x-hidden">
            {track.album.name}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
