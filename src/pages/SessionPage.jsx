import React from "react";
import { endSession } from "services/mopidy";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSession } from "hooks/session";
import logo from "res/logo.png";

const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: "8px",
  },
  button: {
    margin: "40px 0px",
    alignSelf: "center",
  },
  sessionStatistic: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  sessionStatisticLabel: {
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.87)",
  },
  logoSection: {
    textAlign: "center",
  },
  logo: {
    width: "70px",
    height: "auto",
    margin: "5px",
  },
});

const SessionPage = () => {
  const classes = useStyles();

  const {
    playlistName,
    skipThreshold,
    startedAt,
    playedTracks,
    remainingPlaylistTracks,
  } = useSession();

  return (
    <div className={classes.root}>
      <div className={classes.logoSection}>
        <h2>pibox</h2>
        <img className={classes.logo} alt="logo" src={logo} />
      </div>
      <div>
        <SessionStatistic
          label="Selected Playlist"
          value={
            <>
              {playlistName}{" "}
              <span>({remainingPlaylistTracks.length} tracks remaining)</span>
            </>
          }
        />
        <SessionStatistic label="Tracks Played" value={playedTracks.length} />
        <SessionStatistic label="Started" value={startedAt.fromNow()} />
        <SessionStatistic label="Skip Threshold" value={skipThreshold} />
      </div>
      <Button
        className={classes.button}
        variant="contained"
        onClick={endSession}
      >
        End Session
      </Button>
    </div>
  );
};

function SessionStatistic({ label, value }) {
  const { sessionStatistic, sessionStatisticLabel } = useStyles();
  return (
    <div className={sessionStatistic}>
      <p className={sessionStatisticLabel}>{label}:</p>
      <p>{value}</p>
    </div>
  );
}

export default SessionPage;
