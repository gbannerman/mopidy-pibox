import React, { useState, useEffect } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import BounceLoader from "react-spinners/BounceLoader";
import teal from "@material-ui/core/colors/teal";
import pink from "@material-ui/core/colors/pink";
import HomePage from "pages/HomePage";
import {
  Route,
  Switch,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import {
  getCurrentSession,
  onSessionStarted,
  onSessionEnded,
  onConnectionChanged,
} from "services/mopidy.js";
import { SnackbarProvider } from "notistack";
import SessionPage from "pages/SessionPage.jsx";
import { AdminContext, useAdminContext } from "hooks/admin.js";
import CssBaseline from "@material-ui/core/CssBaseline";

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
  const [connected, setConnected] = useState(false);

  const history = useHistory();
  const location = useLocation();

  const admin = useAdminContext();

  useEffect(() => {
    onConnectionChanged(setConnected);
  }, []);

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
    !connected ||
    !session ||
    (session && fetching) ||
    (session &&
      !session.started &&
      location.pathname !== "/pibox/session" &&
      !fetching)
  ) {
    return (
      <div className="Root">
        <div className="loading">
          <h1>pibox</h1>
          <BounceLoader size={44} color="#00796B" />
        </div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={admin}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <div className="Root">
            <Switch>
              {admin.isAdmin ? (
                <Route path="/pibox/session">
                  <SessionPage session={session} />
                </Route>
              ) : (
                <Redirect from="/pibox/session" to="/pibox" />
              )}
              <Route>
                <HomePage />
              </Route>
            </Switch>
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </AdminContext.Provider>
  );
};

export default App;

export function getMopidy() {
  return null;
}
