import React, { useState, useEffect } from "react";
import HomePage from "pages/HomePage";
import { Route, Switch, Redirect, useLocation } from "wouter";
import { onConnectionChanged, startSession } from "services/mopidy.js";
import SessionPage from "pages/SessionPage.jsx";
import { AdminContext, useAdminContext } from "hooks/admin.js";
import NewSessionPage from "pages/NewSessionPage";
import DisplayPage from "pages/DisplayPage";
import { useConfig } from "hooks/config";
import { useSessionStarted } from "hooks/session";
import { LoadingScreen } from "components/common/LoadingScreen";

const App = () => {
  const { sessionStarted, sessionStartedLoading, refetchSessionStarted } =
    useSessionStarted();
  const { configLoading } = useConfig();
  const [connected, setConnected] = useState(false);

  const [_, navigate] = useLocation();

  const admin = useAdminContext();

  useEffect(() => {
    const cleanup = onConnectionChanged(setConnected);
    return () => cleanup();
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

  if (!connected || sessionStartedLoading || configLoading) {
    return (
      <div className="Root">
        <LoadingScreen />
      </div>
    );
  }

  if (!sessionStarted) {
    return (
      <BaseProviders admin={admin}>
        <NewSessionPage onStartSessionClick={createSession} />
      </BaseProviders>
    );
  }

  return (
    <BaseProviders admin={admin}>
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

function BaseProviders({ children, admin }) {
  return (
    <AdminContext.Provider value={admin}>
      <div className="Root">{children}</div>
    </AdminContext.Provider>
  );
}

export default App;
