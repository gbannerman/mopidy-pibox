import React from 'react';
import { getMopidy } from '../App.js';

export default class PlaybackControls extends React.Component {

	toggle() {
		if (this.props.playing) {
			getMopidy().playback.pause();
		} else {
			getMopidy().playback.play();
		}
	}

	render() {

		return (

			<button onClick={this.toggle.bind(this)}>{ this.props.playing ? "PAUSE" : "PLAY" }</button>
		);
	}
}