import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

const ProgressBar = ({ progress }) => (
  <Box sx={{ mt: 2 }}>
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{ backgroundColor: "#1a1c20" }}
    />
    <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {`${Math.round(progress)}%`}
      </Typography>
    </Box>
  </Box>
);

export default ProgressBar;
