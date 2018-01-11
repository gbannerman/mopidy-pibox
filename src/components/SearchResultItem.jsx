import React from 'react';
import ArtistSentence from './ArtistSentence.jsx'
import '../style/SearchResultItem.css';
import { getMopidy } from '../App.js';
import { toast } from 'react-toastify';

export default class SearchResultItem extends React.Component {

	handleClick() {
		// TODO Check if played already
		let message = this.props.track.name + " was added to the queue"
		getMopidy().tracklist.add([this.props.track], null, null, null).done(() => {
			toast.info(message, {
				position: toast.POSITION.BOTTOM_CENTER
			});
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