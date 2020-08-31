import React from "react";
import { startSession, endSession } from "services/mopidy";
import { Button } from "@material-ui/core";
import SessionForm from "components/SessionForm";
import { useHistory } from "react-router-dom";
import { useAdmin } from "hooks/admin";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

const SessionPage = ({ session }) => {
  const classes = useStyles();

  const { isAdmin } = useAdmin();
  const history = useHistory();

  const createSession = async ({ votesToSkip, selectedPlaylist }) => {
    await startSession(votesToSkip, selectedPlaylist);
    history.push("/pibox");
  };

  return (
    <div className={classes.root}>
      {!session.started ? (
        <SessionForm
          defaultPlaylistUri={"spotify:playlist:79inBfAlnfUB7i5kRthmWL"}
          onStartSessionClick={createSession}
        />
      ) : (
        <>
          {isAdmin && (
            <Button variant="contained" onClick={endSession}>
              End Session
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default SessionPage;
