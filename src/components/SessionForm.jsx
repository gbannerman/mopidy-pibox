import React, { useState, useEffect } from "react";
import { getSpotifyPlaylists } from "services/mopidy";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    margin: "0 auto",
    height: "80%",
    width: "80%",
  },
  selectField: {
    margin: 0,
    width: "100%",
  },
});

const SessionForm = ({ defaultPlaylistUri, onStartSessionClick }) => {
  const classes = useStyles();

  const [playlists, setPlaylists] = useState([]);
  const [votesToSkip, setVotesToSkip] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(defaultPlaylistUri);

  useEffect(() => {
    const getPlaylists = async () => {
      const spotifyPlaylists = await getSpotifyPlaylists();
      setPlaylists(spotifyPlaylists);
    };

    getPlaylists();
  }, []);

  const menuItems = playlists.map((playlist) => (
    <MenuItem key={playlist.uri} value={playlist.uri}>
      {playlist.name}
    </MenuItem>
  ));

  const handleSessionClick = (event) => {
    event.preventDefault();
    onStartSessionClick({
      selectedPlaylist: {
        uri: selectedPlaylist,
        name:
          playlists.find((p) => p.uri === selectedPlaylist).name ??
          "Unknown Playlist",
      },
      votesToSkip,
    });
  };

  return (
    <form className={classes.root} onSubmit={handleSessionClick}>
      <h2 className="no-song-heading">pibox</h2>

      <TextField
        fullWidth
        label="Number of votes to skip"
        type="number"
        value={votesToSkip}
        onChange={(event) => setVotesToSkip(event.target.value)}
        placeholder="3"
      />

      <FormControl fullWidth>
        <InputLabel>Playlist</InputLabel>
        <Select
          autoWidth
          className={classes.selectField}
          value={selectedPlaylist}
          onChange={(event) => setSelectedPlaylist(event.target.value)}
          placeholder="Select a playlist"
        >
          {menuItems}
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        disabled={!votesToSkip || !selectedPlaylist}
        color="primary"
      >
        Start
      </Button>
    </form>
  );
};

export default SessionForm;
