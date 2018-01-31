import React from 'react';
import '../style/Thumbnail.css';

export default class Thumbnail extends React.Component {

	render() {

		return (

			<img className="thumbnail--artwork" src={this.props.url} alt="Album artwork"/>
		);
	}
}