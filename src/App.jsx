import { Route, Routes } from "react-router-dom";
import "./App.scss";
import TopMenu from "./components/common/TopMenu";
import HomePage from "./pages/HomePage";
import RecipeListPage from "./pages/RecipeListPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import WeeklyMenuPage from "./pages/WeeklyMenuPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./MuiTheme";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";

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
            <Route path="/shopping-list" element={<ShoppingListPage />} />
            <Route path="/weeekly-menu" element={<WeeklyMenuPage />} />
            <Route path="/recipe-details/:id" element={<RecipeDetailsPage />} />
          </Routes>
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;
