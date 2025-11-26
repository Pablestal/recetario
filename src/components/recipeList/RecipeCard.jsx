import "./RecipeCard.scss";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import imageFallback from "../../assets/recipe-card-img-fallback.png";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalDiningIcon from "@mui/icons-material/LocalDiningOutlined";
import { useTranslation } from "react-i18next";

const RecipeCard = (props) => {
  const { i18n } = useTranslation();
  const date = new Date(props.recipe.created_at);
  const formattedDate = date.toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const { t } = useTranslation("recipeList");

  const renderDifficultyIcons = (difficulty) => {
    return Array.from({ length: difficulty - 1 }, (_, index) => (
      <LocalDiningIcon key={index} sx={{ fontSize: 18, color: "#d32f2f" }} />
    ));
  };

  const hasDescription =
    props.recipe.description && props.recipe.description.trim() !== "";
  const imageHeight = hasDescription ? 140 : 200;

  return (
    <section>
      <div className="recipe-card">
        <Card sx={{ maxWidth: 345 }} variant="outlined">
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "primary" }} aria-label="recipe">
                R
              </Avatar>
            }
            title={props.recipe.name}
            subheader={formattedDate}
          />
          <CardMedia
            sx={{ height: imageHeight }}
            image={props.recipe.main_image_url || imageFallback}
            title={props.recipe.name}
          />
          <CardContent>
            {hasDescription && (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                className="recipe-card__description"
              >
                {props.recipe.description}
              </Typography>
            )}
            <div className="recipe-card__icons">
              <div className="recipe-card__icon-item">
                <AccessTimeIcon />
                <Typography
                  variant="body2"
                  sx={{ fontSize: 18, color: "text.secondary" }}
                >
                  {props.recipe.prep_time ? props.recipe.prep_time : "??"}
                  {t("recipeCard.minutes")}
                </Typography>
              </div>
              <div className="recipe-card__icon-item">
                <RestaurantIcon />
                <Typography
                  variant="body2"
                  sx={{ fontSize: 20, color: "text.secondary" }}
                >
                  {props.recipe.servings ? props.recipe.servings : "??"}
                </Typography>
              </div>
              <div className="recipe-card__icon-item recipe-card__icon-item__difficulty">
                <Typography
                  variant="body2"
                  sx={{ fontSize: 16, color: "text.secondary", marginRight: 1 }}
                >
                  {t("recipeCard.difficulty")}:
                </Typography>
                {renderDifficultyIcons(props.recipe.difficulty)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RecipeCard;
