import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2d8cff",
    },
    secondary: {
      main: "#ffb300",
    },
    background: {
      default: "#f5f7fa",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h5: {
      fontWeight: 700,
    },
  },
});

export default theme;