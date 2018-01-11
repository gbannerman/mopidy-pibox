import React from 'react';
import TracklistItem from './TracklistItem.jsx'

export default class Tracklist extends React.Component {

	render() {

		const mappedTracks = this.props.tracks.slice(1, (1 + this.props.display)).map((track, index) => <TracklistItem key={index} track={track}/>);

		return (

			<div className="tracklist">
				{ mappedTracks }
			</div>
		);
	}
}