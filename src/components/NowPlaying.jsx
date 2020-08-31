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
import NothingPlaying from "./NothingPlaying";
import { useAdmin } from "hooks/admin";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  heading: {
    fontSize: "14px",
    fontWeight: "400",
    color: "#757575",
  },
  detail: {
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "column",
    alignItems: "center",
  },
  info: {
    paddingTop: "15px",
    flexBasis: "auto",
    textAlign: "center",
    margin: "10px",
  },
  secondaryInfo: {
    fontWeight: "500",
    color: "#757575",
  },
  artwork: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
});

const NowPlaying = () => {
  const classes = useStyles();

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
      <h3 className={classes.heading}>Now Playing</h3>
      <div className={classes.detail}>
        <div className={classes.artwork}>
          {artworkUrl && <Thumbnail url={artworkUrl} />}
          {isAdmin && (
            <PlaybackControls
              playbackState={playbackState}
              onClick={togglePlaybackState}
            />
          )}
        </div>
        <div className={classes.info}>
          <h2 className="title">{track.name}</h2>
          <h3 className={classes.secondaryInfo}>
            <ArtistSentence artists={track.artists} />
          </h3>
          <h3 className="album">{track.album.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
