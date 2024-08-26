import React from "react";
import { Link } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import "./SongsByGenre.css";
import genreData from "../../utils/songGenreData";

const SongsByGenre = () => {
  return (
    <Box sx={{ p: 4, backgroundColor: "#000" }}>
      <Typography variant="h5" color="white" sx={{ mb: 4 }}>
        Browse all
      </Typography>
      <Grid container spacing={2}>
        {genreData.map((item) => (
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
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SongsByGenre;
