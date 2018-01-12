import React from 'react';
import NowPlaying from './NowPlaying.jsx';
import Tracklist from './Tracklist.jsx';
import PlaybackControls from './PlaybackControls.jsx';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

export default class Home extends React.Component {

	render() {

		return (
			<div>
        <ul>
        	<li><Link className="Link" to="/pibox/search">Search</Link></li>
        </ul>
	      <h3>Now Playing</h3>
	      <NowPlaying image={this.props.image} track={this.props.nowPlaying} />
	      <Tracklist tracks={this.props.tracklist} display={5} />
				<PlaybackControls playing={this.props.playing} />
			</div>
		);
	}
}