import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import CloudCircleIcon from "@mui/icons-material/CloudCircle";

import CustomizedMenus from "./ProcessingTypes";

const VideoDetails = ({
  videoFile,
  thumbnailUrl,
  uploading,
  onSendToExodus,
  onProcessingTypeSelect,
}) => {
  const handleProcessingTypeSelect = (type) => {
    onProcessingTypeSelect(type);
  };
  return (
    <Card
      sx={{
        display: "flex",
        backgroundColor: "#18181b",
        mx: "auto",
        maxWidth: "80%",
        borderRadius: "8px",
        padding: 2,
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: 160,
          height: 160,
          borderRadius: 2,
          objectFit: "cover",
        }}
        image={thumbnailUrl}
        alt="Video thumbnail"
      />
      <Box
        sx={{ display: "flex", flexDirection: "column", flexGrow: 1, ml: 2 }}
      >
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography
            component="div"
            variant="h4"
            style={{ fontWeight: "bold" }}
          >
            {videoFile.name}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              {`${(videoFile.size / (1024 * 1024)).toFixed(2)} MB`}
            </Typography>
            <Typography
              component="div"
              style={{ color: "#00e676", alignContent: "center" }}
            >
              {new Date(videoFile.lastModified).toLocaleDateString()}
            </Typography>
            <Chip
              icon={<KeyboardDoubleArrowUpIcon />}
              label={videoFile.type}
              size="small"
            />
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 2, mb: -2 }}>
            <CustomizedMenus
              text={uploading ? "Uploading..." : "Send to AWS"}
              variant="outlined"
              startIcon={<ThunderstormIcon />}
              disabled={uploading}
              onProcessingTypeSelect={handleProcessingTypeSelect}
            ></CustomizedMenus>
            <Button
              variant="contained"
              endIcon={<CloudCircleIcon />}
              onClick={onSendToExodus}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Send to Exodus"}
            </Button>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};

export default VideoDetails;
