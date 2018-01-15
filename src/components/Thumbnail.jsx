import React from 'react';
import '../style/Thumbnail.css';

export default class Thumbnail extends React.Component {

	render() {

		return (

			<img src={this.props.url} alt="Album artwork"/>
		);
	}
}