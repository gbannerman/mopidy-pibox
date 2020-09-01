import React from "react";
import NowPlaying from "./NowPlaying.jsx";
import Tracklist from "./Tracklist.jsx";
import { Link, Route } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import { IconButton } from "@material-ui/core";
import SearchOverlay from "./SearchOverlay.jsx";
import "../style/Home.css";

const Home = () => {
  return (
    <div>
      <div className="home">
        <ul className="nav-bar">
          <li className="nav-item-title">
            <h2 className="nav-title">pibox</h2>
          </li>
          <li className="nav-item-search">
            <Link className="Link" to="/pibox/search">
              <IconButton color="secondary">
                <SearchIcon fontSize="large" />
              </IconButton>
            </Link>
          </li>
        </ul>
        <NowPlaying />
        <Tracklist display={3} />
      </div>
      <Route path="/pibox/search" render={() => <SearchOverlay />} />
    </div>
  );
};

export default Home;
