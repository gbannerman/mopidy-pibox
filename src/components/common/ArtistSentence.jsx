import React from "react";

export default class ArtistSentence extends React.Component {
  render() {
    if (!this.props.artists) {
      return <span>-</span>;
    }

    return (
      <span
        className={
          this.props.className
            ? this.props.className + " artist-sentence"
            : "artist-sentence"
        }
      >
        {this.props.artists.map((artist, index) => {
          if (!artist) {
            return <span key={index}>-</span>;
          }

          var separator = null;
          if (index === this.props.artists.length - 2) {
            separator = " and ";
          } else if (index < this.props.artists.length - 2) {
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
}
