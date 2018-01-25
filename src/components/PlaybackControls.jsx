import React from 'react';
import { getMopidy } from '../App.js';
import RaisedButton from 'material-ui/RaisedButton';
import '../style/PlaybackControls.css';

export default class PlaybackControls extends React.Component {

	toggle() {
		if (this.props.playbackState === 'playing') {
			getMopidy().playback.pause();
		} else {
			getMopidy().playback.play();
		}
	}

	render() {

		if (this.props.playbackState === 'stopped') {
			return null;
		}

		return (
			<div className="playback-controls">
				<RaisedButton 
					backgroundColor="#009688"
					onClick={this.toggle.bind(this)}>
						{ this.props.playbackState === 'playing' ? "PAUSE" : "PLAY" }
					</RaisedButton>
			</div>
		);
	}
}