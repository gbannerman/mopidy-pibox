import React from 'react';
import '../style/SearchBox.css';
import { getMopidy } from '../App.js';

export default class SearchBox extends React.Component {

	processData(e) {
		e.preventDefault();
		let queryParameters = e.target.query.value.split(" ");
		getMopidy().library.search({'any': queryParameters}, ['spotify:'], false).done(this.props.handleSubmit);
	}

	render() {

		return (

			<form onSubmit={this.processData.bind(this)} method="POST">
        <input name="query" type="text" id="searchField" placeholder="search songs, artists, etc..." autoComplete="off"/>
        <input type="submit" name="submit" />
      </form>
		);
	}
}
