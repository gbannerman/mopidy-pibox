import React from 'react';
import '../style/SearchBox.css';

export default class SearchBox extends React.Component {

	render() {

		return (
			<div className="search-box">
				<form className="search-box-form" onSubmit={this.props.handleSubmit} method="POST">
	        <input name="query" type="text" id="searchField" placeholder="search songs, artists, etc..." autoComplete="off"/>
	      </form>
      </div>
		);
	}
}
