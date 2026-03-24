import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
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
import UserProfilePage from "./pages/UserProfilePage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import Loading from "./components/common/Loading";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AppBreadcrumbs from "./components/common/AppBreadcrumbs";

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

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="app-container">
          <TopMenu></TopMenu>
          {loading && <Loading />}
          {!loading && (
            <>
              <div className="content">
                <AppBreadcrumbs />
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to={routes.recipes} replace />}
                  />
                  <Route
                    path={routes.profile}
                    element={
                      <ProtectedRoute>
                        <UserProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path={routes.recipes} element={<RecipeListPage />} />
                  <Route
                    path={routes.recipeCreation}
                    element={
                      <ProtectedRoute>
                        <RecipeCreationPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={routes.recipeEdit(":id")}
                    element={
                      <ProtectedRoute>
                        <RecipeCreationPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path={routes.shoppingList} element={<ShoppingListPage />} />
                  <Route path={routes.weeklyMenu} element={<WeeklyMenuPage />} />
                  <Route
                    path={routes.recipeDetails(":id")}
                    element={<RecipeDetailsPage />}
                  />
                </Routes>
              </div>
              <Footer />
            </>
          )}
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;
