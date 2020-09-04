import React from "react";
import ArtistSentence from "components/common/ArtistSentence";
import {
  Card,
  CardContent,
  Typography,
  makeStyles,
  CardMedia,
} from "@material-ui/core";
import { getIconFromURI } from "utils/uris";

const useStyle = makeStyles((theme) => ({
  card: {
    margin: 10,
    padding: 5,
    display: "flex",
    alignItems: "center",
  },
  content: {
    padding: 8,
    overflowX: "hidden",
  },
}));

const SearchResultItem = ({ track, onClick }) => {
  const classes = useStyle();

  const artistAndAlbum = (
    <span>
      <ArtistSentence artists={track.artists} /> - {track.album.name}
    </span>
  );

  const Icon = getIconFromURI(track.uri);

  return (
    <Card className={classes.card} onClick={() => onClick(track)}>
      <CardMedia>
        <Icon />
      </CardMedia>
      <CardContent className={classes.content}>
        <Typography noWrap type="body2" component="h2">
          {track.name}
        </Typography>
        <Typography noWrap type="body1" component="h2">
          {artistAndAlbum}
        </Typography>
      </CardContent>
      <div></div>
    </Card>
  );
};

export default SearchResultItem;
