import "./RecipeList.scss";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecipeStore } from "../../stores/useRecipeStore";
import RecipeCard from "./RecipeCard";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";

const RecipeList = () => {
  const { t } = useTranslation("recipeList");
  const recipes = useRecipeStore((state) => state.recipes);
  const getRecipes = useRecipeStore((state) => state.getRecipes);

  useEffect(() => {
    getRecipes();
  }, [getRecipes]);

  return (
    <>
      <section>
        <h2>{t("recipeListTitle")}</h2>
        <Button
          variant="contained"
          color="primary"
          href="/recipe-creation"
          component={Link}
          to="/recipe-creation"
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
