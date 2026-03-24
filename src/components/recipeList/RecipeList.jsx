import "./RecipeList.scss";
import { routes } from "../../routes";
import { useEffect, useMemo, useState } from "react";
import { RECIPE_VIEWS } from "./recipeList.constants";
import { Link, useSearchParams } from "react-router-dom";
import { useRecipeStore } from "../../stores/useRecipeStore";
import { useAuthStore } from "../../stores/useAuthStore";
import RecipeCard from "./RecipeCard";
import RecipeListItem from "./RecipeListItem";
import RecipeFilters from "./RecipeFilters";
import {
  Badge,
  Button,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import Loading from "../common/Loading";
import { useSmartNavigate } from "../../hooks/useSmartNavigate";

const MAX_TIME = 120;
const MAX_CALORIES = 1500;

const initialFilters = {
  view: "all",
  maxTime: MAX_TIME,
  caloriesRange: [0, MAX_CALORIES],
  difficulties: [],
  selectedTags: [],
  tagSearch: "",
  nameSearch: "",
};

const RecipeList = () => {
  const { t } = useTranslation("recipeList");
  const recipes = useRecipeStore((state) => state.recipes);
  const loading = useRecipeStore((state) => state.loading);
  const getRecipes = useRecipeStore((state) => state.getRecipes);
  const userId = useAuthStore((state) => state.user?.id);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const navigate = useSmartNavigate();
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => ({
    ...initialFilters,
    view: searchParams.get("view") ?? initialFilters.view,
  }));
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("recipeViewMode") ?? "grid",
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:767px)");

  useEffect(() => {
    getRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const availableTags = useMemo(() => {
    const tagMap = new Map();
    recipes.forEach((recipe) => {
      recipe.recipe_tags?.forEach((rt) => {
        if (rt.tags?.id != null && rt.tags?.name)
          tagMap.set(rt.tags.id, rt.tags);
      });
    });
    return Array.from(tagMap.values());
  }, [recipes]);

  const dynamicMaxTime = useMemo(() => {
    const times = recipes.map((r) => r.prep_time).filter(Boolean);
    return times.length > 0 ? Math.max(...times) : MAX_TIME;
  }, [recipes]);

  const dynamicMaxCalories = useMemo(() => {
    const cals = recipes.map((r) => r.calories).filter(Boolean);
    return cals.length > 0 ? Math.max(...cals) : MAX_CALORIES;
  }, [recipes]);

  // Once recipes load, reset filter ceilings to the real maxes
  useEffect(() => {
    if (recipes.length === 0) return;
    setFilters((prev) => ({
      ...prev,
      maxTime: dynamicMaxTime,
      caloriesRange: [prev.caloriesRange[0], dynamicMaxCalories],
    }));
  }, [dynamicMaxTime, dynamicMaxCalories]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (partial) => {
    if (partial.view === RECIPE_VIEWS.MINE && !userId) {
      openLoginModal(() =>
        setFilters((prev) => ({ ...prev, view: RECIPE_VIEWS.MINE })),
      );
      return;
    }
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      if (
        filters.nameSearch &&
        !recipe.name.toLowerCase().includes(filters.nameSearch.toLowerCase())
      )
        return false;

      if (filters.view === RECIPE_VIEWS.MINE && recipe.user_id !== userId)
        return false;

      if (
        filters.maxTime < dynamicMaxTime &&
        recipe.prep_time != null &&
        recipe.prep_time > filters.maxTime
      )
        return false;

      if (recipe.calories != null) {
        if (
          recipe.calories < filters.caloriesRange[0] ||
          (filters.caloriesRange[1] < dynamicMaxCalories &&
            recipe.calories > filters.caloriesRange[1])
        )
          return false;
      }

      if (
        filters.difficulties.length > 0 &&
        !filters.difficulties.includes(recipe.difficulty)
      )
        return false;

      if (filters.selectedTags.length > 0) {
        const recipeTagIds =
          recipe.recipe_tags?.map((rt) => rt.tags?.id).filter(Boolean) ?? [];
        if (!filters.selectedTags.some((id) => recipeTagIds.includes(id)))
          return false;
      }

      return true;
    });
  }, [recipes, filters, userId, dynamicMaxCalories, dynamicMaxTime]);

  const handleCreateRecipe = () => {
    navigate(routes.recipeCreation);
  };

  const handleClearFilters = () => {
    setFilters((prev) => ({
      ...initialFilters,
      view: prev.view,
      maxTime: dynamicMaxTime,
      caloriesRange: [0, dynamicMaxCalories],
      nameSearch: prev.nameSearch,
    }));
  };

  const activeFiltersCount = [
    filters.maxTime < dynamicMaxTime,
    filters.caloriesRange[0] > 0 ||
      filters.caloriesRange[1] < dynamicMaxCalories,
    filters.difficulties.length > 0,
    filters.selectedTags.length > 0,
  ].filter(Boolean).length;

  const filtersProps = {
    filters,
    onChange: handleFilterChange,
    maxTime: dynamicMaxTime,
    maxCalories: dynamicMaxCalories,
    availableTags,
  };

  if (loading) return <Loading />;

  return (
    <div className="recipe-list-layout">
      <RecipeFilters
        {...filtersProps}
        onClear={handleClearFilters}
        hasActiveFilters={activeFiltersCount > 0}
        className="recipe-list-sidebar"
      />
      <section className="recipe-list-main">
        <div className="recipe-list-toolbar">
          {isMobile ? (
            <Tooltip title={t("newRecipeButton")}>
              <IconButton
                color="primary"
                onClick={handleCreateRecipe}
                sx={{ border: 1, borderColor: "primary.main", borderRadius: 1 }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateRecipe}
              startIcon={<AddIcon />}
            >
              {t("newRecipeButton")}
            </Button>
          )}
          {isMobile && (
            <Badge badgeContent={activeFiltersCount} color="secondary">
              <Tooltip title={t("filtersButton")}>
                <IconButton
                  color="primary"
                  onClick={() => setMobileFiltersOpen(true)}
                  sx={{
                    border: 1,
                    borderColor: "primary.main",
                    borderRadius: 1,
                  }}
                >
                  <TuneIcon />
                </IconButton>
              </Tooltip>
            </Badge>
          )}
          <TextField
            size="small"
            placeholder={t("searchPlaceholder")}
            value={filters.nameSearch}
            onChange={(e) => handleFilterChange({ nameSearch: e.target.value })}
            className="recipe-list-toolbar__search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, val) => {
              if (!val) return;
              setViewMode(val);
              localStorage.setItem("recipeViewMode", val);
            }}
            size="small"
          >
            <Tooltip title={t("viewGrid")}>
              <ToggleButton value="grid">
                <GridViewIcon fontSize="small" />
              </ToggleButton>
            </Tooltip>
            <Tooltip title={t("viewList")}>
              <ToggleButton value="list">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </div>
        {(() => {
          if (filteredRecipes.length === 0 && !loading) {
            return (
              <div className="recipe-list__empty">
                <Typography variant="h6" color="text.secondary">
                  {t("noResults.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("noResults.subtitle")}
                </Typography>
              </div>
            );
          }
          if (viewMode === "list") {
            return (
              <ul className="recipe-list recipe-list--list">
                {filteredRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    to={`/recipes/recipe-details/${recipe.id}`}
                    className="no-link-style"
                  >
                    <RecipeListItem recipe={recipe} />
                  </Link>
                ))}
              </ul>
            );
          }
          return (
            <ul className="recipe-list">
              {filteredRecipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  to={`/recipes/recipe-details/${recipe.id}`}
                  className="no-link-style"
                >
                  <RecipeCard recipe={recipe} component={Link} />
                </Link>
              ))}
            </ul>
          );
        })()}
      </section>

      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
      >
        <div className="recipe-list-drawer">
          <div className="recipe-list-drawer__header">
            <Typography variant="subtitle1" fontWeight={600}>
              {t("filtersButton")}
            </Typography>
            <IconButton
              onClick={() => setMobileFiltersOpen(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className="recipe-list-drawer__content">
            <RecipeFilters {...filtersProps} />
          </div>
          <div className="recipe-list-drawer__footer">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClearFilters}
              disabled={activeFiltersCount === 0}
              fullWidth
            >
              {t("clearFilters")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setMobileFiltersOpen(false)}
              fullWidth
              sx={{ px: 1 }}
            >
              {t("showResults", { count: filteredRecipes.length })}
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default RecipeList;
