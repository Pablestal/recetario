import "./RecipeList.scss";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecipeStore } from "../../stores/useRecipeStore";
import { useAuthStore } from "../../stores/useAuthStore";
import RecipeCard from "./RecipeCard";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import Loading from "../common/Loading";
import { useSmartNavigate } from "../../hooks/useSmartNavigate";

const RecipeList = () => {
  const { t } = useTranslation("recipeList");
  const recipes = useRecipeStore((state) => state.recipes);
  const loading = useRecipeStore((state) => state.loading);
  const getRecipes = useRecipeStore((state) => state.getRecipes);
  const userId = useAuthStore((state) => state.user?.id);
  const navigate = useSmartNavigate();

  useEffect(() => {
    getRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleCreateRecipe = () => {
    navigate("/recipe-creation");
  };

  if (loading) return <Loading />;

  return (
    <>
      <section>
        <h2>{t("recipeListTitle")}</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateRecipe}
          startIcon={<AddIcon />}
        >
          {t("newRecipeButton")}
        </Button>
        <ul className="recipe-list">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipe-details/${recipe.id}`}
              className="no-link-style"
            >
              <RecipeCard key={recipe.id} recipe={recipe} component={Link} />
            </Link>
          ))}
        </ul>
      </section>
    </>
  );
};

export default RecipeList;
