import React from "react";
import { Fab } from "@material-ui/core";
import PauseIcon from "@material-ui/icons/Pause";
import PlayIcon from "@material-ui/icons/PlayArrow";
import "../style/PlaybackControls.css";

const PlaybackControls = ({ playbackState, onClick }) => {
  const iconStyle = {
    width: 45,
    height: 45,
  };

  const buttonStyle = {
    position: "absolute",
    width: 65,
    height: 65,
    bottom: -30,
  };

  if (playbackState === "stopped") {
    return null;
  }

  return (
    <Fab style={buttonStyle} color="primary" onClick={onClick}>
      {playbackState === "playing" ? (
        <PauseIcon style={iconStyle} />
      ) : (
        <PlayIcon style={iconStyle} />
      )}
    </Fab>
  );
};

export default PlaybackControls;
