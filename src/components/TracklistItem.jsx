import React from 'react';
import ArtistSentence from './ArtistSentence.jsx';
import Card, { CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import SkipNext from 'material-ui-icons/SkipNext';
import axios from 'axios';

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

  vote() {
    console.log(this.props.mopidy.fingerprint);
    axios.post('/pibox/api/vote', {
        uri: this.props.track.uri,
        fingerprint: this.props.mopidy.fingerprint
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

	render() {

		const { classes } = this.props;

		const artistSentence = (<ArtistSentence artists={ this.props.track.artists } />);

		return (

			<Card className={classes.card}>
				<CardContent className={classes.content}>
					<Typography type="subheading" component="h2">{ this.props.track.name }</Typography>
					<Typography type="body2" component="h2">{artistSentence}</Typography>
				</CardContent>
				<CardActions className={classes.actions}>
          <Button dense onClick={this.vote.bind(this)} color="primary">
            Vote
            <SkipNext className={classes.rightIcon}/>
          </Button>
        </CardActions>
			</Card>
		);
	}
}

export default withStyles(styles)(TracklistItem);