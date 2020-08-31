import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "auto",
    maxWidth: "220px",
    minWidth: "160px",
    borderRadius: "10px",
  },
});

const Thumbnail = () => {
  const classes = useStyles();

  return (
    <img className={classes.root} src={this.props.url} alt="Album artwork" />
  );
};

export default Thumbnail;
