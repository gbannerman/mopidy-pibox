import React, { useState, useEffect } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import BounceLoader from "react-spinners/BounceLoader";
import teal from "@material-ui/core/colors/teal";
import pink from "@material-ui/core/colors/pink";
import HomePage from "pages/HomePage";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import dayjs from "dayjs";
import {
  getCurrentSession,
  onSessionStarted,
  onSessionEnded,
  onConnectionChanged,
  startSession,
} from "services/mopidy.js";
import { SnackbarProvider } from "notistack";
import SessionPage from "pages/SessionPage.jsx";
import { AdminContext, useAdminContext } from "hooks/admin.js";
import CssBaseline from "@material-ui/core/CssBaseline";
import SessionForm from "components/SessionForm";
import { SessionContext } from "hooks/session";
import DisplayPage from "pages/DisplayPage";

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
  const [fetching, setFetching] = useState(true);
  const [connected, setConnected] = useState(false);

  const history = useHistory();

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

  const createSession = async ({ votesToSkip, selectedPlaylist }) => {
    await startSession(votesToSkip, selectedPlaylist);
    history.push("/pibox");
  };

  if (!connected || fetching) {
    return (
      <div className="Root">
        <div className="loading">
          <h1>pibox</h1>
          <BounceLoader size={44} color="#00796B" />
        </div>
      </div>
    );
  }

  if (!session?.started) {
    return (
      <>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <div className="Root">
              <SessionForm
                defaultPlaylistUri={"spotify:playlist:79inBfAlnfUB7i5kRthmWL"}
                onStartSessionClick={createSession}
              />
            </div>
          </SnackbarProvider>
        </ThemeProvider>
      </>
    );
  }

  return (
    <AdminContext.Provider value={admin}>
      <SessionContext.Provider
        value={{
          playlistName: session.playlist.name,
          skipThreshold: session.skipThreshold,
          startedAt: dayjs(session.startTime),
        }}
      >
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
                  <Route
                    path="/pibox/session"
                    render={() => <Redirect to="/pibox" />}
                  />
                )}
                <Route path="/pibox/display">
                  <DisplayPage session={session} />
                </Route>
                <Route>
                  <HomePage session={session} />
                </Route>
              </Switch>
            </div>
          </SnackbarProvider>
        </ThemeProvider>
      </SessionContext.Provider>
    </AdminContext.Provider>
  );
};

export default App;

export function getMopidy() {
  return null;
}
