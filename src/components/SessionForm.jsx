import React, { useState, useEffect } from "react";
import { getPlaylists } from "services/mopidy";
import {
  TextField,
  Button,
  FormControl,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useConfig } from "hooks/config";
import { Autocomplete } from "@material-ui/lab";

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
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    const updatePlaylists = async () => {
      const playlists = await getPlaylists();
      setPlaylists(playlists);
      setSelectedPlaylist(playlists.find((p) => p.uri === defaultPlaylist));
    };

    updatePlaylists();
  }, []);

  const handleSessionClick = (event) => {
    event.preventDefault();
    onStartSessionClick({
      selectedPlaylist: {
        name: selectedPlaylist.name,
        uri: selectedPlaylist.uri,
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
        <Autocomplete
          options={playlists}
          className={classes.selectField}
          getOptionLabel={(playlist) => playlist.name}
          style={{ width: "100%" }}
          renderInput={(params) => (
            <TextField {...params} label="Playlist" variant="outlined" />
          )}
          value={selectedPlaylist}
          onChange={(_event, value) => setSelectedPlaylist(value)}
        />
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
