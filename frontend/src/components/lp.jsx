import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Container, Typography, Button, Fab } from "@mui/material";
import LandscapeIcon from "@mui/icons-material/Landscape";
import { useNavigate } from "react-router-dom";

import UploadBox from "./UploadBox";
import VideoDetails from "./VideoDetails";
import ProgressBar from "./ProgressBar";

const LandingPage = () => {
  const [videoFiles, setVideoFiles] = useState([]);
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [uploading, setUploading] = useState([]);
  const [progress, setProgress] = useState([]);

  const navigate = useNavigate();

  const navigateToExodus = () => {
    navigate("/exodus-survivors");
  };

  useEffect(() => {
    const generateThumbnails = async () => {
      const urls = [];
      for (let i = 0; i < videoFiles.length; i++) {
        const thumbnailUrl = await getThumbnail(videoFiles[i]);
        urls.push(thumbnailUrl);
      }
      setThumbnailUrls(urls);
    };

    generateThumbnails();
  }, [videoFiles]);

  const getThumbnail = async (videoFile) => {
    return new Promise((resolve) => {
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
          resolve(thumbnailUrl);
        };
      };
      video.src = URL.createObjectURL(videoFile);
    });
  };

  const handleFilesChange = (files) => {
    const newFiles = Array.from(files);
    setVideoFiles(newFiles);
    setUploading(newFiles.map(() => false));
    setProgress(newFiles.map(() => 0));
  };

  const handleSendToAWS = async () => {
    setUploading(videoFiles.map(() => true));

    try {
      await Promise.all(
        videoFiles.map((file, index) => sendToAWS(file, index))
      );
      console.log("All files uploaded to AWS successfully");
    } catch (error) {
      console.error("Error uploading files to AWS:", error);
    } finally {
      setUploading(videoFiles.map(() => false));
      setProgress(videoFiles.map(() => 0));
    }
  };

  const sendToAWS = async (file, index) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload-to-aws",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress((prevProgress) => [
              ...prevProgress.slice(0, index),
              percentCompleted,
              ...prevProgress.slice(index + 1),
            ]);
          },
        }
      );
      console.log(`File ${index + 1} uploaded to AWS`, response.data);
    } catch (error) {
      console.error(`Error uploading file ${index + 1} to AWS:`, error);
      throw error;
    }
  };

  const handleSendToExodus = async () => {
    setUploading(videoFiles.map(() => true));

    try {
      await Promise.all(
        videoFiles.map((file, index) => sendToExodus(file, index))
      );
      console.log("All files sent to Exodus successfully");
    } catch (error) {
      console.error("Error sending files to Exodus:", error);
    } finally {
      setUploading(videoFiles.map(() => false));
      setProgress(videoFiles.map(() => 0));
    }
  };

  const sendToExodus = async (file, index) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload-to-exodus",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress((prevProgress) => [
              ...prevProgress.slice(0, index),
              percentCompleted,
              ...prevProgress.slice(index + 1),
            ]);
          },
        }
      );
      console.log(`File ${index + 1} sent to Exodus`, response.data);
    } catch (error) {
      console.error(`Error sending file ${index + 1} to Exodus:`, error);
      throw error;
    }
  };

  const handleIndividualSendToAWS = (file, index) => {
    setUploading((prevUploading) => [
      ...prevUploading.slice(0, index),
      true,
      ...prevUploading.slice(index + 1),
    ]);
    sendToAWS(file, index).finally(() => {
      setUploading((prevUploading) => [
        ...prevUploading.slice(0, index),
        false,
        ...prevUploading.slice(index + 1),
      ]);
      setProgress((prevProgress) => [
        ...prevProgress.slice(0, index),
        0,
        ...prevProgress.slice(index + 1),
      ]);
    });
  };

  const handleIndividualSendToExodus = (file, index) => {
    setUploading((prevUploading) => [
      ...prevUploading.slice(0, index),
      true,
      ...prevUploading.slice(index + 1),
    ]);
    sendToExodus(file, index).finally(() => {
      setUploading((prevUploading) => [
        ...prevUploading.slice(0, index),
        false,
        ...prevUploading.slice(index + 1),
      ]);
      setProgress((prevProgress) => [
        ...prevProgress.slice(0, index),
        0,
        ...prevProgress.slice(index + 1),
      ]);
    });
  };

  return (
    <Container maxWidth="md">
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          marginBottom: 4,
          background: "-webkit-linear-gradient(315deg, #00bcd4 25%, #6e56cf)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
        }}
      >
        EXODUS Video Pipeline Processing
      </Typography>
      <UploadBox onFilesChange={handleFilesChange} />

      {videoFiles.length > 0 && (
        <Box sx={{ mt: 4 }}>
          {videoFiles.map((file, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <VideoDetails
                videoFile={file}
                thumbnailUrl={thumbnailUrls[index]}
                uploading={uploading[index]}
                onSendToAWS={() => handleIndividualSendToAWS(file, index)}
                onSendToExodus={() => handleIndividualSendToExodus(file, index)}
              />
              {uploading[index] && <ProgressBar progress={progress[index]} />}
            </Box>
          ))}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
              mb: 5,
              gap: "30px",
              maxWidth: "80%",
              mx: "auto",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ width: "100%" }}
              onClick={handleSendToAWS}
              disabled={uploading.some((status) => status)}
            >
              Send All to AWS
            </Button>
            <Button
              variant="contained"
              color="warning"
              sx={{ width: "100%" }}
              onClick={handleSendToExodus}
              disabled={uploading.some((status) => status)}
            >
              Send All to Exodus
            </Button>
          </Box>
        </Box>
      )}
      <Fab
        variant="extended"
        color="primary"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={navigateToExodus}
      >
        <LandscapeIcon sx={{ mr: 1 }} />
        Promised Land
      </Fab>
    </Container>
  );
};

export default LandingPage;
