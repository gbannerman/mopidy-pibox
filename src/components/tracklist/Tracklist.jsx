import React, { useState, useEffect } from "react";
import TracklistItem from "./TracklistItem.jsx";
import {
  getTracklist,
  onTracklistChanged,
  voteToSkipTrack,
  PiboxError,
} from "services/mopidy";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    maxWidth: "400px",
    margin: "0 auto",
  },
});

const Tracklist = ({ display }) => {
  const classes = useStyles();

  const [tracklist, setTracklist] = useState([]);
  const [votePending, setVotePending] = useState(false);

  const updateTracklist = async () => {
    const tracklist = await getTracklist();
    setTracklist(tracklist);
  };

  useEffect(() => {
    onTracklistChanged(async () => {
      updateTracklist();
    });
    updateTracklist();
  }, []);

  const generateSkipHandler = (track) => async () => {
    const trackUri = track.info.uri;
    const setTrackAsVoted = () => {
      updateTracklist();
      setTracklist(
        [...tracklist].map((t) =>
          t.info.uri === trackUri ? { ...t, voted: true } : t
        )
      );
    };

    setVotePending(true);
    try {
      await voteToSkipTrack(trackUri);
      setTrackAsVoted();
    } catch (e) {
      if (e instanceof PiboxError) {
        setTrackAsVoted();
      }
    }
    setVotePending(false);
  };

  const tracklistItems = tracklist
    .slice(1, 1 + display)
    .map((track) => (
      <TracklistItem
        key={track.info.uri}
        track={track}
        skipThreshold={2}
        buttonEnabled={!(votePending || track.voted)}
        onVoteClick={generateSkipHandler(track)}
      />
    ));

  return <div className={classes.root}>{tracklistItems}</div>;
};

export default Tracklist;
