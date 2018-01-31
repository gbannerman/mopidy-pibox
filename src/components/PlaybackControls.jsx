import React from 'react';
import { getMopidy } from '../App.js';
import Button from 'material-ui/Button';
import '../style/PlaybackControls.css';
import PlayArrow from 'material-ui-icons/PlayArrow';
import Pause from 'material-ui-icons/Pause';

export default class PlaybackControls extends React.Component {

	toggle() {
		if (this.props.playbackState === 'playing') {
			getMopidy().playback.pause();
		} else {
			getMopidy().playback.play();
		}
	}

	render() {

		const iconStyle = {
      width: 35,
      height: 35,
    }

    const buttonStyle = {
  		position: 'absolute',
  		width: 50,
  		height: 50,
  		bottom: -22
    }

		if (this.props.playbackState === 'stopped') {
			return null;
		}

		return (
			<Button
				style={buttonStyle}
				fab
				color="primary"
				onClick={this.toggle.bind(this)}>
					{ this.props.playbackState === 'playing' ? <Pause style={iconStyle} /> : <PlayArrow style={iconStyle}/> }
			</Button>
		);
	}
}