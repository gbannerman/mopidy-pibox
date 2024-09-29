import React, { useState, useEffect } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import HomePage from "pages/HomePage";
import { Route, Switch, Redirect, useLocation } from "wouter";
import {
  onConnectionChanged,
  startSession,
  getConfig,
} from "services/mopidy.js";
import SessionPage from "pages/SessionPage.jsx";
import { AdminContext, useAdminContext } from "hooks/admin.js";
import NewSessionPage from "pages/NewSessionPage";
import DisplayPage from "pages/DisplayPage";
import { ConfigContext } from "hooks/config";
import { useSessionStarted } from "hooks/session";

const App = () => {
  const [config, setConfig] = useState(null);
  const [configFetching, setConfigFetching] = useState(true);
  const { sessionStarted, sessionStartedLoading, refetchSessionStarted } =
    useSessionStarted();
  const [connected, setConnected] = useState(false);

  const [_, navigate] = useLocation();

  const admin = useAdminContext();

  useEffect(() => {
    const cleanup = onConnectionChanged(setConnected);
    return () => cleanup();
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await getConfig();
      setConfig(config);
      setConfigFetching(false);
    };

    fetchConfig();
  }, []);

  const createSession = async ({
    votesToSkip,
    selectedPlaylists,
    automaticallyStartPlaying,
  }) => {
    await startSession(
      votesToSkip,
      selectedPlaylists,
      automaticallyStartPlaying,
    );
    refetchSessionStarted();
    navigate("/");
  };

  if (!connected || sessionStartedLoading || configFetching) {
    return (
      <div className="Root">
        <div className="loading">
          <h1>pibox</h1>
          <BounceLoader size={44} color="#00796B" />
        </div>
      </div>
    );
  }

  if (!sessionStarted) {
    return (
      <BaseProviders admin={admin} config={config}>
        <NewSessionPage onStartSessionClick={createSession} />
      </BaseProviders>
    );
  }

  return (
    <BaseProviders admin={admin} config={config}>
      <Switch>
        <Route path="/session">
          {admin.isAdmin ? <SessionPage /> : <Redirect to="/" replace />}
        </Route>
        <Route path="/display">
          <DisplayPage />
        </Route>
        <Route>
          <HomePage />
        </Route>
      </Switch>
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
