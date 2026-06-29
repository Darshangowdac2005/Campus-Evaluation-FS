import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./index.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
  },
});

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
