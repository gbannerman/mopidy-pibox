import React from "react";
import placeholder from "res/placeholder.png";

const Thumbnail = ({ url }) => {
  return (
    <img
      className="w-full h-auto max-w-56 min-w-40 rounded-xl"
      src={url || placeholder}
      alt="Album artwork"
    />
  );
};

export default Thumbnail;
