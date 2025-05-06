import { Route, Routes } from "react-router-dom";
import "./App.css";
import TopMenu from "./components/TopMenu";
import HomePage from "./pages/HomePage";
import RecipeList from "./pages/RecipeList";
import ShoppingList from "./pages/ShoppingList";
import WeeklyMenu from "./pages/WeeklyMenu";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./MuiTheme";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <TopMenu></TopMenu>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/weeekly-menu" element={<WeeklyMenu />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
