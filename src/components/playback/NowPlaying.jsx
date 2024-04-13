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
import { makeStyles } from "@material-ui/core/styles";
import { useSession } from "hooks/session";

const useStyles = makeStyles({
  heading: {
    fontSize: "14px",
    fontWeight: "400",
    color: "#757575",
    textAlign: "center",
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
  primaryInfo: {
    fontSize: "20px",
  },
  secondaryInfo: {
    fontSize: "16px",
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

  const { playlistName } = useSession();

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
    <div>
      <h3 className={classes.heading}>Playing from: {playlistName} </h3>
      <div className={classes.detail}>
        <div className={classes.artwork}>
          <Thumbnail url={artworkUrl} />
          {isAdmin && (
            <PlaybackControls
              playbackState={playbackState}
              onPlayPauseClick={togglePlaybackState}
              onSkipClick={skipCurrentTrack}
            />
          )}
        </div>
        <div className={classes.info}>
          <h2 className={classes.primaryInfo}>{track.name}</h2>
          <h3 className={classes.secondaryInfo}>
            <ArtistSentence artists={track.artists} />
          </h3>
          <h3 className={classes.secondaryInfo}>{track.album.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
