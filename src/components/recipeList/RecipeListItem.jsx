import "./RecipeListItem.scss";
import { routes } from "../../routes";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import LocalDiningIcon from "@mui/icons-material/LocalDiningOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { useRecipeStore } from "../../stores/useRecipeStore";
import DeleteConfirmationDialog from "../recipeDetails/DeleteConfirmationDialog";

const RecipeListItem = ({ recipe }) => {
  const { t, i18n } = useTranslation("recipeList");
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const deleteRecipe = useRecipeStore((state) => state.deleteRecipe);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const formattedDate = new Date(recipe.created_at).toLocaleDateString(
    i18n.language,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  const isOwner = user?.id === recipe.user_id;

  const handleMenuOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    e?.stopPropagation();
    setMenuAnchor(null);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    handleMenuClose();
    navigate(routes.recipeEdit(recipe.id));
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleMenuClose();
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    setOpenDialog(false);
    await deleteRecipe(recipe.id);
  };

  return (
    <>
      <div className="recipe-list-item">
        <div className="recipe-list-item__content">
          <Typography variant="subtitle2" className="recipe-list-item__name">
            {recipe.name}
          </Typography>
          <div className="recipe-list-item__meta">
            <span className="recipe-list-item__stat">
              <AccessTimeIcon sx={{ fontSize: 18, color: "primary.main" }} />
              <Typography
                variant="caption"
                fontWeight={600}
                className="recipe-list-item__stat-text"
              >
                {recipe.prep_time ?? t("statFallback")}
                <span className="recipe-list-item__unit">
                  {" "}
                  {t("recipeCard.minutes")}
                </span>
              </Typography>
            </span>
            <span className="recipe-list-item__stat">
              <PeopleAltOutlinedIcon
                sx={{ fontSize: 18, color: "primary.main" }}
              />
              <Typography
                variant="caption"
                fontWeight={600}
                className="recipe-list-item__stat-text"
              >
                {recipe.servings ?? t("statFallback")}
              </Typography>
            </span>
            <span className="recipe-list-item__stat">
              <LocalFireDepartmentIcon
                sx={{ fontSize: 18, color: "primary.main" }}
              />
              <Typography
                variant="caption"
                fontWeight={600}
                className="recipe-list-item__stat-text"
              >
                {recipe.calories ?? t("statFallback")}
                {recipe.calories != null && (
                  <span className="recipe-list-item__unit">
                    {" "}
                    {t("recipeCard.kcal")}
                  </span>
                )}
              </Typography>
            </span>
            <span className="recipe-list-item__stat">
              <BoltIcon sx={{ fontSize: 18, color: "primary.main" }} />
              <div className="recipe-list-item__difficulty">
                {Array.from({ length: recipe.difficulty }, (_, i) => (
                  <LocalDiningIcon
                    key={i}
                    sx={{ fontSize: 13, color: "#d32f2f" }}
                  />
                ))}
              </div>
            </span>
            {recipe.description && (
              <span className="recipe-list-item__divider">|</span>
            )}
            <Typography
              variant="body2"
              className="recipe-list-item__description"
            >
              {recipe.description}
            </Typography>
          </div>
        </div>

        <div className="recipe-list-item__actions">
          <Typography variant="caption" className="recipe-list-item__byline">
            {recipe.user?.name ?? t("unknownAuthor")} · {formattedDate}
          </Typography>
          <div className="recipe-list-item__actions-icons">
            <FavoriteBorderIcon sx={{ fontSize: 18, color: "text.disabled" }} />
            {isOwner ? (
              <>
                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    {t("recipeCard.edit")}
                  </MenuItem>
                  <MenuItem
                    onClick={handleDeleteClick}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    {t("recipeCard.delete")}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <ChevronRightIcon sx={{ fontSize: 18, color: "text.disabled" }} />
            )}
          </div>
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <DeleteConfirmationDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleConfirmDelete}
          recipeName={recipe.name}
        />
      </div>
    </>
  );
};

export default RecipeListItem;
