import React, { useState, useEffect } from "react";
import NowPlaying from "./NowPlaying.jsx";
import Tracklist from "./Tracklist.jsx";
import { Link, Route } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import { IconButton } from "@material-ui/core";
import SearchOverlay from "./SearchOverlay.jsx";
import { useAdmin } from "hooks/admin";
import { useSnackbar } from "notistack";
import "../style/Home.css";

const Home = () => {
  const { isAdmin, setIsAdmin } = useAdmin();

  const [adminCounter, setAdminCounter] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isAdmin || adminCounter < 7) {
      return;
    }

    setIsAdmin(true);
    enqueueSnackbar(`You are now an admin!`, { variant: "success" });
  }, [adminCounter, isAdmin, setIsAdmin, enqueueSnackbar]);

  return (
    <div>
      <div className="home">
        <ul className="nav-bar">
          <li className="nav-item-title">
            <h2
              className="nav-title"
              onClick={() => setAdminCounter(adminCounter + 1)}
            >
              pibox
            </h2>
          </li>
          <li className="nav-item-search">
            <Link className="Link" to="/search/">
              <IconButton color="secondary">
                <SearchIcon fontSize="large" />
              </IconButton>
            </Link>
          </li>
        </ul>
        <NowPlaying />
        <Tracklist display={3} />
      </div>
      <Route path="/search/" render={() => <SearchOverlay />} />
    </div>
  );
};

export default Home;
