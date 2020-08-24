import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import { initialiseFingerprint } from "services/fingerprint";
import { initialiseMopidy } from "services/mopidy";
import MopidyRoot from "MopidyRoot";
import "./style/index.css";

const initialise = async () => {
  await initialiseFingerprint();
  await initialiseMopidy();

  ReactDOM.render(
    <Router>
      <MopidyRoot />
    </Router>,
    document.getElementById("root")
  );
};

initialise();

registerServiceWorker();
