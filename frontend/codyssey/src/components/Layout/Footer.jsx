import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} Codyssey3. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;