import React from 'react';
import '../style/SearchBox.css';
import { getMopidy } from '../App.js';

export default class SearchBox extends React.Component {

	render() {

		return (

			<form onSubmit={this.props.handleSubmit} method="POST">
        <input name="query" type="text" id="searchField" placeholder="search songs, artists, etc..." autoComplete="off"/>
        <input type="submit" name="submit" />
      </form>
		);
	}
}
