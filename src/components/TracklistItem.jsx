import React from "react";
import ArtistSentence from "./ArtistSentence.jsx";
import { makeStyles } from "@material-ui/core/styles";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 5,
  },
  actions: {
    flex: "0 0 auto",
  },
  rightIcon: {
    marginLeft: 3,
  },
}));

const TracklistItem = ({
  track,
  skipThreshold,
  buttonEnabled,
  onVoteClick,
}) => {
  const classes = useStyles();

  const artistSentence = <ArtistSentence artists={track.info.artists} />;

  const buttonIcon = track.voted ? null : (
    <SkipNextIcon className={classes.rightIcon} />
  );

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Typography type="subheading" component="h2">
          {track.info.name}
        </Typography>
        <Typography type="body2" component="h2">
          {artistSentence}
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button
          disabled={!buttonEnabled}
          onClick={onVoteClick}
          color="secondary"
        >
          {track.voted ? track.votes + "/" + skipThreshold + " votes" : "Vote"}
          {buttonIcon}
        </Button>
      </CardActions>
    </Card>
  );
};

export default TracklistItem;
