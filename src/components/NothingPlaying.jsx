import React from "react";
import logo from "res/logo-black.png";

const NothingPlaying = () => (
  <div className="no-song">
    <h2 className="no-song-heading">Welcome to pibox!</h2>
    <img className="no-song-logo" alt="logo" src={logo} />
    <ol className="no-song-list" type="1">
      <li className="no-song-list-item">
        Tap the search icon at the top right
      </li>
      <li className="no-song-list-item">Search for an artist, song or album</li>
      <li className="no-song-list-item">Tap on the song you want to queue</li>
      <li className="no-song-list-item">
        Enjoy!{" "}
        <span role="img" aria-label="Music Note">
          &#127925;
        </span>
      </li>
    </ol>
  </div>
);

export default NothingPlaying;
