import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#81c784", // Verde claro, similar a hojas tiernas
      main: "#43a047", // Verde medio, fresco y natural
      dark: "#2e7d32", // Verde oscuro, representa hierbas intensas
      contrastText: "#fff",
    },
    secondary: {
      light: "#a5d6a7", // Verde muy claro, como brotes jóvenes
      main: "#66bb6a", // Verde ligeramente más claro que el primario
      dark: "#388e3c", // Verde oscuro, como hojas de cilantro o albahaca
      contrastText: "#fff",
    },
    background: {
      default: "#f5f5f5", // Fondo suave como harina
      paper: "#ffffff", // Blanco limpio para las tarjetas
    },
    text: {
      primary: "#263238", // Gris muy oscuro casi negro, para buena legibilidad
      secondary: "#546e7a", // Gris azulado medio para textos secundarios
    },
    error: {
      main: "#d32f2f", // Rojo tradicional para errores
    },
    warning: {
      main: "#fb8c00", // Naranja para advertencias
    },
    info: {
      main: "#0288d1", // Azul para información
    },
    success: {
      main: "#388e3c", // Verde para éxito
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
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
      textTransform: "none", // Evitar mayúsculas en botones
    },
  },
  shape: {
    borderRadius: 8, // Bordes ligeramente redondeados
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
