import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#181F48", //Navy Blue
      second: "#002E5D",
      contrast: "#FFFFFF", // White
    },

    // Contrast / accent
    secondary: {
      main: "#FD8A2E", // Orange
      contrast: "#000000", // Black
    },

    // Extra semantic colors
    success: {
      main: "#07A850", // Green
      contrast: "#FFFFFF", // White
    },
  },
});

export default theme;
