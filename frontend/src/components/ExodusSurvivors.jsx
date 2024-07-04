import React from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import PropertyCard from "../components/PropertyCard";

const ExodusSurvivors = () => {
  const properties = [
    {
      imageSrc:
        "https://www.esportmaniacos.com/wp-content/uploads/2022/02/Riven_201-780x470.jpg",
      main_title: "$280k - $310k",
      sub_title: "123 Main St, Phoenix",
      pipeline: "Exodus",
      tags: "#lol #dota #free #gg #ff #mfr #g2",
    },
    {
      imageSrc:
        "https://www.esportmaniacos.com/wp-content/uploads/2022/02/Riven_201-780x470.jpg",
      main_title: "$280k - $310k",
      sub_title: "123 Main St, Phoenix",
      pipeline: "AWS",
      tags: "#class #ihc",
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            background: "-webkit-linear-gradient(315deg, #00bcd4 25%, #6e56cf)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          Exodus Survivors
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {properties.map((property, index) => (
          <Grid item xs={12} sm={6} md={5} key={index}>
            <PropertyCard
              imageSrc={property.imageSrc}
              main_title={property.main_title}
              sub_title={property.sub_title}
              pipeline={property.pipeline}
              tags={property.tags}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ExodusSurvivors;
