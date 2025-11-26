import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#3D5A6B", // Lighter shade of Charcoal Blue
      main: "#233D4D", // Charcoal Blue - Deep navy with smoky steely hues
      dark: "#1A2E3A", // Darker shade of Charcoal Blue
      contrastText: "#fff",
    },
    secondary: {
      light: "#FCCA46", // Golden Pollen - Radiant sunflower brilliance
      main: "#ED873A", // Pumpkin Spice - Bold and spicy autumnal vibes
      dark: "#D96A1F", // Darker shade of Pumpkin Spice
      contrastText: "#fff",
    },
    background: {
      default: "#FAF9F6", // Warm off-white background
      paper: "#ffffff", // Clean white for cards
    },
    text: {
      primary: "#233D4D", // Charcoal Blue - Deep navy with smoky steely hues
      secondary: "#619B8A", // Seagrass for secondary text
    },
    error: {
      main: "#d32f2f", // Traditional red for errors
    },
    warning: {
      main: "#FE7F2D", // Pumpkin Spice for warnings
    },
    info: {
      main: "#619B8A", // Seagrass for information
    },
    success: {
      main: "#A1C181", // Muted Olive for success
    },
  },
  typography: {
    fontFamily: '"Open Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: "none", // Avoid uppercase in buttons
    },
  },
  shape: {
    borderRadius: 8, // Slightly rounded borders
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

export default theme;
