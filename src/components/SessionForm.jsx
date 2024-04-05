import React, { useState, useEffect } from "react";
import { getPlaylists } from "services/mopidy";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useConfig } from "hooks/config";

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

const SessionForm = ({ onStartSessionClick }) => {
  const classes = useStyles();

  const { defaultPlaylist, defaultSkipThreshold } = useConfig();

  const [playlists, setPlaylists] = useState([]);
  const [votesToSkip, setVotesToSkip] = useState(`${defaultSkipThreshold}`);
  const [automaticallyStartPlaying, setAutomaticallyStartPlaying] =
    useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(defaultPlaylist);

  useEffect(() => {
    const updatePlaylists = async () => {
      const playlists = await getPlaylists();
      setPlaylists(playlists);
    };

    updatePlaylists();
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
      automaticallyStartPlaying,
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

      <FormControlLabel
        control={
          <Checkbox
            name="automaticallyStartPlaying"
            checked={automaticallyStartPlaying}
            onChange={(event) =>
              setAutomaticallyStartPlaying(event.target.checked)
            }
          />
        }
        label="Automatically start playing music when session starts"
      />

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
