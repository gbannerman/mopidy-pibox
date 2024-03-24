import React from "react";
import NowPlaying from "components/playback/NowPlaying";
import Tracklist from "components/tracklist/Tracklist";
import QRCode from "react-qr-code";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    cursor: "none",
    padding: "20px",
    height: "100vh",
  },
  session: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flex: "1 1 100%",
  },
  nowPlaying: {
    flex: "0 1 50%",
  },
  join: {
    flex: "1 1 auto",
    fontSize: "1.4rem",
    display: "flex",
    alignItems: "end",
    justifyContent: "space-between",
  },
  joinLink: {
    color: theme.palette.secondary.main,
  },
  qrCode: {
    height: "auto",
    maxWidth: 100,
    width: "100%",
    display: "flex",
  },
}));

const DisplayPage = () => {
  const classes = useStyles();

  const joinLink = new URL(window.location);
  joinLink.pathname = "pibox/";

  return (
    <div className={classes.root}>
      <div className={classes.session}>
        <div className={classes.nowPlaying}>
          <NowPlaying />
        </div>
        <Tracklist display={5} readOnly />
      </div>
      <div className={classes.join}>
        <div>
          <a className={classes.joinLink}>{joinLink.toString()}</a>
        </div>
        <div className={classes.qrCode}>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={joinLink.toString()}
            viewBox={`0 0 256 256`}
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayPage;
