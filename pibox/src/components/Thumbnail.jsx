import React from 'react';
import '../style/Thumbnail.css';

export default class Thumbnail extends React.Component {

	render() {

		const TEST_URL = "https://i.scdn.co/image/cc8f153161d0a16761db976882614563d2f9e988";

		return (

			<img src={TEST_URL}/>
		);
	}
}