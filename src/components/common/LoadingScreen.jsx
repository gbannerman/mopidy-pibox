import React from "react";
import { BounceLoader } from "react-spinners";

export const LoadingScreen = () => {
  return (
    <div className="loading">
      <h1>pibox</h1>
      <BounceLoader size={44} color="#00796B" />
    </div>
  );
};
