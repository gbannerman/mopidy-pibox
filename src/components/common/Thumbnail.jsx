import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import placeholder from "res/placeholder.png";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "auto",
    maxWidth: "220px",
    minWidth: "160px",
    borderRadius: "10px",
  },
}));

const Thumbnail = ({ url }) => {
  const classes = useStyles();

  return (
    <img
      className={classes.root}
      src={url || placeholder}
      alt="Album artwork"
    />
  );
};

export default Thumbnail;
