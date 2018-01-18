import React from 'react';
import NowPlaying from './NowPlaying.jsx';
import Tracklist from './Tracklist.jsx';
import PlaybackControls from './PlaybackControls.jsx';
import '../style/Home.css';
import { Link } from 'react-router-dom';

export default class Home extends React.Component {

	render() {

		return (
			<div>
        <ul>
        	<li className="nav-item-title"><h2 className="nav-title">pibox</h2></li>
        	<li className="nav-item-search"><Link className="Link" to="/pibox/search"><img className="icon" alt="search icon" src="https://d30y9cdsu7xlg0.cloudfront.net/png/14173-200.png" /></Link></li>
        </ul>
	      <NowPlaying image={this.props.image} track={this.props.nowPlaying} />
	      <Tracklist tracks={this.props.tracklist} display={5} />
				<PlaybackControls playing={this.props.playing} />
			</div>
		);
	}
}