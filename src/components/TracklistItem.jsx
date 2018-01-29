import React from 'react';
import ArtistSentence from './ArtistSentence.jsx';
import Card, { CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import SkipNext from 'material-ui-icons/SkipNext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { css } from 'glamor';

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

let warningToast = (message) => {
  toast(message, {
    autoClose: 3500,
    className: css({
      backgroundColor: "#FF9800",
      color: "#FFFFFF"
    })
  });
};

class TracklistItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {voted: false, fetching: false};
  }

  vote() {
    this.setState({fetching: true});
    console.log(this.props.mopidy.fingerprint);
    axios.post('/pibox/api/vote', {
        uri: this.props.track.uri,
        fingerprint: this.props.mopidy.fingerprint
      })
      .then((response) => {
        this.setState({voted: true});
        console.log(response);
      })
      .catch((error) => {
        this.setState({fetching: false});
        if (error.code === '15') {
          this.setState({voted: true});
          warningToast("You have already voted to skip this track");
        } else {
          warningToast("An error occurred, please try again");
        }
      });
  }

	render() {

		const { classes } = this.props;

		const artistSentence = (<ArtistSentence artists={ this.props.track.artists } />);

    const buttonIcon = this.state.voted ? null : <SkipNext className={classes.rightIcon}/> 

		return (

			<Card className={classes.card}>
				<CardContent className={classes.content}>
					<Typography type="subheading" component="h2">{ this.props.track.name }</Typography>
					<Typography type="body2" component="h2">{artistSentence}</Typography>
				</CardContent>
				<CardActions className={classes.actions}>
          <Button disabled={ (this.state.fetching || this.state.voted) } dense onClick={this.vote.bind(this)} color="primary">
            { this.state.voted ? 'Voted' : 'Vote' }
            { buttonIcon }
          </Button>
        </CardActions>
			</Card>
		);
	}
}

export default withStyles(styles)(TracklistItem);