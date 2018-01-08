import React from 'react';
import NowPlaying from './NowPlaying.jsx';
import Tracklist from './Tracklist.jsx';
import PlaybackControls from './PlaybackControls.jsx';

export default class Home extends React.Component {

	render() {

    const TEST_TRACK = {
      title: "Money Trees",
      artists: ["Kendrick Lamar", "Jay Rock"],
      album: "good kid, m.A.A.d city (Deluxe)"
    };

    const TEST_TRACKLIST = [
      {
        title: "Grown Up",
        artists: ["Danny Brown"],
        album: "Grown Up"
      },
      {
        title: "Grown Up",
        artists: ["Danny Brown"],
        album: "Grown Up"
      },
      {
        title: "Grown Up",
        artists: ["Danny Brown"],
        album: "Grown Up"
      }
    ];

		return (
			<div>
	      <h3>Now Playing</h3>
	      <NowPlaying current_track={TEST_TRACK}/>
	      <Tracklist tracks={TEST_TRACKLIST} />
				<PlaybackControls />
			</div>
		);
	}
}