import React from "react";
import ArtistSentence from "components/common/ArtistSentence";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";

const TracklistItem = ({
  track,
  skipThreshold,
  buttonEnabled,
  onVoteClick,
}) => {
  const artistSentence = <ArtistSentence artists={track.info.artists} />;

  const buttonIcon = track.voted ? null : <SkipNextIcon className="ml-1" />;

  return (
    <Card className="m-2 flex justify-between items-center">
      <CardContent className="p-4">
        <Typography type="subheading" component="h2">
          {track.info.name}
        </Typography>
        <Typography type="body2" component="h2">
          {artistSentence}
        </Typography>
      </CardContent>
      <CardActions className="flex grow-0 shrink-0">
        <Button
          disabled={!buttonEnabled}
          onClick={onVoteClick}
          color="secondary"
        >
          {track.voted
            ? track.votes + "/" + skipThreshold + " votes"
            : "Vote to skip"}
          {buttonIcon}
        </Button>
      </CardActions>
    </Card>
  );
};

export default TracklistItem;
