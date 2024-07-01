import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import LandingPage from "./components/lp";

const appTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0f1214",
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <LandingPage />
    </ThemeProvider>
  );
}
