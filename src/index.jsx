import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { teal, pink } from "@mui/material/colors";
import { Toaster } from "react-hot-toast";
import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { initialiseFingerprint } from "services/fingerprint";
import { initialiseMopidy } from "services/mopidy";
import { LoadingScreen } from "components/common/LoadingScreen";
import Root from "./Root";
import "./index.css";

dayjs.extend(relativeTime);

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: teal,
    secondary: pink,
  },
});

const initialise = async () => {
  await initialiseFingerprint();
  await initialiseMopidy();

  const root = createRoot(document.getElementById("root"));

  root.render(
    <Suspense
      fallback={
        <div className="Root">
          <LoadingScreen />
        </div>
      }
    >
      <Router base="/pibox">
        <StyledEngineProvider injectFirst>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <Root />
              <ReactQueryDevtools />
            </QueryClientProvider>
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 3500,
              }}
            />
          </ThemeProvider>
        </StyledEngineProvider>
      </Router>
    </Suspense>,
  );
};

initialise();
