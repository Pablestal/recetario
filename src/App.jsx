import { Route, Routes } from "react-router-dom";
import "./App.scss";
import TopMenu from "./components/common/TopMenu";
import HomePage from "./pages/HomePage";
import RecipeListPage from "./pages/RecipeListPage";
import ShoppingList from "./pages/ShoppingList";
import WeeklyMenu from "./pages/WeeklyMenu";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./MuiTheme";
import CreateRecipe from "./pages/CreateRecipe";

const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <TopMenu></TopMenu>
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipeListPage />} />
            <Route path="/recipe-creation" element={<CreateRecipe />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="/weeekly-menu" element={<WeeklyMenu />} />
          </Routes>
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;
