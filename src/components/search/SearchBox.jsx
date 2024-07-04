import React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export const SearchBox = ({ value, onValueChange, onSubmit }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Paper
      component="form"
      sx={{
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        flexGrow: 1,
      }}
      onSubmit={handleSubmit}
    >
      <InputBase
        sx={{ flex: 1 }}
        placeholder="Start typing to search..."
        inputProps={{ "aria-label": "search " }}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        autoFocus
      />
      <IconButton type="submit" sx={{ padding: 1 }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBox;
