import { Route, Routes } from "react-router-dom";
import "./App.scss";
import TopMenu from "./components/common/TopMenu";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";
import RecipeListPage from "./pages/RecipeListPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import WeeklyMenuPage from "./pages/WeeklyMenuPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./MuiTheme";
import RecipeCreationPage from "./pages/RecipeCreationPage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import Loading from "./components/common/Loading";
import ProtectedRoute from "./components/common/ProtectedRoute";

const App = () => {
  const { initialize, loading, cleanup } = useAuthStore();

  useEffect(() => {
    initialize();
    // Cleanup listener on unmount
    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="app-container">
          <TopMenu></TopMenu>
          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes" element={<RecipeListPage />} />
              <Route
                path="/recipe-creation"
                element={
                  <ProtectedRoute>
                    <RecipeCreationPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/shopping-list" element={<ShoppingListPage />} />
              <Route path="/weeekly-menu" element={<WeeklyMenuPage />} />
              <Route
                path="/recipe-details/:id"
                element={<RecipeDetailsPage />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;
