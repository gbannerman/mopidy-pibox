import React from 'react';
import { getMopidy } from '../App.js';

export default class PlaybackControls extends React.Component {

	togglePlayback(playbackState) {
		console.log(playbackState);
		getMopidy().tracklist.getConsume().done((consume) => {
			console.log(consume);
		});
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

			<button onClick={this.start.bind(this)}>START / STOP</button>
		);
	}
}