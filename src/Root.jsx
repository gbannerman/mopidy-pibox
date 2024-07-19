import React, { useState, useEffect } from "react";
import BounceLoader from "react-spinners/BounceLoader";
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
import SessionPage from "pages/SessionPage.jsx";
import { AdminContext, useAdminContext } from "hooks/admin.js";
import NewSessionPage from "pages/NewSessionPage";
import { SessionContext } from "hooks/session";
import DisplayPage from "pages/DisplayPage";
import { ConfigContext } from "hooks/config";

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
      <BaseProviders admin={admin} config={config}>
        <NewSessionPage onStartSessionClick={createSession} />
      </BaseProviders>
    );
  }

  return (
    <BaseProviders admin={admin} config={config}>
      <SessionContext.Provider
        value={{
          playlistName: session.playlist.name,
          skipThreshold: session.skipThreshold,
          startedAt: dayjs(session.startTime),
          playedTracks: session.playedTracks,
          remainingPlaylistTracks: session.remainingPlaylistTracks,
        }}
      >
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
      </SessionContext.Provider>
    </BaseProviders>
  );
};

function BaseProviders({ children, admin, config }) {
  return (
    <AdminContext.Provider value={admin}>
      <ConfigContext.Provider value={config}>
        <div className="Root">{children}</div>
      </ConfigContext.Provider>
    </AdminContext.Provider>
  );
}

export default App;
