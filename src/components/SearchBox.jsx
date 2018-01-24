import React from 'react';
import '../style/SearchBox.css';

export default class SearchBox extends React.Component {

	render() {

		return (
			<form className="search-box-form" onSubmit={this.props.handleSubmit} method="POST">
        <input name="query" type="text" value={ this.props.term } id="searchField" placeholder="search" autoComplete="off" autofocus="true"/>
      </form>
		);
	}
}
