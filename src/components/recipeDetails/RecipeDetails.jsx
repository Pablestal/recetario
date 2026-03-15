import "./RecipeDetails.scss";
import { useEffect, useState, useRef } from "react";
import Loading from "../common/Loading";
import { useRecipeStore } from "../../stores/useRecipeStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useParams, useNavigate } from "react-router-dom";
import LocalDiningIcon from "@mui/icons-material/LocalDiningOutlined";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useTranslation } from "react-i18next";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

function RecipeDetails() {
  const { t } = useTranslation("recipeDetails");
  const { id } = useParams();
  const navigate = useNavigate();

  const getRecipeById = useRecipeStore((state) => state.getRecipeById);
  const recipe = useRecipeStore((state) => state.currentRecipe);
  const loading = useRecipeStore((state) => state.loading);
  const error = useRecipeStore((state) => state.error);
  const deleteRecipe = useRecipeStore((state) => state.deleteRecipe);
  const user = useAuthStore((state) => state.user);

  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isDeletingRef = useRef(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  useEffect(() => {
    if (id) {
      getRecipeById(id);
    }
  }, [getRecipeById, id]);

  const renderDifficultyIcons = (difficulty) => {
    return Array.from({ length: difficulty }, (_, index) => (
      <LocalDiningIcon key={index} sx={{ fontSize: 18, color: "#d32f2f" }} />
    ));
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleConfirmDelete = async () => {
    isDeletingRef.current = true;
    setIsDeleting(true);
    setOpenDialog(false);

    try {
      await deleteRecipe(id);
      navigate("/recipes");
    } catch (error) {
      console.error("Error al eliminar la receta:", error);
      isDeletingRef.current = false;
      setIsDeleting(false);
    }
  };

  const handleEditRecipe = () => {
    navigate(`/recipe-creation/${id}`);
  };

  const handleMenuOpen = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleMenuEdit = () => {
    handleMenuClose();
    handleEditRecipe();
  };

  const handleMenuDelete = () => {
    handleMenuClose();
    handleOpenDialog();
  };

  if (isDeletingRef.current || isDeleting) return <Loading />;
  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  if (!recipe) return <div>Receta no encontrada</div>;

  const isOwner = user?.id === recipe.user_id;

  return (
    <section className="recipe-details-page">
      <div className="recipe-details__title-container">
        <div className="recipe-details__title-text">
          <h2>{recipe.name}</h2>
          {recipe.description && (
            <p className="recipe-details__subtitle">{recipe.description}</p>
          )}
        </div>
        {isOwner && (
          <>
            <IconButton aria-label="more options" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleMenuEdit}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t("edit")}</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleMenuDelete}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText sx={{ color: "error.main" }}>
                  {t("delete")}
                </ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}
      </div>

      <DeleteConfirmationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        recipeName={recipe.name}
      />

      <div className="recipe-details__body">
        <div className="recipe-details__sidebar">
          <div className="recipe-details__summary-card">
            <div className="recipe-details__summary-items">
              <div className="recipe-details__summary-item">
                <AccessTimeOutlinedIcon className="recipe-details__summary-icon" />
                <div className="recipe-details__summary-text">
                  <span className="recipe-details__summary-label">
                    {t("time").toUpperCase()}
                  </span>
                  <strong className="recipe-details__summary-value">
                    {recipe.prep_time ? recipe.prep_time : "??"}
                    {t("minutes")}
                  </strong>
                </div>
              </div>
              <div className="recipe-details__summary-item">
                <PeopleAltOutlinedIcon className="recipe-details__summary-icon" />
                <div className="recipe-details__summary-text">
                  <span className="recipe-details__summary-label">
                    {t("servings").toUpperCase()}
                  </span>
                  <strong className="recipe-details__summary-value">
                    {recipe.servings ? recipe.servings : "??"}
                  </strong>
                </div>
              </div>
              <div className="recipe-details__summary-item">
                <SignalCellularAltIcon className="recipe-details__summary-icon" />
                <div className="recipe-details__summary-text">
                  <span className="recipe-details__summary-label">
                    {t("difficulty").toUpperCase()}
                  </span>
                  <div className="recipe-details__summary-value">
                    {renderDifficultyIcons(recipe.difficulty)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="recipe-details__ingredients-card">
            <div className="recipe-details__ingredients-header">
              <strong>{t("ingredients")}</strong>
            </div>
            <ul className="recipe-details__ingredients-list">
              {recipe.ingredients
                .sort((a, b) => a.id - b.id)
                .map((ingredient, index) => (
                  <li key={index} className="recipe-details__ingredient-item">
                    <span className="recipe-details__ingredient-name">
                      {ingredient.name}{" "}
                      {ingredient.optional && (
                        <span className="recipe-details__ingredient-optional">
                          ({t("optional")})
                        </span>
                      )}
                    </span>
                    {ingredient.quantity && (
                      <span className="recipe-details__ingredient-quantity">
                        {ingredient.quantity}
                      </span>
                    )}
                    <Tooltip title={t("addToShoppingList")} placement="top">
                      <span>
                        <IconButton
                          size="small"
                          className="recipe-details__ingredient-cart-btn"
                          aria-label={t("addToShoppingList")}
                          disabled
                        >
                          <ShoppingCartIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="recipe-details__main-column">
          {recipe.main_image_url && (
            <div className="recipe-details__main-image-container">
              <img
                src={recipe.main_image_url}
                alt="recipe_image"
                className="recipe-details__main-image"
              />
            </div>
          )}

          <div className="recipe-details__steps-section">
            <h3 className="recipe-details__steps-title">
              {t("preparationSteps")}
            </h3>
            <ol className="recipe-details__steps-list">
              {recipe.steps.map((step, index) => (
                <li key={index} className="recipe-details__step-item">
                  <div className="recipe-details__step-circle">
                    {step.step_number}
                  </div>
                  <div className="recipe-details__step-content">
                    <p className="recipe-details__step-description">
                      {step.description}
                    </p>
                    {step.tip && (
                      <div className="recipe-details__step-tip">
                        <LightbulbIcon className="recipe-details__tip-icon" />
                        <p className="recipe-details__tip-text">
                          <strong>Tip:</strong> {step.tip}
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RecipeDetails;
