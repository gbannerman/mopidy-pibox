import React from "react";
import logo from "res/logo-black.png";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

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
        <Step4 className={classes.listItem} />
      </ol>
    </div>
  );
};

const Step4 = ({ className }) => {
  const options = [
    "Enjoy! 🎵",
    "Have a wee boogie! 💃",
    "Have a wee boogie! 🕺",
    "Sing your heart out! 🎤",
    "Just bust a move! 😎",
    "Dance like nobody's watching! 🙈",
    "Turn it up to 11! 🎸",
  ];

  const [option] = useState(
    () => options[(options.length * Math.random()) | 0],
  );

  return <li className={className}>{option}</li>;
};

export default NothingPlaying;
