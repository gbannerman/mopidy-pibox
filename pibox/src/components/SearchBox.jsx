import React from 'react';
import '../style/SearchBox.css';

export default class SearchBox extends React.Component {

	render() {

		return (

			<form action="/pibox/results/" method="POST">
        <input name="query" type="text" id="searchField" placeholder="search songs, artists, etc..." autocomplete="off"/>
      </form>
		);
	}
}