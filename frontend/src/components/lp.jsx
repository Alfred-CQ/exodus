import React, { useRef, useState } from "react";
import axios from "axios";
import { Box, Container, Typography } from "@mui/material";
import UploadBox from "./UploadBox";
import VideoDetails from "./VideoDetails";
import ProgressBar from "./ProgressBar";

const LandingPage = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (file) => {
    setVideoFile(file);
    getThumbnail(file);
  };

  const getThumbnail = (videoFile) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      video.currentTime = 1;
      video.onseeked = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL("image/jpeg");
        setThumbnailUrl(thumbnailUrl);
      };
    };
    video.src = URL.createObjectURL(videoFile);
  };

  const handleSendToExodus = () => {
    if (!videoFile) {
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", videoFile);

    axios
      .post("http://localhost:5000/upload-video", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      })
      .then((response) => {
        console.log("File uploaded successfully");
        setUploading(false);
        setProgress(0);
        setVideoFile(null);
        setThumbnailUrl("");
      })
      .catch((error) => {
        console.error("There was a problem with your axios operation:", error);
        setUploading(false);
        setProgress(0);
      });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h2" sx={{ textAlign: "center", marginBottom: 4 }}>
        EXODUS Video Pipeline Processing
      </Typography>
      <UploadBox
        onFileChange={handleFileChange}
        onSendToExodus={handleSendToExodus}
        uploading={uploading}
      />
      {videoFile && (
        <Box sx={{ mt: 4 }}>
          <VideoDetails
            videoFile={videoFile}
            thumbnailUrl={thumbnailUrl}
            uploading={uploading}
            onSendToExodus={handleSendToExodus}
          />
          {uploading && <ProgressBar progress={progress} />}
        </Box>
      )}
    </Container>
  );
};

export default LandingPage;
