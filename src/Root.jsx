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
  getConfig,
  onTrackPlaybackEnded,
} from "services/mopidy.js";
import { SnackbarProvider } from "notistack";
import SessionPage from "pages/SessionPage.jsx";
import { AdminContext, useAdminContext } from "hooks/admin.js";
import CssBaseline from "@material-ui/core/CssBaseline";
import NewSessionPage from "pages/NewSessionPage";
import { SessionContext } from "hooks/session";
import DisplayPage from "pages/DisplayPage";
import { ConfigContext } from "hooks/config";

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
  const [config, setConfig] = useState(null);
  const [sessionFetching, setSessionFetching] = useState(true);
  const [configFetching, setConfigFetching] = useState(true);

  const [connected, setConnected] = useState(false);

  const history = useHistory();

  const admin = useAdminContext();

  useEffect(() => {
    onConnectionChanged(setConnected);
  }, []);

  useEffect(() => {
    const updateCurrentSession = async () => {
      const currentSession = await getCurrentSession();
      setSession(currentSession);
      setSessionFetching(false);
    };

    const fetchConfig = async () => {
      const config = await getConfig();
      setConfig(config);
      setConfigFetching(false);
    };

    const cleanupSessionStarted = onSessionStarted(async () => {
      updateCurrentSession();
    });
    const cleanupTrackPlaybackEnded = onTrackPlaybackEnded(async () => {
      updateCurrentSession();
    });
    const cleanupSessionEnded = onSessionEnded(async () => {
      updateCurrentSession();
    });
    fetchConfig();
    updateCurrentSession();

    return () => {
      cleanupSessionStarted();
      cleanupSessionEnded();
      cleanupTrackPlaybackEnded();
    };
  }, []);

  const createSession = async ({
    votesToSkip,
    selectedPlaylist,
    automaticallyStartPlaying,
  }) => {
    await startSession(
      votesToSkip,
      selectedPlaylist,
      automaticallyStartPlaying,
    );
    history.push("/pibox");
  };

  if (!connected || sessionFetching || configFetching) {
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
      <ConfigContext.Provider value={config}>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <div className="Root">
              <NewSessionPage onStartSessionClick={createSession} />
            </div>
          </SnackbarProvider>
        </ThemeProvider>
      </ConfigContext.Provider>
    );
  }

  return (
    <AdminContext.Provider value={admin}>
      <ConfigContext.Provider value={config}>
        <SessionContext.Provider
          value={{
            playlistName: session.playlist.name,
            skipThreshold: session.skipThreshold,
            startedAt: dayjs(session.startTime),
            playedTracks: session.playedTracks,
            remainingPlaylistTracks: session.remainingPlaylistTracks,
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
      </ConfigContext.Provider>
    </AdminContext.Provider>
  );
};

export default App;
