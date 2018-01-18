import React from 'react';
import ArtistSentence from './ArtistSentence.jsx'
import '../style/SearchResultItem.css';
import { getMopidy } from '../App.js';
import { toast } from 'react-toastify';
import {Card, CardHeader} from 'material-ui/Card';

export default class SearchResultItem extends React.Component {

	static contextTypes = {
    router: () => true, // replace with PropTypes.object if you use them
  }

	handleClick() {
		getMopidy().history.getHistory().done((history) => {
			if (history.filter(tuple => (tuple[1].uri === this.props.track.uri)).length > 0) {
				let message = "This track has already been played";
				toast.warn(message, {
					position: toast.POSITION.BOTTOM_CENTER,
					autoClose: 3500
				});
			} else if (this.props.tracklist.filter(track => (track.uri === this.props.track.uri)).length > 0) {
				let message = "This track has already been queued";
				toast.warn(message, {
					position: toast.POSITION.BOTTOM_CENTER,
					autoClose: 3500
				});
			} else {
				let message = this.props.track.name + " was added to the queue";
				getMopidy().tracklist.add([this.props.track], null, null, null).done(() => {
					toast.info(message, {
						position: toast.POSITION.BOTTOM_CENTER
					});
					if ((this.props.tracklist.length >= 1 && this.props.tracklist[0].uri === this.props.track.uri) || this.props.tracklist.length === 0) {
						getMopidy().playback.play();
					}
					this.context.router.history.goBack();
				});
			}
		});
	}

	render() {

		const textStyle = {
		  padding: 5,
		};

		const style = {
		  margin: 10
		};

		const artistSentence = (<ArtistSentence artists={ this.props.track.artists } />);

		return (

			<Card style={style} onClick={this.handleClick.bind(this)}>
				<CardHeader 
					title={ this.props.track.name }
					subtitle={artistSentence + " - " + this.props.track.album.name}
					textStyle={textStyle}
				/>
			</Card>
		);
	}
}