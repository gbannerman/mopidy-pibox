import React from "react";
import { Fab } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayIcon from "@mui/icons-material/PlayArrow";
import SkipNext from "@mui/icons-material/SkipNext";

const PlaybackControls = ({ playbackState, onPlayPauseClick, onSkipClick }) => {
  const isStopped = playbackState === "stopped";

  return (
    <div className="absolute -bottom-8 w-36 flex justify-between">
      <Fab
        sx={{
          width: 65,
          height: 65,
          visibility: isStopped ? "hidden" : "visible",
        }}
        color="primary"
        onClick={onPlayPauseClick}
      >
        {playbackState === "playing" ? (
          <PauseIcon sx={{ width: 45, height: 45 }} />
        ) : (
          <PlayIcon sx={{ width: 45, height: 45 }} />
        )}
      </Fab>
      <Fab sx={{ width: 65, height: 65 }} color="primary" onClick={onSkipClick}>
        <SkipNext sx={{ width: 45, height: 45 }} />
      </Fab>
    </div>
  );
};

export default PlaybackControls;
