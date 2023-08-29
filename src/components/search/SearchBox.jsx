import React from "react";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
  },
  input: {
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export const SearchBox = ({ value, onValueChange, onSubmit }) => {
  const classes = useStyles();

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Paper component="form" className={classes.root} onSubmit={handleSubmit}>
      <InputBase
        className={classes.input}
        placeholder="Start typing to search..."
        inputProps={{ "aria-label": "search " }}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        autoFocus
      />
      <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBox;
