import "./RecipeCard.scss";
import { routes } from "../../routes";
import { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import imageFallback from "../../assets/recipe-card-img-fallback.png";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalDiningIcon from "@mui/icons-material/LocalDiningOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { useRecipeStore } from "../../stores/useRecipeStore";
import DeleteConfirmationDialog from "../recipeDetails/DeleteConfirmationDialog";

const RecipeCard = (props) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation("recipeList");
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const deleteRecipe = useRecipeStore((state) => state.deleteRecipe);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const date = new Date(props.recipe.created_at);
  const formattedDate = date.toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isOwner = user?.id === props.recipe.user_id;

  const renderDifficultyIcons = (difficulty) => {
    return Array.from({ length: difficulty }, (_, index) => (
      <LocalDiningIcon key={index} sx={{ fontSize: 18, color: "#d32f2f" }} />
    ));
  };

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
    navigate(routes.recipeEdit(props.recipe.id));
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleMenuClose();
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    setOpenDialog(false);
    await deleteRecipe(props.recipe.id);
  };

  return (
    <section>
      <div className="recipe-card">
        <Card sx={{ width: "100%" }} variant="outlined">
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "primary" }} aria-label="recipe">
                R
              </Avatar>
            }
            title={props.recipe.name}
            titleTypographyProps={{ title: props.recipe.name }}
            subheader={formattedDate}
            action={
              isOwner && (
                <>
                  <IconButton
                    aria-label="more options"
                    onClick={handleMenuOpen}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={(e) => handleMenuClose(e)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem onClick={(e) => handleEdit(e)}>
                      <EditIcon fontSize="small" sx={{ mr: 1 }} />
                      {t("recipeCard.edit")}
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => handleDeleteClick(e)}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                      {t("recipeCard.delete")}
                    </MenuItem>
                  </Menu>
                </>
              )
            }
          />
          <CardMedia
            sx={{ height: 160 }}
            image={props.recipe.main_image_url || imageFallback}
            title={props.recipe.name}
          />
          <CardContent>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary" }}
              className="recipe-card__description"
            >
              {props.recipe.description}
            </Typography>
            <div className="recipe-card__icons">
              <div className="recipe-card__icon-item">
                <AccessTimeIcon
                  className="recipe-card__icon-item__icon"
                  color="primary"
                />
                <Typography
                  variant="caption"
                  className="recipe-card__icon-item__label"
                  sx={{ color: "primary.main" }}
                >
                  {props.recipe.prep_time ?? t("statFallback")}{" "}
                  {t("recipeCard.minutes")}
                </Typography>
              </div>
              <div className="recipe-card__icon-item">
                <PeopleAltOutlinedIcon
                  className="recipe-card__icon-item__icon"
                  color="primary"
                />
                <Typography
                  variant="caption"
                  className="recipe-card__icon-item__label"
                  sx={{ color: "primary.main" }}
                >
                  {props.recipe.servings ?? t("statFallback")}
                </Typography>
              </div>
              <div className="recipe-card__icon-item">
                <LocalFireDepartmentIcon
                  className="recipe-card__icon-item__icon"
                  color="primary"
                />
                <Typography
                  variant="caption"
                  className="recipe-card__icon-item__label"
                  sx={{ color: "primary.main" }}
                >
                  {props.recipe.calories ?? t("statFallback")}
                  {props.recipe.calories != null && ` ${t("recipeCard.kcal")}`}
                </Typography>
              </div>
              <div className="recipe-card__icon-item">
                <BoltIcon
                  className="recipe-card__icon-item__icon"
                  color="primary"
                />
                <div className="recipe-card__icon-item__difficulty">
                  {renderDifficultyIcons(props.recipe.difficulty)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <DeleteConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        recipeName={props.recipe.name}
        onClick={(e) => e.stopPropagation()}
      />
    </section>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user_id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    main_image_url: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    prep_time: PropTypes.number,
    servings: PropTypes.number,
    calories: PropTypes.number,
    difficulty: PropTypes.number,
  }).isRequired,
};

export default RecipeCard;
