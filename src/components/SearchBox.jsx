import React from 'react';
import '../style/SearchBox.css';
import { getMopidy } from '../App.js';

export default class SearchBox extends React.Component {

	logResults(results) {
		console.log(results);
	}

	processData(e) {
		e.preventDefault();
		console.log(e.target.query.value);
		getMopidy().library.search({'any': [e.target.query.value]}, ['spotify:'], false).done(this.logResults);
	}

	render() {

		return (

			<form onSubmit={this.processData} method="POST">
        <input name="query" type="text" id="searchField" placeholder="search songs, artists, etc..." autoComplete="off"/>
        <input type="submit" name="submit" />
      </form>
		);
	}
}