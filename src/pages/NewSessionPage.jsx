import React, { useState, useEffect } from "react";
import { getPlaylists } from "services/mopidy";
import {
  TextField,
  Button,
  FormControl,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useConfig } from "hooks/config";

const NewSessionPage = ({ onStartSessionClick }) => {
  const {
    config: { defaultPlaylists, defaultSkipThreshold },
  } = useConfig();

  const [playlists, setPlaylists] = useState([]);
  const [votesToSkip, setVotesToSkip] = useState(`${defaultSkipThreshold}`);
  const [automaticallyStartPlaying, setAutomaticallyStartPlaying] =
    useState(true);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  useEffect(() => {
    const updatePlaylists = async () => {
      const playlists = await getPlaylists();
      setPlaylists(playlists);
      setSelectedPlaylists(
        playlists.filter((p) => defaultPlaylists.includes(p.uri)),
      );
    };

    updatePlaylists();
  }, []);

  const handleSessionClick = (event) => {
    event.preventDefault();
    onStartSessionClick({
      selectedPlaylists: selectedPlaylists.map((selectedPlaylist) => ({
        name: selectedPlaylist.name,
        uri: selectedPlaylist.uri,
      })),
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
          multiple
          disableCloseOnSelect
          options={playlists}
          sx={{
            margin: 0,
            width: "100%",
          }}
          getOptionLabel={(playlist) => playlist.name}
          style={{ width: "100%" }}
          renderInput={(params) => (
            <TextField {...params} label="Playlists" variant="outlined" />
          )}
          renderOption={(props, option, { selected }) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key} {...optionProps}>
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </li>
            );
          }}
          value={selectedPlaylists}
          onChange={(_event, value) => setSelectedPlaylists(value)}
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
        disabled={!votesToSkip || !selectedPlaylists.length}
        color="primary"
      >
        Start
      </Button>
    </form>
  );
};

export default NewSessionPage;
