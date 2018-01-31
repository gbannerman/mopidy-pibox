import React from 'react';
import ArtistSentence from './ArtistSentence.jsx';
import Card, { CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import SkipNext from 'material-ui-icons/SkipNext';

const styles = theme => ({
  card: {
    margin: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
  	paddingLeft: 15,
  	paddingTop: 15,
  	paddingBottom: 15,
  	paddingRight: 5
  },
  actions: {
  	flex: '0 0 auto'
  },
  rightIcon: {
  	marginLeft: 3
  }
});

class TracklistItem extends React.Component {

  handleClick() {
    this.props.handleClick(this.props.track, this.props.mopidy.fingerprint);
  }

	render() {

		const { classes } = this.props;

		const artistSentence = (<ArtistSentence artists={ this.props.track.artists } />);

    const buttonIcon = this.props.track.voted ? null : <SkipNext className={classes.rightIcon}/> 

		return (

			<Card className={classes.card}>
				<CardContent className={classes.content}>
					<Typography type="subheading" component="h2">{ this.props.track.name }</Typography>
					<Typography type="body2" component="h2">{artistSentence}</Typography>
				</CardContent>
				<CardActions className={classes.actions}>
          <Button disabled={ (this.props.track.fetching || this.props.track.voted) } dense onClick={this.handleClick.bind(this)} color="primary">
            { this.props.track.voted ? 'Voted' : 'Vote' }
            { buttonIcon }
          </Button>
        </CardActions>
			</Card>
		);
	}
}

export default withStyles(styles)(TracklistItem);