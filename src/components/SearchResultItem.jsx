import React from 'react';
import ArtistSentence from './ArtistSentence.jsx'
import '../style/SearchResultItem.css';
import { getMopidy } from '../App.js';

export default class SearchResultItem extends React.Component {

	handleClick() {
		console.log("Queued " + this.props.track.uri);
		// TODO Check if played already
		getMopidy().tracklist.add([this.props.track.uri]);
	}

	render() {

		return (

			<tr className="clickable-row" onClick={this.handleClick.bind(this)} data-url="/pibox/add/?uri={{ track.uri }}">
        <td>{ this.props.track.title }</td>
        <td><ArtistSentence artists={ this.props.track.artists }/></td>
        <td>{ this.props.track.album }</td>
      </tr>
		);
	}
}