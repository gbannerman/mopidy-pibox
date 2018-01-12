import React from 'react';
import ArtistSentence from './ArtistSentence.jsx'
import '../style/SearchResultItem.css';
import { getMopidy } from '../App.js';
import { toast } from 'react-toastify';

export default class SearchResultItem extends React.Component {

	handleClick() {
		getMopidy().history.getHistory().done((history) => {
			if (history.filter(tuple => (tuple[1].uri === this.props.track.uri)).length > 0) {
				let message = "This track has already been played";
				toast.warn(message, {
					position: toast.POSITION.BOTTOM_CENTER,
					autoClose: 3500
				});
			} else if (this.props.tracklist.filter(track => (track.uri === this.props.track.uri)).length > 0) {
				let message = "This track has already been queued";
				toast.warn(message, {
					position: toast.POSITION.BOTTOM_CENTER,
					autoClose: 3500
				});
			} else {
				let message = this.props.track.name + " was added to the queue";
				getMopidy().tracklist.add([this.props.track], null, null, null).done(() => {
					toast.info(message, {
						position: toast.POSITION.BOTTOM_CENTER
					});
					if (this.props.tracklist.length >= 1 && this.props.tracklist[0].uri === this.props.track.uri) {
						getMopidy().playback.play();
					}
				});
			}
		});
	}

	render() {

		return (

			<tr className="clickable-row" onClick={this.handleClick.bind(this)} >
        <td>{ this.props.track.name }</td>
        <td><ArtistSentence artists={ this.props.track.artists }/></td>
        <td>{ this.props.track.album.name }</td>
      </tr>
		);
	}
}