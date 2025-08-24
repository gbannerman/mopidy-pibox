import React from "react";

export default function ArtistSentence({ artists }) {
  if (!artists || !artists.length) {
    return <span>Unknown Artist</span>;
  }

  return (
    <span className="artist-sentence">
      {artists.map((artist, index) => {
        if (!artist) {
          return <span key={index}>Unknown Artist</span>;
        }

        var separator = null;
        if (index === artists.length - 2) {
          separator = " and ";
        } else if (index < artists.length - 2) {
          separator = ", ";
        }

        let content = <span>-</span>;

        if (artist) {
          content = <span>{artist.name}</span>;
        }

        return (
          <span key={"artist_" + index}>
            {content}
            {separator}
          </span>
        );
      })}
    </span>
  );
}
