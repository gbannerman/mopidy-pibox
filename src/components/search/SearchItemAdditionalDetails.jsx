import React from "react";
import ArtistSentence from "components/common/ArtistSentence";

export function SearchItemAdditionalDetails({ track }) {
  return (
    <span>
      <ArtistSentence artists={track.artists} /> -{" "}
      {track.album?.name ?? "Unknown Album"}
    </span>
  );
}
