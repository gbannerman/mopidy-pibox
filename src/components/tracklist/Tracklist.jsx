import React, { useState, useEffect } from "react";
import TracklistItem from "./TracklistItem.jsx";
import {
  getTracklist,
  onTracklistChanged,
  voteToSkipTrack,
  PiboxError,
} from "services/mopidy";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";
import { useSession } from "hooks/session.js";

const useStyles = makeStyles({
  root: {
    maxWidth: "400px",
    margin: "0 auto 30px",
  },
  title: {
    margin: "0px 10px",
    fontWeight: "400",
    color: "#757575",
    borderBottom: "1px solid #d5d0d0",
  },
  more: {
    margin: 10,
    textAlign: "center",
    padding: 15,
  },
});

const Tracklist = ({ display }) => {
  const classes = useStyles();

  const { skipThreshold } = useSession();

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

  const queueLength = tracklist.length - 1;
  const tracksNotShown = queueLength - display;

  const tracklistItems = tracklist
    .slice(1, 1 + display)
    .map((track) => (
      <TracklistItem
        key={track.info.uri}
        track={track}
        skipThreshold={skipThreshold}
        buttonEnabled={!(votePending || track.voted)}
        onVoteClick={generateSkipHandler(track)}
      />
    ));

  return (
    <>
      <div className={classes.root}>
        {queueLength > 0 && (
          <div className={classes.title}>
            {queueLength} song{queueLength !== 1 ? "s" : ""} queued
          </div>
        )}
        {tracklistItems}
        {tracksNotShown > 0 && (
          <Card className={classes.more}>+ {tracksNotShown} more</Card>
        )}
      </div>
    </>
  );
};

export default Tracklist;
