import React from "react";
import logo from "res/logo-black.png";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  listItem: {
    padding: "5px",
  },
  logo: {
    width: "70px",
    height: "auto",
    margin: "5px",
  },
});

const NothingPlaying = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2>Welcome to pibox!</h2>
      <img className={classes.logo} alt="logo" src={logo} />
      <ol type="1">
        <li className={classes.listItem}>
          Tap the search icon at the top right
        </li>
        <li className={classes.listItem}>
          Search for an artist, song or album
        </li>
        <li className={classes.listItem}>Tap on the song you want to queue</li>
        <li className={classes.listItem}>
          Enjoy!{" "}
          <span role="img" aria-label="Music Note">
            &#127925;
          </span>
        </li>
      </ol>
    </div>
  );
};

export default NothingPlaying;
