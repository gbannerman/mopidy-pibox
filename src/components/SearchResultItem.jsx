import React from 'react';
import ArtistSentence from './ArtistSentence.jsx'
import '../style/SearchResultItem.css';
import { getMopidy } from '../App.js';
import { notify } from 'react-notify-toast';

export default class SearchResultItem extends React.Component {

	handleClick() {
		// TODO Check if played already
		notify.show('Toasty!');
		getMopidy().tracklist.add([this.props.track], null, null, null).done(() => {
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