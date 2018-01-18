import React from 'react';
import NowPlaying from './NowPlaying.jsx';
import Tracklist from './Tracklist.jsx';
import SearchOverlay from './SearchOverlay.jsx';
import PlaybackControls from './PlaybackControls.jsx';
import '../style/Home.css';

export default class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			overlay: false
		};
	}

	showOverlay() {
		this.setState({overlay: true});
	}

	onSearchResultSelect() {
		this.setState({overlay: false});
	}

	render() {

		if (this.state.overlay) {
			var overlay =	(<SearchOverlay in={this.state.overlay} playing={this.props.playing} tracklist={this.props.tracklist} onSelect={this.onSearchResultSelect.bind(this)}/>);
		}

		return (
			<div>
				{overlay}
        <ul>
        	<li className="nav-item-title"><h2 className="nav-title">pibox</h2></li>
        	<li className="nav-item-search"><img className="icon" alt="search icon" onClick={this.showOverlay.bind(this)} src="https://d30y9cdsu7xlg0.cloudfront.net/png/14173-200.png" /></li>
        </ul>
	      <NowPlaying image={this.props.image} track={this.props.nowPlaying} />
	      <Tracklist tracks={this.props.tracklist} display={5} />
				<PlaybackControls playing={this.props.playing} />
			</div>
		);
	}
}

// TODO Change selecting a track so that rather than redirecting, it closes the overlay