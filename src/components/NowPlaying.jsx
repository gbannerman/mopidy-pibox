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

		if (!this.props.track) {
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
  				<h2 className="title">{ this.props.track.name }</h2>
  				<h3 className="artist">{ this.props.track ? <ArtistSentence artists={ this.props.track.artists } /> : <ArtistSentence /> }</h3>
          <h3 className="album">{ this.props.track.album.name }</h3>
        </div>
			</div>
		);
	}
}