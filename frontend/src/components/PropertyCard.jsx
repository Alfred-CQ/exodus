import React from "react";
import { Card, CardMedia, Box, Typography, Chip } from "@mui/material";
import InfoRounded from "@mui/icons-material/InfoRounded";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import LongMenu from "./LongMenu";

const PropertyCard = ({ imageSrc, main_title, sub_title, pipeline, tags }) => {
  const tagList = tags.split(" ");
  const displayedTags = tagList.slice(0, 5);
  const additionalTags = tagList.length > 5 ? tagList.slice(5) : [];

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        display: "flex",
        flexWrap: "wrap",
        zIndex: 1,
        transition: "all 0.3s ease",
        position: "relative",
        borderRadius: "9px",
        "&:hover": {
          borderColor: "hsla(210, 100%, 38%, 0.8)",
          backgroundColor: "hsla(210, 100%, 30%, 0.2)",
          boxShadow:
            "hsla(200, 10%, 4%, 0.2) 0 -3px 1px inset, hsl(210, 14%, 7%) 0 2px 3px 0",
        },
      }}
    >
      <CardMedia
        component="img"
        width="100"
        height="100"
        alt={"alt img"}
        src={imageSrc}
        sx={{
          borderRadius: "6px",
          width: { xs: "100%", sm: 100 },
        }}
      />
      <Box sx={{ alignSelf: "center", ml: 2 }}>
        <Typography variant="body2" color="text.secondary" fontWeight="regular">
          {main_title}
        </Typography>
        <Typography variant="h5" fontWeight="bold" noWrap gutterBottom>
          {sub_title}
        </Typography>
        <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>
          <Chip
            size="small"
            variant="outlined"
            icon={<InfoRounded />}
            label={pipeline}
            sx={{
              ".MuiChip-icon": {
                fontSize: 16,
                ml: "4px",
                color: pipeline === "AWS" ? "#ffff8d" : "#00e5ff",
              },
              borderColor: pipeline === "AWS" ? "#ffff00" : "#00e5ff",
              color: pipeline === "AWS" ? "#ffff8d" : "#00e5ff",
              mr: 1,
            }}
          />

          <Chip
            size="small"
            variant="outlined"
            icon={<AccessTimeFilledIcon />}
            label={"Time: "}
            sx={{
              ".MuiChip-icon": {
                fontSize: 16,
                ml: "4px",
                color: "#64ffda",
              },
              borderColor: "#64ffda",
              color: "#64ffda",
            }}
          />
        </Box>
        <Box
          sx={{
            mt: 1,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {displayedTags.map((tag, index) => (
            <a
              href={`#${tag.replace("#", "")}`}
              key={index}
              style={{
                marginRight: "5px",
                textDecoration: "none",
                color: "#007bff",
              }}
            >
              {tag}
            </a>
          ))}
          {additionalTags.length > 0 && (
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              {" "}
              <LongMenu tags={additionalTags} />
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default PropertyCard;
