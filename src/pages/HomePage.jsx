import React from "react";
import { Route } from "wouter";
import NowPlaying from "components/playback/NowPlaying";
import Tracklist from "components/tracklist/Tracklist";
import NavigationBar from "components/NavigationBar";
import SearchOverlay from "pages/SearchOverlay";

const Home = () => {
  return (
    <div>
      <NavigationBar />
      <NowPlaying />
      <Tracklist display={3} />
      <Route path="/search" component={SearchOverlay} />
    </div>
  );
};

export default Home;
