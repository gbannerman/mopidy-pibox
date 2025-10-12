import React from "react";
import { useSuggestions } from "hooks/suggestions";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { SearchItemAdditionalDetails } from "./SearchItemAdditionalDetails";

export function Suggestions({ onSuggestionSelected }) {
  const { suggestions, suggestionsLoading: loading, error } = useSuggestions();

  if (loading || error || !suggestions?.length) {
    return null;
  }

  return (
    <div className="w-full mt-16">
      <h2 className="text-gray-400 opacity-70 text-center">
        Can&apos;t think of a song?
      </h2>
      <h3 className="text-gray-400 opacity-70 text-center">
        Try one of these...
      </h3>
      <div className="w-full">
        {suggestions.map((suggestion, index) => (
          <Suggestion
            key={index}
            track={suggestion}
            onClick={() => onSuggestionSelected(suggestion)}
          />
        ))}
      </div>
    </div>
  );
}

function Suggestion({ track, onClick }) {
  return (
    <Card
      sx={{
        marginY: 2,
        marginX: 2,
        paddingLeft: 1,
        paddingRight: 1,
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgb(156 163 175 / 1)",
        opacity: 0.7,
      }}
      onClick={onClick}
    >
      <CardMedia>✨</CardMedia>
      <CardContent
        sx={{ padding: 1, overflowX: "hidden", ":last-child": { p: 1 } }}
      >
        <Typography noWrap type="body3" component="h2" fontSize={14}>
          {track.name}
        </Typography>
        <Typography noWrap type="body2" component="h2" fontSize={12}>
          <SearchItemAdditionalDetails track={track} />
        </Typography>
      </CardContent>
    </Card>
  );
}
