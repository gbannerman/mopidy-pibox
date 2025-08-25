import React from "react";
import Thumbnail from "components/common/Thumbnail";
import ArtistSentence from "components/common/ArtistSentence";
import PlaybackControls from "./PlaybackControls";
import { togglePlaybackState, skipCurrentTrack } from "services/mopidy";
import NothingPlaying from "./NothingPlaying";
import { useAdmin } from "hooks/admin";
import { useSessionDetails } from "hooks/session";
import { useNowPlaying } from "hooks/nowPlaying";
import { useConfig } from "hooks/config";

const NowPlaying = () => {
  const { session, sessionLoading } = useSessionDetails();
  const { isAdmin } = useAdmin();
  const {
    config: { offline },
  } = useConfig();
  const { currentTrack, playbackState, artworkUrl } = useNowPlaying();

  if (!currentTrack) return <NothingPlaying />;

  return (
    <div className="px-2">
      {!sessionLoading && session && (
        <PlayingFrom offline={offline} playlistNames={session.playlistNames} />
      )}
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
          <h2 className="text-xl font-bold py-1">{currentTrack.name}</h2>
          <h3 className="text-base font-medium text-gray-400 py-1">
            <ArtistSentence
              artists={
                currentTrack.artists?.length
                  ? currentTrack.artists
                  : [{ name: "Unknown Artist" }]
              }
            />
          </h3>
          <h3 className="text-base font-medium text-gray-400 py-1 text-ellipsis whitespace-nowrap overflow-x-hidden">
            {currentTrack.album?.name ?? "Unknown Album"}
          </h3>
        </div>
      </div>
    </div>
  );
};

function PlayingFrom({ offline, playlistNames }) {
  return (
    <h3 className="text-sm font-normal text-gray-400 text-center py-1">
      {getPlayingFromText(offline, playlistNames)}
    </h3>
  );
}

function getPlayingFromText(offline, playlistNames) {
  if (offline) return "Playing from local library";

  return playlistNames.length === 1
    ? `Playing from: ${playlistNames[0]}`
    : `Playing from ${playlistNames.length} playlist${playlistNames.length > 1 ? "s" : ""}`;
}

export default NowPlaying;
