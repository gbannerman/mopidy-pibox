import React from 'react';
import Thumbnail from './Thumbnail.jsx';
import ArtistSentence from './ArtistSentence.jsx';
import '../style/NowPlaying.css';

export default class NowPlaying extends React.Component {

	render() {

		if (!this.props.track) {
			return(
				<div className="no-song">
					<h2 className="no-song-heading">Welcome to pibox!</h2>
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
					{ this.props.image &&
						<Thumbnail url ={this.props.image} />
					}
				  <div className="info">
						<h2 className="title">{ this.props.track.name }</h2>
						<h3 className="artist">{ this.props.track ? <ArtistSentence artists={ this.props.track.artists } /> : <ArtistSentence /> }</h3>
				    <h3 className="album">{ this.props.track.album.name }</h3>
				  </div>
				</div>
			</div>
		);
	}
}