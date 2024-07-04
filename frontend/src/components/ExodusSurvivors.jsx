import React from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import PropertyCard from "../components/PropertyCard";

const ExodusSurvivors = () => {
  const properties = [
    {
      imageSrc:
        "https://www.esportmaniacos.com/wp-content/uploads/2022/02/Riven_201-780x470.jpg",
      Name: "123 Main St, Phoenix",
      Pipeline: "Exodus",
      Type: "Audio",
      tags: "#lol #dota #free #gg #ff #mfr #g2",
      Time: 1234.1234,
    },
    {
      imageSrc:
        "https://www.esportmaniacos.com/wp-content/uploads/2022/02/Riven_201-780x470.jpg",
      Name: "123 Main St, Phoenix",
      Pipeline: "AWS",
      Type: "Audio",
      Time: 1234.1234,
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
              name={property.Name}
              pipeline={property.Pipeline}
              type={property.Type}
              time={property.Time}
              tags={property.tags}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ExodusSurvivors;
