import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { initialiseFingerprint } from "services/fingerprint";
import { initialiseMopidy } from "services/mopidy";
import Root from "./Root";
import "./index.css";

dayjs.extend(relativeTime);

const initialise = async () => {
  await initialiseFingerprint();
  await initialiseMopidy();

  ReactDOM.render(
    <Router>
      <Root />
    </Router>,
    document.getElementById("root")
  );
};

initialise();
