import React from "react";
import { endSession } from "services/mopidy";
import { Button } from "@mui/material";
import { useSessionDetails } from "hooks/session";
import logo from "res/logo.png";
import { useConfig } from "hooks/config";

const SessionPage = () => {
  const {
    session: {
      playlistNames,
      skipThreshold,
      startedAt,
      playedTracks,
      remainingPlaylistTracks,
    },
  } = useSessionDetails();

  const {
    config: { offline },
  } = useConfig();

  return (
    <div className="w-full h-full flex flex-col justify-between items-stretch p-2">
      <div className="text-center">
        <h2 className="font-bold text-xl">pibox</h2>
        <img className="w-[70px] h-auto mx-auto my-2" alt="logo" src={logo} />
      </div>
      <div>
        <SessionStatistic
          label="Selected Playlists"
          value={
            <div className="flex flex-col justify-end">
              {offline ? (
                <p className="text-right leading-tight">Local library</p>
              ) : (
                playlistNames.map((name) => (
                  <p key={name} className="text-right leading-tight">
                    {name}
                  </p>
                ))
              )}
              <span className="text-gray-400 text-right">
                ({remainingPlaylistTracks.length} tracks remaining)
              </span>
            </div>
          }
        />
        <SessionStatistic
          label="Tracks Played"
          value={<p className="text-right">{playedTracks.length}</p>}
        />
        <SessionStatistic
          label="Started"
          value={<p className="text-right">{startedAt.fromNow()}</p>}
        />
        <SessionStatistic
          label="Skip Threshold"
          value={<p className="text-right">{skipThreshold}</p>}
        />
      </div>
      <Button
        className="my-10 mx-0 self-center"
        variant="contained"
        color="error"
        onClick={endSession}
      >
        End Session
      </Button>
    </div>
  );
};

function SessionStatistic({ label, value }) {
  return (
    <div className="flex justify-between items-center w-full p-2 min-h-16 border-b border-gray-200">
      <p className="font-bold text-gray-400">{label}:</p>
      {value}
    </div>
  );
}

export default SessionPage;
