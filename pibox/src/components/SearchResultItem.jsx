import React from 'react';
import ArtistSentence from './ArtistSentence.jsx'
import '../style/SearchResultItem.css';

export default class SearchResultItem extends React.Component {

	render() {

		return (

			<tr class="clickable-row" data-url="/pibox/add/?uri={{ track.uri }}">
        <td>{ this.props.track.title }</td>
        <td><ArtistSentence artists={ this.props.track.artists }/></td>
        <td>{ this.props.track.album }</td>
      </tr>
		);
	}
}