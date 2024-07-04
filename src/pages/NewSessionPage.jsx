import React, { useState, useEffect } from "react";
import { getPlaylists } from "services/mopidy";
import {
  TextField,
  Button,
  FormControl,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useConfig } from "hooks/config";
import { Autocomplete } from "@mui/lab";

const NewSessionPage = ({ onStartSessionClick }) => {
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
    <form
      className="flex flex-col items-center justify-evenly mx-auto h-4/5 w-4/5"
      onSubmit={handleSessionClick}
    >
      <h2 className="font-bold text-xl">pibox</h2>

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
          sx={{
            margin: 0,
            width: "100%",
          }}
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
            color="secondary"
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

export default NewSessionPage;
