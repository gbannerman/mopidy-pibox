import React from 'react';
import Thumbnail from './Thumbnail.jsx';
import ArtistSentence from './ArtistSentence.jsx';
import '../style/NowPlaying.css';

export default class NowPlaying extends React.Component {

	render() {

		return (
			<div className="now-playing">
				<Thumbnail />
        <div className="info">
  				<h2 className="title">{ this.props.current_track.title }</h2>
  				<h3 className="artist">{ this.props.current_track ? <ArtistSentence artists={ this.props.current_track.artists } /> : <ArtistSentence /> }</h3>
          <h3 className="album">{ this.props.current_track.album }</h3>
        </div>
			</div>
		);
	}
}