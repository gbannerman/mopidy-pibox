import React from 'react';
import ArtistSentence from './ArtistSentence.jsx';
import {Card, CardHeader} from 'material-ui/Card';

export default class TracklistItem extends React.Component {

	render() {

		const textStyle = {
		  padding: 5,
		};

		const style = {
		  margin: 10
		};

		const artistSentence = (<ArtistSentence artists={ this.props.track.artists } />);

		return (

			<Card style={style} >
				<CardHeader 
					title={ this.props.track.name }
					subtitle={artistSentence}
					textStyle={textStyle}
				/>
			</Card>
		);
	}
}