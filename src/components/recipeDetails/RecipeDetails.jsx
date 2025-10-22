import "./RecipeDetails.scss";
import { useEffect, useState } from "react";
import Loading from "../common/Loading";
import { useRecipeStore } from "../../stores/useRecipeStore";
import { useParams, useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Typography from "@mui/material/Typography";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalDiningIcon from "@mui/icons-material/LocalDiningOutlined";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import fallbackImage from "../../assets/image-fallback.jpg";

function RecipeDetails() {
  const { t } = useTranslation("recipeDetails");
  const { id } = useParams();
  const navigate = useNavigate();
  const getRecipe = useRecipeStore((state) => state.getRecipeById);
  const recipe = useRecipeStore((state) => state.currentRecipe);
  const loading = useRecipeStore((state) => state.loading);
  const error = useRecipeStore((state) => state.error);
  const deleteRecipe = useRecipeStore((state) => state.deleteRecipe);

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (id) {
      getRecipe(id);
    }
  }, [getRecipe, id]);

  const renderDifficultyIcons = (difficulty) => {
    return Array.from({ length: difficulty - 1 }, (_, index) => (
      <LocalDiningIcon key={index} sx={{ fontSize: 18, color: "#d32f2f" }} />
    ));
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteRecipe(id);
      setOpenDialog(false);
      navigate("/recipes");
    } catch (error) {
      console.error("Error al eliminar la receta:", error);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  if (!recipe) return <div>Receta no encontrada</div>;

  return (
    <section>
      <div className="recipe-details__title-container">
        <h2>{recipe.name}</h2>
        <IconButton
          aria-label="delete"
          color="error"
          size="large"
          onClick={handleOpenDialog}
          className="recipe-details__delete-button"
        >
          <DeleteIcon />
        </IconButton>
      </div>

      <DeleteConfirmationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        recipeName={recipe.name}
      />

      <div className="recipe-details">
        <div className="recipe-details__header">
          <p>{recipe.description}</p>
          <div className="recipe-details__information">
            <div className="recipe-card__author"></div>
            <div className="recipe-details__information-items">
              <div className="recipe-card__icon-item">
                <AccessTimeIcon />
                <Typography
                  variant="body2"
                  sx={{ fontSize: 18, color: "text.secondary" }}
                >
                  {recipe.prep_time ? recipe.prep_time : "??"}
                  {t("minutes")}
                </Typography>
              </div>
              <div className="recipe-card__icon-item">
                <RestaurantIcon />
                <Typography
                  variant="body2"
                  sx={{ fontSize: 20, color: "text.secondary" }}
                >
                  {recipe.servings ? recipe.servings : "??"}
                </Typography>
              </div>
              <div className="recipe-card__icon-item recipe-card__icon-item__difficulty">
                <Typography
                  variant="body2"
                  sx={{ fontSize: 16, color: "text.secondary", marginRight: 1 }}
                >
                  {t("difficulty")}:
                </Typography>
                {renderDifficultyIcons(recipe.difficulty)}
              </div>
            </div>
          </div>
          <div className="recipe-details__ingredients">
            <ul className="recipe-details__ingredients-list">
              {recipe.ingredients
                .sort((a, b) => a.id - b.id)
                .map((ingredient, index) => (
                  <li key={index}>
                    - {ingredient.quantity} {ingredient.name}{" "}
                    {ingredient.optional && (
                      <span className="recipe-details__ingredient-optional">
                        ({t("optional")})
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="recipe-details__steps">
          <div className="recipe-details__image-container">
            <img
              src={recipe.images[0]?.url || fallbackImage}
              alt="recipe_image"
              className="recipe-details__image"
            />
          </div>
          <ol className="recipe-details__steps-list">
            {recipe.steps.map((step, index) => (
              <li key={index} className="recipe-details__steps-item">
                <span className="recipe-details__step-number">
                  {t("step")} {step.step_number}
                </span>
                <div className="recipe-details__step-content">
                  <p className="recipe-details__step-description">
                    {step.description}
                  </p>
                  {step.tip && (
                    <div className="recipe-details__step-tip">
                      <div className="recipe-details__tip-header">
                        <LightbulbIcon className="recipe-details__tip-icon" />
                      </div>
                      <p className="recipe-details__tip-text">{step.tip}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default RecipeDetails;
