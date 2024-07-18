import React, { useRef, useState } from "react";
import SearchBox from "./SearchBox.jsx";
import SearchResultItem from "./SearchResultItem.jsx";
import { Transition } from "react-transition-group";
import { searchLibrary, queueTrack, playIfStopped } from "services/mopidy.js";
import { useLocation } from "wouter";
import { useSnackbar } from "notistack";
import BounceLoader from "react-spinners/BounceLoader";
import CloseIcon from "@mui/icons-material/Close";
import { useDebounce } from "hooks/debounce.js";
import { IconButton } from "@mui/material";

const Search = () => {
  const [results, setResults] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const ref = useRef();

  const [searchTerm, setSearchTerm] = useState("");

  const [_, navigate] = useLocation();

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

      navigate("/");
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const debouncedSearch = useDebounce(async () => {
    if (!searchTerm) {
      return;
    }

    setFetching(true);
    const queryParameters = searchTerm.split(" ").filter((term) => !!term);
    try {
      const results = await searchLibrary(queryParameters);
      setResults(results);
      setFetching(false);
    } catch (error) {
      setError(error);
      setFetching(false);
    }
  }, 500);

  const onSearchValueChange = (newValue) => {
    setSearchTerm(newValue);
    if (newValue) {
      debouncedSearch();
    }
  };

  const searchResults = results
    ? results.map((track, index) => (
        <SearchResultItem key={index} track={track} onClick={queue} />
      ))
    : null;

  const defaultStyleBar = {
    margin: "0 auto",
    maxWidth: "800px",
    transition: "width 100ms ease-in-out",
  };

  const transitionStylesBar = {
    entering: { width: "10%" },
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
        <BounceLoader size={44} color="#FFFFFF" />
      </div>
    );
  } else if (error) {
    displayResults = (
      <div className="max-w-4xl mx-auto">
        <h4 className="text-center text-white m-2">{error}</h4>
      </div>
    );
  } else if (results && !results.length) {
    displayResults = (
      <div className="text-white text-center">No results found</div>
    );
  } else {
    displayResults = <div className="w-full">{searchResults}</div>;
  }

  return (
    <div className="search">
      <Transition appear={true} in={true} timeout={50} nodeRef={ref}>
        {(state) => (
          <div>
            <div
              style={{
                ...defaultStyleBar,
                ...transitionStylesBar[state],
              }}
              ref={ref}
            >
              <div style={{ margin: "10px", display: "flex" }}>
                <SearchBox
                  onSubmit={debouncedSearch}
                  term={searchTerm}
                  onValueChange={onSearchValueChange}
                />
                <IconButton
                  color="secondary"
                  onClick={() => navigate("/")}
                  className="ml-2 p-0 bg-transparent border-transparent"
                >
                  <CloseIcon className="w-11 h-11 text-white" />
                </IconButton>
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

export const BACKEND_PRIORITY_ORDER = ["spotify", "soundcloud"];

export default Search;
