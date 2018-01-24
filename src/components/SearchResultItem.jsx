import React from 'react';
import ArtistSentence from './ArtistSentence.jsx'
import '../style/SearchResultItem.css';
import {Card, CardHeader} from 'material-ui/Card';

export default class SearchResultItem extends React.Component {

	static contextTypes = {
    router: () => true, // replace with PropTypes.object if you use them
  }

	handleClick() {
		this.props.queueTrack(this.props.track, this.context.router.history.goBack);
	}

	render() {

		const textStyle = {
		  padding: 5,
		};

		const style = {
		  margin: 10,
		  cursor: 'pointer'
		};

		const artistAndAlbum = (<span><ArtistSentence artists={ this.props.track.artists } /> - {this.props.track.album.name}</span>);

		return (

			<Card style={style} onClick={this.handleClick.bind(this)}>
				<CardHeader 
					title={ this.props.track.name }
					subtitle={artistAndAlbum}
					textStyle={textStyle}
				/>
			</Card>
		);
	}
}