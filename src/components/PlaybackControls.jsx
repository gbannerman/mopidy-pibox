import React from 'react';
import { getMopidy } from '../App.js';

export default class PlaybackControls extends React.Component {

	togglePlayback(playbackState) {
		if (playbackState == "PLAYING") {
			getMopidy().playback.pause();
		} else {
			getMopidy().tracklist.setConsume(true);
			getMopidy().playback.play();
		}
	}

	start() {
			getMopidy().playback.getState().done(this.togglePlayback);
		}

	render() {

		return (

			<button onClick={this.start}>START / STOP</button>
		);
	}
}