import React from 'react';
import { getMopidy } from '../App.js';

export default class PlaybackControls extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			playing: false
		};
	}

	toggle() {
		if (this.state.playing) {
			getMopidy().playback.pause().done(() => {
				this.setState({playing: false});
				console.log("PAUSED");
			});
		} else {
			getMopidy().playback.play().done(() => {
				this.setState({playing: true});
				console.log("PLAYING");
			});
		}
	}

	render() {

		return (

			<button onClick={this.toggle.bind(this)}>START / STOP</button>
		);
	}
}