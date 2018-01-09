import React from 'react';
import Thumbnail from './Thumbnail.jsx';
import ArtistSentence from './ArtistSentence.jsx';
import '../style/NowPlaying.css';

export default class NowPlaying extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			track: null
		};
	}

	render() {

		if (!this.state.track) {
			return(
				<div className="now-playing">
					<h2>Add a song to the queue</h2>
				</div>
			);
		}

		return (
			<div className="now-playing">
				<Thumbnail />
        <div className="info">
  				<h2 className="title">{ this.state.track.name }</h2>
  				<h3 className="artist">{ this.state.track ? <ArtistSentence artists={ this.state.track.artists } /> : <ArtistSentence /> }</h3>
          <h3 className="album">{ this.state.track.album.name }</h3>
        </div>
			</div>
		);
	}
}