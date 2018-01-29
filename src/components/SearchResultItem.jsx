import React from 'react';
import ArtistSentence from './ArtistSentence.jsx'
import '../style/SearchResultItem.css';
import Card, { CardHeader} from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  card: {
    margin: 10,
  },
});

class SearchResultItem extends React.Component {

	static contextTypes = {
    router: () => true, // replace with PropTypes.object if you use them
  }

	handleClick() {
		this.props.queueTrack(this.props.track, this.context.router.history.goBack);
	}

	render() {

		const { classes } = this.props;

		const artistAndAlbum = (<span><ArtistSentence artists={ this.props.track.artists } /> - {this.props.track.album.name}</span>);

		return (

			<Card className={classes.card} onClick={this.handleClick.bind(this)}>
				<CardHeader 
					title={ this.props.track.name }
					subheader={artistAndAlbum}
				/>
			</Card>
		);
	}
}

export default withStyles(styles)(SearchResultItem);