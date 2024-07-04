import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import LandingPage from "./components/lp";
import ExodusSurvivors from "./components/ExodusSurvivors";

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
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/exodus-survivors" element={<ExodusSurvivors />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
