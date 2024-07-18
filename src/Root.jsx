import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BounceLoader from "react-spinners/BounceLoader";
import { teal, pink } from "@mui/material/colors";
import HomePage from "pages/HomePage";
import { Route, Switch, Redirect, useLocation } from "wouter";
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
import CssBaseline from "@mui/material/CssBaseline";
import NewSessionPage from "pages/NewSessionPage";
import { SessionContext } from "hooks/session";
import DisplayPage from "pages/DisplayPage";
import { ConfigContext } from "hooks/config";
import { StyledEngineProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: teal,
    secondary: pink,
  },
});

const App = () => {
  const [session, setSession] = useState(null);
  const [config, setConfig] = useState(null);
  const [sessionFetching, setSessionFetching] = useState(true);
  const [configFetching, setConfigFetching] = useState(true);

  const [connected, setConnected] = useState(false);

  const [_, navigate] = useLocation();

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
    navigate("/");
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
      <StyledEngineProvider injectFirst>
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
      </StyledEngineProvider>
    );
  }

  return (
    <StyledEngineProvider injectFirst>
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
                    <Route path="/session">
                      {admin.isAdmin ? (
                        <SessionPage session={session} />
                      ) : (
                        <Redirect to="/" replace />
                      )}
                    </Route>
                    <Route path="/display">
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
    </StyledEngineProvider>
  );
};

export default App;
