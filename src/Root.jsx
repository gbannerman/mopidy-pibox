import React, { lazy } from "react";
import HomePage from "pages/HomePage";
import { Route, Switch, Redirect, useLocation } from "wouter";
import { startSession } from "services/mopidy.js";
import { AdminContext, useAdminContext } from "hooks/admin.js";
import { useConfig } from "hooks/config";
import { useSessionStarted } from "hooks/session";
import { LoadingScreen } from "components/common/LoadingScreen";
import { useConnected } from "hooks/connection";

const NewSessionPage = lazy(() => import("./pages/NewSessionPage.jsx"));
const SessionPage = lazy(() => import("./pages/SessionPage.jsx"));
const DisplayPage = lazy(() => import("./pages/DisplayPage.jsx"));

const App = () => {
  const { sessionStarted, sessionStartedLoading, refetchSessionStarted } =
    useSessionStarted();
  const { configLoading } = useConfig();
  const connected = useConnected();

  const [_, navigate] = useLocation();

  const admin = useAdminContext();

  const createSession = async ({
    votesToSkip,
    selectedPlaylists,
    automaticallyStartPlaying,
    enableShuffle,
  }) => {
    await startSession(
      votesToSkip,
      selectedPlaylists,
      automaticallyStartPlaying,
      enableShuffle,
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
