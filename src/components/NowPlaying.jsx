import React from 'react';
import Thumbnail from './Thumbnail.jsx';
import ArtistSentence from './ArtistSentence.jsx';
import '../style/NowPlaying.css';

export default class NowPlaying extends React.Component {

	render() {

		if (!this.props.track) {
			return(
				<div className="now-playing">
					<h2>Add a song to the queue</h2>
				</div>
			);
		}

		console.debug(this.props.track);

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
				  </div>
				</div>
			</div>
		);
	}
}