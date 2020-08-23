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
import "../style/SessionForm.css";

const SessionForm = ({ defaultPlaylistUri, onStartSessionClick }) => {
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
      selectedPlaylist,
      votesToSkip,
    });
  };

  return (
    <form className="session-form" onSubmit={handleSessionClick}>
      <h2 className="no-song-heading">pibox</h2>

      <TextField
        fullWidth
        className="session-form-field"
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
          className="session-form-field-select"
          value={selectedPlaylist}
          onChange={(event) => setSelectedPlaylist(event.target.value)}
          placeholder="Select a playlist"
        >
          {menuItems}
        </Select>
      </FormControl>

      <Button
        type="submit"
        className="session-form-field"
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
