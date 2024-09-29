import React, { useState } from "react";
import TracklistItem from "./TracklistItem.jsx";
import { voteToSkipTrack, PiboxError } from "services/mopidy";
import { Card } from "@mui/material";
import { useSessionDetails } from "hooks/session.js";
import { useTracklist } from "hooks/tracklist.js";

const Tracklist = ({ display, readOnly = false }) => {
  const { session } = useSessionDetails();
  const [votePending, setVotePending] = useState(false);

  const { tracklist, refetchTracklist } = useTracklist();

  if (!tracklist) {
    return null;
  }

  const generateSkipHandler = (track) => async () => {
    const trackUri = track.info.uri;
    const setTrackAsVoted = () => {
      refetchTracklist();
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

  const skipThreshold = session?.skipThreshold ?? 0;

  const tracklistItems = tracklist
    .slice(1, 1 + display)
    .map((track) =>
      readOnly ? (
        <TracklistItem
          key={track.info.uri}
          track={{ ...track, voted: true }}
          skipThreshold={skipThreshold}
          buttonEnabled={true}
          onVoteClick={() => {}}
        />
      ) : (
        <TracklistItem
          key={track.info.uri}
          track={track}
          skipThreshold={skipThreshold}
          buttonEnabled={!(votePending || track.voted)}
          onVoteClick={generateSkipHandler(track)}
        />
      ),
    );

  return (
    <>
      <div className="max-w-[400px] mx-auto mb-7 mt-0">
        {queueLength > 0 && (
          <div className="my-0 mx-2 font-normal text-sm text-gray-400 border-b border-gray-200">
            {queueLength} song{queueLength !== 1 ? "s" : ""} queued
          </div>
        )}
        {tracklistItems}
        {tracksNotShown > 0 && (
          <Card className="m-2 text-center py-4">+ {tracksNotShown} more</Card>
        )}
      </div>
    </>
  );
};

export default Tracklist;
