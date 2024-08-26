import React from "react";
import { Link } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import "./SongsByGenre.css";

const items = [
  {
    name: "Pop",
    color: "#FF007D",
    img: "path-to-music-image",
    type: "genre",
  },
  {
    name: "Rock",
    color: "#2B6550",
    img: "path-to-podcasts-image",
    type: "genre",
  },
  {
    name: "Hip-Hop",
    color: "#A347E0",
    img: "path-to-live-events-image",
    type: "genre",
  },
  {
    name: "Bollywood",
    color: "#5400F7",
    img: "path-to-made-for-you-image",
    type: "genre",
  },
  {
    name: "Classical",
    color: "#52B145",
    img: "path-to-new-releases-image",
    type: "genre",
  },
  {
    name: "Hindi",
    color: "#FF007D",
    img: "path-to-hindi-image",
    type: "language",
  },
  {
    name: "Punjabi",
    color: "#1DB954",
    img: "path-to-punjabi-image",
    type: "language",
  },
  {
    name: "English",
    color: "#BA5D0D",
    img: "path-to-english-image",
    type: "language",
  } ,
  {
    name:"Spanish",
    color:"#E24B17" ,
    img:"",
    type:"language"
  }
];

const SongsByGenre = () => {
  return (
    <Box sx={{ p: 4, backgroundColor: "#000" }}>
      <Typography variant="h5" color="white" sx={{ mb: 4 }}>
        Browse all
      </Typography>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.name}>
            <Link to={`/${item.type}/${item.name}`} className="item-link">
              <Box
                sx={{
                  backgroundColor: item.color,
                  height: 150,
                  borderRadius: 2,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ p: 2, color: "#fff", fontWeight: "bold" }}
                >
                  {item.name}
                </Typography>
                {/* <Box
                  component="img"
                  src={item.img}
                  alt={item.name}
                  className="item-image"
                /> */}
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SongsByGenre;
