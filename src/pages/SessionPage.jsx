import React from "react";
import { endSession } from "services/mopidy";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSession } from "hooks/session";

const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    fontSize: "18px",
    fontWeight: "400",
    color: "#757575",
    textAlign: "center",
  },
});

const SessionPage = () => {
  const classes = useStyles();

  const { playlistName, skipThreshold, startedAt } = useSession();

  return (
    <div className={classes.root}>
      <p className={classes.info}>Selected Playlist: {playlistName} </p>
      <p className={classes.info}>Skip Threshold: {skipThreshold} </p>
      <p className={classes.info}>Started: {startedAt.fromNow()} </p>

      <Button variant="contained" onClick={endSession}>
        End Session
      </Button>
    </div>
  );
};

export default SessionPage;
