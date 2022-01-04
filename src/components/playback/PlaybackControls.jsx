import React from "react";
import { Fab, makeStyles } from "@material-ui/core";
import PauseIcon from "@material-ui/icons/Pause";
import PlayIcon from "@material-ui/icons/PlayArrow";
import SkipNext from "@material-ui/icons/SkipNext";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    bottom: -30,
    width: 140,
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    width: 65,
    height: 65,
  },
  icon: {
    width: 45,
    height: 45,
  },
});

const PlaybackControls = ({ playbackState, onPlayPauseClick, onSkipClick }) => {
  const classes = useStyles();

  if (playbackState === "stopped") {
    return null;
  }

  return (
    <div className={classes.root}>
      <Fab
        className={classes.button}
        color="primary"
        onClick={onPlayPauseClick}
      >
        {playbackState === "playing" ? (
          <PauseIcon className={classes.icon} />
        ) : (
          <PlayIcon className={classes.icon} />
        )}
      </Fab>
      <Fab className={classes.button} color="primary" onClick={onSkipClick}>
        <SkipNext className={classes.icon} />
      </Fab>
    </div>
  );
};

export default PlaybackControls;
