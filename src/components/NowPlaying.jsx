import React, { useState } from "react";
import Thumbnail from "./Thumbnail.jsx";
import ArtistSentence from "./ArtistSentence.jsx";
import PlaybackControls from "./PlaybackControls.jsx";
import { useEffect } from "react";
import {
  getArtwork,
  getCurrentTrack,
  onPlaybackChanged,
  getPlaybackState,
  togglePlaybackState,
} from "services/mopidy";
import NothingPlaying from "./NothingPlaying.jsx";
import "../style/NowPlaying.css";

const NowPlaying = () => {
  const [artworkUrl, setArtworkUrl] = useState(null);
  const [track, setTrack] = useState(null);
  const [playbackState, setPlaybackState] = useState("stopped");

  useEffect(() => {
    const updateCurrentTrack = async () => {
      const currentTrack = await getCurrentTrack();
      setTrack(currentTrack);
    };

    const updatePlaybackState = async () => {
      const playbackState = await getPlaybackState();
      setPlaybackState(playbackState);
    };

    onPlaybackChanged(async () => {
      updateCurrentTrack();
      updatePlaybackState();
    });
    updateCurrentTrack();
    updatePlaybackState();
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
    <div>
      <h3 className="now-playing-heading">Now Playing</h3>
      <div className="now-playing">
        <div className="artwork-and-playback">
          {artworkUrl && <Thumbnail url={artworkUrl} />}
          <PlaybackControls
            playbackState={playbackState}
            onClick={togglePlaybackState}
          />
        </div>
        <div className="info">
          <h2 className="title">{track.name}</h2>
          <h3 className="artist">
            <ArtistSentence artists={track.artists} />
          </h3>
          <h3 className="album">{track.album.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
