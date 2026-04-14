import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Typography } from "@mui/material";
import RecipeCard from "../recipeList/RecipeCard";
import { routes } from "../../routes";

const ProfileRecipesTab = ({ recipes, onViewAll }) => {
  const { t } = useTranslation("userProfile");

  if (recipes.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 6, textAlign: "center" }}>
        {t("noRecipes")}
      </Typography>
    );
  }

  return (
    <>
      <div className="user-profile__recipe-grid">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            to={routes.recipeDetails(recipe.id)}
            className="no-link-style"
          >
            <RecipeCard recipe={recipe} />
          </Link>
        ))}
      </div>
      <div className="user-profile__view-all">
        <Button variant="outlined" color="secondary" onClick={onViewAll}>
          {t("viewAll")}
        </Button>
      </div>
    </>
  );
};

ProfileRecipesTab.propTypes = {
  recipes: PropTypes.array.isRequired,
  onViewAll: PropTypes.func.isRequired,
};

export default ProfileRecipesTab;
