import React, { useState } from "react";
import SearchBox from "./SearchBox.jsx";
import SearchResultItem from "./SearchResultItem.jsx";
import { Transition } from "react-transition-group";
import { searchLibrary, queueTrack, playIfStopped } from "services/mopidy.js";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import BounceLoader from "react-spinners/BounceLoader";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { useDebounce } from "hooks/debounce.js";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles({
  results: {
    width: "100%",
  },
  error: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  errorInfo: {
    textAlign: "center",
    fontWeight: "400",
    margin: "10px",
    color: "#FFFFFF",
    marginTop: "30%",
  },
  noResults: {
    color: "white",
    textAlign: "center",
  },
  closeIcon: {
    width: 45,
    height: 45,
    color: "#FFFFFF",
  },
  closeIconContainer: {
    marginLeft: 10,
    padding: 0,
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
});

const Search = () => {
  const classes = useStyles();

  const [results, setResults] = useState(null);
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
      <div className={classes.error}>
        <h4 className={classes.errorInfo}>{error}</h4>
      </div>
    );
  } else if (results && !results.length) {
    displayResults = <div className={classes.noResults}>No results found</div>;
  } else {
    displayResults = <div className={classes.results}>{searchResults}</div>;
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
              <div style={{ margin: "10px", display: "flex" }}>
                <SearchBox
                  onSubmit={debouncedSearch}
                  term={searchTerm}
                  onValueChange={onSearchValueChange}
                />
                <IconButton
                  color="secondary"
                  onClick={() => history.push("/pibox")}
                  className={classes.closeIconContainer}
                >
                  <CloseIcon className={classes.closeIcon} />
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
