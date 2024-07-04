import React, { useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UploadBox = ({ onFilesChange }) => {
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
    const filesArray = Array.from(event.dataTransfer.files);
    console.log("File selected via drag and drop:", filesArray);
    if (filesArray.length > 0) {
      handleFileChange(filesArray);
    }
  };

  const handleInput = (event) => {
    const filesArray = Array.from(event.target.files);
    console.log("File selected via input:", filesArray);
    if (filesArray.length > 0) {
      handleFileChange(filesArray);
    }
  };

  const handleFileChange = (files) => {
    onFilesChange(files);
  };

  return (
    <Box
      component="section"
      sx={{
        p: 2,
        border: "1px dashed #00bcd4",
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
        onChange={handleInput}
        multiple
        style={{ display: "none" }}
      />
    </Box>
  );
};

export default UploadBox;
