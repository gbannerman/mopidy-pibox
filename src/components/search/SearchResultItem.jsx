import React from "react";
import ArtistSentence from "components/common/ArtistSentence";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";
import { getIconFromURI } from "utils/uris";

const SearchResultItem = ({ track, onClick }) => {
  const artistAndAlbum = (
    <span>
      <ArtistSentence artists={track.artists?.length ? track.artists : [{ name: "Unknown Artist" }]
}
 /> - {track.album?.name ?? "Unknown Album"}
    </span>
  );

  const Icon = getIconFromURI(track.uri);

  return (
    <Card
      sx={{
        margin: 1,
        padding: 1,
        display: "flex",
        alignItems: "center",
      }}
      onClick={() => onClick(track)}
    >
      <CardMedia>
        <Icon />
      </CardMedia>
      <CardContent
        sx={{ padding: 1, overflowX: "hidden", ":last-child": { p: 1 } }}
      >
        <Typography noWrap type="body2" component="h2">
          {track.name}
        </Typography>
        <Typography noWrap type="body1" component="h2">
          {artistAndAlbum}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SearchResultItem;
