import React from 'react';
import { getMopidy } from '../App.js';

export default class PlaybackControls extends React.Component {

	start() {
			console.log("STARTING");
			getMopidy().playback.play();
		}

	render() {

		return (

			<button onClick={this.start}>START / STOP</button>
		);
	}
}