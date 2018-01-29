import React from 'react';
import TracklistItem from './TracklistItem.jsx';
import '../style/Tracklist.css';

export default class Tracklist extends React.Component {

	render() {

		const mappedTracks = this.props.tracks.slice(1, (1 + this.props.display)).map((track, index) => <TracklistItem key={index} track={track} mopidy={this.props.mopidy}/>);

		return (

			<div className="tracklist">
				{ mappedTracks }
			</div>
		);
	}
}