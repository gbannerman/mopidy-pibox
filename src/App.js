import React, { useState, useEffect } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Spinner from "react-spinkit";
import teal from "@material-ui/core/colors/teal";
import pink from "@material-ui/core/colors/pink";
import Home from "./components/Home.jsx";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import {
  getCurrentSession,
  onSessionStarted,
  onSessionEnded,
} from "services/mopidy.js";
import { SnackbarProvider } from "notistack";
import "./style/App.css";
import SessionPage from "pages/SessionPage.jsx";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[500],
    },
    secondary: {
      main: pink[500],
    },
  },
});

const App = () => {
  const [session, setSession] = useState(null);
  const [fetching, setFetching] = useState(false);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const updateCurrentSession = async () => {
      setFetching(true);
      const currentSession = await getCurrentSession();
      setSession(currentSession);
      setFetching(false);
    };

    onSessionStarted(async () => {
      updateCurrentSession();
    });
    onSessionEnded(async () => {
      updateCurrentSession();
    });
    updateCurrentSession();
  }, []);

  useEffect(() => {
    if (
      session &&
      !session.started &&
      location.pathname !== "/pibox/session" &&
      !fetching
    ) {
      history.push("/pibox/session");
    }
  }, [location, history, session, fetching]);

  if (
    !session ||
    (session && fetching) ||
    (session &&
      !session.started &&
      location.pathname !== "/pibox/session" &&
      !fetching)
  ) {
    return <Spinner fadeIn="quarter" name="double-bounce" color="#00796B" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <div className="App">
          <Switch>
            <Route path="/pibox/session">
              <SessionPage session={session} />
            </Route>
            <Route>
              <Home />
            </Route>
          </Switch>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;

export function getMopidy() {
  return null;
}
