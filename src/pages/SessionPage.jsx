import React from "react";
import { startSession, endSession } from "services/mopidy";
import { Button } from "@material-ui/core";
import SessionForm from "components/SessionForm";
import { useHistory } from "react-router-dom";
import "style/pages/SessionPage.css";

const SessionPage = ({ session }) => {
  const history = useHistory();

  const createSession = async ({ votesToSkip, selectedPlaylist }) => {
    await startSession(votesToSkip, selectedPlaylist);
    history.push("/pibox");
  };

  return (
    <div className="SessionPage">
      {!session.started ? (
        <SessionForm
          defaultPlaylistUri={"spotify:playlist:79inBfAlnfUB7i5kRthmWL"}
          onStartSessionClick={createSession}
        />
      ) : (
        <Button variant="contained" onClick={endSession}>
          End Session
        </Button>
      )}
    </div>
  );
};

export default SessionPage;
