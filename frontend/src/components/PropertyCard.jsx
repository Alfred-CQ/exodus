import React from "react";
import { Card, CardMedia, Box, Typography, Chip } from "@mui/material";
import InfoRounded from "@mui/icons-material/InfoRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import LongMenu from "./LongMenu";

const PropertyCard = ({
  imageSrc,
  name,
  pipeline,
  type,
  time,
  tags,
  weights,
}) => {
  const taggedWeights = tags.map((tag, index) => ({
    tag: `#${tag}`,
    weight: weights[index],
  }));
  const displayedTags = taggedWeights.slice(0, 5);
  const additionalTags = taggedWeights.length > 5 ? taggedWeights.slice(5) : [];

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
          {"Processed by Exodus"}
        </Typography>
        <Typography variant="h5" fontWeight="bold" noWrap gutterBottom>
          {name}
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
            label={`Time: ${time.toFixed(2)}`}
            sx={{
              ".MuiChip-icon": {
                fontSize: 16,
                ml: "4px",
                color: "#64ffda",
              },
              borderColor: "#64ffda",
              color: "#64ffda",
              mr: 1,
            }}
          />
          <Chip
            size="small"
            variant="outlined"
            icon={<AutoAwesomeIcon />}
            label={`Type: ${type}`}
            sx={{
              ".MuiChip-icon": {
                fontSize: 16,
                ml: "4px",
                color: "#d500f9",
              },
              borderColor: "#d500f9",
              color: "#ea80fc",
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
          {displayedTags.map(({ tag }, index) => (
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

          <Box sx={{ position: "absolute", top: 8, right: 8 }}>
            <LongMenu tags={taggedWeights} />
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default PropertyCard;
