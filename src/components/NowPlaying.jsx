import React from 'react';
import Thumbnail from './Thumbnail.jsx';
import ArtistSentence from './ArtistSentence.jsx';
import '../style/NowPlaying.css';
import PlaybackControls from './PlaybackControls.jsx';
import logo from 'res/logo-black.png';

export default class NowPlaying extends React.Component {

	render() {

		if (!this.props.playback.track) {
			return(
				<div className="no-song">
					<h2 className="no-song-heading">Welcome to pibox!</h2>
					<img className="no-song-logo" alt="logo" src={logo} />
					<ol className="no-song-list" type="1">
					  <li className="no-song-list-item">Tap the search icon at the top right</li>
					  <li className="no-song-list-item">Search for an artist, song or album</li>
					  <li className="no-song-list-item">Tap on the song you want to queue</li>
					  <li className="no-song-list-item">Enjoy! <span role="img" aria-label="Music Note">&#127925;</span></li>
					</ol>
				</div>
			);
		}

		return (
			<div>
	      <h3 className="now-playing-heading">Now Playing</h3>
				<div className="now-playing">
					<div className="artwork-and-playback">
						{ this.props.playback.image &&
							<Thumbnail url ={this.props.playback.image} />
						}
						<PlaybackControls playbackState={this.props.playback.state} />
					</div>
				  <div className="info">
						<h2 className="title">{ this.props.playback.track.name }</h2>
						<h3 className="artist">{ this.props.playback.track ? <ArtistSentence artists={ this.props.playback.track.artists } /> : <ArtistSentence /> }</h3>
				    <h3 className="album">{ this.props.playback.track.album.name }</h3>
				  </div>
				</div>
			</div>
		);
	}
}