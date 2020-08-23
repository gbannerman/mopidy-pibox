import React, { useState, useEffect } from "react";
import { onConnectionChanged } from "services/mopidy";
import Spinner from "react-spinkit";
import App from "App";

const MopidyRoot = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    onConnectionChanged(setConnected);
  }, []);

  if (!connected) {
    return (
      <div className="App">
        <div className="loading">
          <h1>pibox</h1>
          <Spinner fadeIn="quarter" name="double-bounce" color="#00796B" />
        </div>
      </div>
    );
  }

  return <App />;
};

export default MopidyRoot;
