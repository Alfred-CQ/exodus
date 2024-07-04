import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Grid, Typography, Box } from "@mui/material";
import PropertyCard from "../components/PropertyCard";
/*
const properties = [
    {
      imageSrc:
        "https://www.esportmaniacos.com/wp-content/uploads/2022/02/Riven_201-780x470.jpg",
      Name: "123 Main St, Phoenix",
      Pipeline: "Exodus",
      Type: "Audio",
      tags: ["lol", "dota", "free", "gg", "ff", "mfr", "g2"],
      weights: [12, 11, 10, 9, 8, 7, 1],
      Time: 1234.1234,
    },
    {
      imageSrc:
        "https://www.esportmaniacos.com/wp-content/uploads/2022/02/Riven_201-780x470.jpg",
      Name: "123 Main St, Phoenix",
      Pipeline: "AWS",
      Type: "Audio",
      Time: 1234.1234,
      tags: ["class", "ihc"],
      weights: [12, 11],
    },
  ];

  */

const ExodusSurvivors = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/files");
        const files = response.data;
        console.log(files.imgSrc);
        const propertyPromises = files.map(async (file) => {
          const fileResponse = await axios.get(file.file_name);
          const fileData = fileResponse.data;

          return {
            imageSrc: `http://localhost:5000/${file.imgSrc}`,
            Name: fileData.Name,
            Pipeline: fileData.Pipeline,
            Type: fileData.Type,
            tags: fileData.Labels.map((label) => label.Label),
            weights: fileData.Labels.map(
              (label) => label["Weighted Confidence"]
            ),
            Time: fileData.Time,
          };
        });

        const propertiesData = await Promise.all(propertyPromises);
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchData();
  }, []);

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
              weights={property.weights}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ExodusSurvivors;
