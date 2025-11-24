import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#81c784", // Light green, similar to tender leaves
      main: "#43a047", // Medium green, fresh and natural
      dark: "#2e7d32", // Dark green, represents intense herbs
      contrastText: "#fff",
    },
    secondary: {
      light: "#a5d6a7", // Very light green, like young sprouts
      main: "#66bb6a", // Slightly lighter green than primary
      dark: "#388e3c", // Dark green, like cilantro or basil leaves
      contrastText: "#fff",
    },
    background: {
      default: "#f5f5f5", // Soft background like flour
      paper: "#ffffff", // Clean white for cards
    },
    text: {
      primary: "#263238", // Very dark gray almost black, for good readability
      secondary: "#546e7a", // Medium bluish gray for secondary texts
    },
    error: {
      main: "#d32f2f", // Traditional red for errors
    },
    warning: {
      main: "#fb8c00", // Orange for warnings
    },
    info: {
      main: "#0288d1", // Blue for information
    },
    success: {
      main: "#388e3c", // Green for success
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
