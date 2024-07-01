import React, { useRef, useState } from "react";
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import CloudCircleIcon from "@mui/icons-material/CloudCircle";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";

const UploadBox = ({ onFileChange, onSendToExodus, uploading }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      onFileChange(file);
      console.log("File selected via drag and drop:", file);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileChange(file);
      console.log("File selected via input:", file);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        p: 2,
        border: "1px dashed #673ab7",
        borderRadius: "8px",
        textAlign: "center",
        cursor: "pointer",
        position: "relative",
        backgroundColor: isDragging ? "#1a1c20" : "inherit",
      }}
      onClick={handleBoxClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CloudUploadIcon sx={{ fontSize: 50, color: "#00bcd4" }} />
      <Typography variant="h6" color="#00bcd4">
        Drop your video file
      </Typography>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </Box>
  );
};

export default UploadBox;
