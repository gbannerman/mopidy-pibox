import React, { useState } from "react";
import SearchBox from "./SearchBox.jsx";
import SearchResultItem from "./SearchResultItem.jsx";
import { Transition } from "react-transition-group";
import { searchSpotify, queueTrack, playIfStopped } from "services/mopidy.js";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import "../style/Search.css";

var Spinner = require("react-spinkit");

const Search = () => {
  const [results, setResults] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();

  const queue = async (track) => {
    try {
      const updatedTracklist = await queueTrack(track);
      playIfStopped();
      setSearchTerm("");

      // TODO: This should use the actual length of the tracklist that is shown
      if (updatedTracklist.length > 4) {
        enqueueSnackbar(`${track.name} added to queue`, { variant: "success" });
      }

      history.push("/pibox");
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const search = async () => {
    if (!searchTerm) {
      return;
    }

    setFetching(true);
    const queryParameters = searchTerm.split(" ");
    try {
      const results = await searchSpotify(queryParameters);
      setResults(results);
      setFetching(false);
    } catch (error) {
      setError(error);
      setFetching(false);
    }
  };

  const searchResults = results.map((track, index) => (
    <SearchResultItem key={index} track={track} onClick={queue} />
  ));

  const defaultStyleBar = {
    margin: "0 auto",
    maxWidth: "800px",
    transition: "width 100ms ease-in-out",
  };

  const transitionStylesBar = {
    entering: { width: "0%" },
    entered: { width: "100%" },
  };

  const defaultStyleResults = {
    transition: "opacity 100ms ease-in-out",
  };

  const transitionStylesResults = {
    entering: { opacity: 0 },
    entered: { opacity: 100 },
  };

  let displayResults;

  if (fetching) {
    displayResults = (
      <div className="loading">
        <Spinner fadeIn="none" name="double-bounce" color="white" />
      </div>
    );
  } else if (error) {
    displayResults = (
      <div className="error">
        <h4 className="error-info">{error}</h4>
      </div>
    );
  } else {
    displayResults = <div className="results">{searchResults}</div>;
  }

  return (
    <div className="search">
      <Transition appear={true} in={true} timeout={100}>
        {(state) => (
          <div>
            <div
              style={{
                ...defaultStyleBar,
                ...transitionStylesBar[state],
              }}
            >
              <div style={{ margin: "10px" }}>
                <SearchBox
                  onSubmit={search}
                  term={searchTerm}
                  onValueChange={setSearchTerm}
                />
              </div>
            </div>
            <div
              style={{
                ...defaultStyleResults,
                ...transitionStylesResults[state],
              }}
            >
              {displayResults}
            </div>
          </div>
        )}
      </Transition>
    </div>
  );
};

export default Search;
