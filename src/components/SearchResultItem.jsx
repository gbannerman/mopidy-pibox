import React from "react";
import ArtistSentence from "./ArtistSentence.jsx";
import { Card, CardContent, Typography, makeStyles } from "@material-ui/core";
import "../style/SearchResultItem.css";

const useStyle = makeStyles((theme) => ({
  card: {
    margin: 10,
  },
  content: {
    padding: 8,
  },
}));

const SearchResultItem = ({ track, onClick }) => {
  const classes = useStyle();

  const artistAndAlbum = (
    <span>
      <ArtistSentence artists={track.artists} /> - {track.album.name}
    </span>
  );

  return (
    <Card className={classes.card} onClick={() => onClick(track)}>
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
