import React from "react";
import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { teal, pink } from "@mui/material/colors";
import { SnackbarProvider } from "notistack";
import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { initialiseFingerprint } from "services/fingerprint";
import { initialiseMopidy } from "services/mopidy";
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
    <Router base="/pibox">
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <QueryClientProvider client={queryClient}>
              <Root />
              <ReactQueryDevtools />
            </QueryClientProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </Router>,
  );
};

initialise();
