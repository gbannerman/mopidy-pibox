import React from 'react';
import ArtistSentence from './ArtistSentence.jsx'

export default class TracklistItem extends React.Component {

	render() {

		return (

			<h5>
				<span className="tracklist-item-title">{ this.props.track.title } </span> - 
				<span className="tracklist-item-artist"> <ArtistSentence artists={ this.props.track.artists } /> </span>
			</h5>
		);
	}
}