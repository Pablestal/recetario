import "./RecipeFilters.scss";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { RECIPE_VIEWS } from "./recipeList.constants";
import { useTranslation } from "react-i18next";
import { useTagStore } from "../../stores/useTagStore";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import LocalDiningIcon from "@mui/icons-material/LocalDiningOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useAuthStore } from "../../stores/useAuthStore";
import { useCollectionStore } from "../../stores/useCollectionStore";

const MAX_VISIBLE_TAGS = 6;

const RecipeFilters = ({ filters, onChange, onClear, hasActiveFilters, maxTime, maxCalories, availableTags, className }) => {
  const { t, i18n } = useTranslation("recipeList");
  const storeTags = useTagStore((state) => state.tags);
  const getTagsByLanguage = useTagStore((state) => state.getTagsByLanguage);
  const user = useAuthStore((state) => state.user);
  const collections = useCollectionStore((state) => state.collections);
  const fetchCollections = useCollectionStore((state) => state.fetchCollections);

  useEffect(() => {
    if (user?.id) fetchCollections(user.id);
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getTagsByLanguage(i18n.language);
  }, [i18n.language, getTagsByLanguage]);

  // Local string state for numeric inputs (avoids mid-typing clamping)
  const [timeStr, setTimeStr] = useState(String(filters.maxTime));
  const [calMinStr, setCalMinStr] = useState(String(filters.caloriesRange[0]));
  const [calMaxStr, setCalMaxStr] = useState(String(filters.caloriesRange[1]));

  // Sync inputs when slider moves
  useEffect(() => { setTimeStr(String(filters.maxTime)); }, [filters.maxTime]);
  useEffect(() => { setCalMinStr(String(filters.caloriesRange[0])); }, [filters.caloriesRange]);
  useEffect(() => { setCalMaxStr(String(filters.caloriesRange[1])); }, [filters.caloriesRange]);

  const handleViewChange = (_, newView) => {
    if (newView === null) return;
    if (newView === "collections") {
      const defaultCollection = collections.find((c) => c.is_default);
      onChange({ view: `collection_${(defaultCollection ?? collections[0]).id}` });
      return;
    }
    onChange({ view: newView });
  };

  const handleCollectionChipClick = (collectionId) => {
    onChange({ view: `collection_${collectionId}` });
  };

  const commitTime = () => {
    const val = Math.min(maxTime, Math.max(0, parseInt(timeStr, 10) || 0));
    setTimeStr(String(val));
    onChange({ maxTime: val });
  };

  const commitCalMin = () => {
    const max = filters.caloriesRange[1];
    const val = Math.min(max, Math.max(0, parseInt(calMinStr, 10) || 0));
    setCalMinStr(String(val));
    onChange({ caloriesRange: [val, max] });
  };

  const commitCalMax = () => {
    const min = filters.caloriesRange[0];
    const val = Math.min(maxCalories, Math.max(min, parseInt(calMaxStr, 10) || min));
    setCalMaxStr(String(val));
    onChange({ caloriesRange: [min, val] });
  };

  const handleDifficultyToggle = (level) => {
    const current = filters.difficulties;
    const updated = current.includes(level)
      ? current.filter((d) => d !== level)
      : [...current, level];
    onChange({ difficulties: updated });
  };

  const handleTagToggle = (tagId) => {
    const current = filters.selectedTags;
    const updated = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    onChange({ selectedTags: updated });
  };

  const availableTagIds = new Set((availableTags ?? []).map((t) => t.id));

  const visibleTags = storeTags
    .filter((tag) => availableTagIds.has(tag.id))
    .filter((tag) => tag.name.toLowerCase().includes(filters.tagSearch.toLowerCase()))
    .slice(0, MAX_VISIBLE_TAGS);

  const renderDifficultyRow = (level) => {
    const isSelected = filters.difficulties.includes(level);
    return (
      <label
        key={level}
        className="recipe-filters__difficulty-row"
      >
        <Checkbox
          checked={isSelected}
          size="small"
          color="secondary"
          onChange={() => handleDifficultyToggle(level)}
          disableRipple
        />
        <div className="recipe-filters__difficulty-icons">
          {Array.from({ length: level }, (_, i) => (
            <LocalDiningIcon key={i} sx={{ fontSize: 16, color: "#d32f2f" }} />
          ))}
        </div>
      </label>
    );
  };

  const asideClass = className ? `recipe-filters ${className}` : "recipe-filters";

  return (
    <aside className={asideClass}>
      {/* View selector */}
      <ToggleButtonGroup
        value={filters.view.startsWith("collection") ? "collections" : filters.view}
        exclusive
        onChange={handleViewChange}
        orientation="vertical"
        fullWidth
        className="recipe-filters__view-group"
      >
        <ToggleButton value={RECIPE_VIEWS.ALL} className="recipe-filters__view-btn">
          <FormatListBulletedIcon fontSize="small" sx={{ mr: 1 }} />
          {t("filters.allRecipes")}
        </ToggleButton>
        <ToggleButton value={RECIPE_VIEWS.MINE} className="recipe-filters__view-btn">
          <PersonOutlineIcon fontSize="small" sx={{ mr: 1 }} />
          {t("filters.myRecipes")}
        </ToggleButton>
        {user && collections.length > 0 && (
          <ToggleButton value="collections" className="recipe-filters__view-btn">
            <BookmarkIcon fontSize="small" sx={{ mr: 1 }} />
            {t("filters.collections")}
          </ToggleButton>
        )}
      </ToggleButtonGroup>

      {filters.view.startsWith("collection") && (
        <div className="recipe-filters__collection-chips">
          {[...collections]
            .sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))
            .map((c) => (
              <Chip
                key={c.id}
                label={c.is_default ? t("addToCollectionDialog.defaultCollectionName") : c.name}
                onClick={() => handleCollectionChipClick(c.id)}
                variant={filters.view === `collection_${c.id}` ? "filled" : "outlined"}
                color="secondary"
                size="small"
              />
            ))}
        </div>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Tags filter */}
      <div className="recipe-filters__section">
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          {t("filters.tags")}
        </Typography>
        <TextField
          size="small"
          fullWidth
          placeholder={t("filters.searchTags")}
          value={filters.tagSearch}
          onChange={(e) => onChange({ tagSearch: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <div className="recipe-filters__tags">
          {visibleTags.map((tag) => {
            const isSelected = filters.selectedTags.includes(tag.id);
            return (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                onClick={() => handleTagToggle(tag.id)}
                variant={isSelected ? "filled" : "outlined"}
                sx={{
                  backgroundColor: isSelected
                    ? tag.color || "#43a047"
                    : "transparent",
                  borderColor: tag.color || "#43a047",
                  color: isSelected ? "#fff" : tag.color || "#43a047",
                  fontWeight: isSelected ? 600 : 400,
                  cursor: "pointer",
                }}
              />
            );
          })}
        </div>
      </div>

      <Divider sx={{ my: 2 }} />

      {/* Time filter */}
      <div className="recipe-filters__section">
        <div className="recipe-filters__section-header">
          <Typography variant="subtitle2" fontWeight={600}>
            {t("filters.time")}
          </Typography>
          <TextField
            size="small"
            type="number"
            value={timeStr}
            onChange={(e) => setTimeStr(e.target.value)}
            onBlur={commitTime}
            onKeyDown={(e) => e.key === "Enter" && commitTime()}
            inputProps={{ min: 0, max: maxTime }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption">{t("filters.minutes")}</Typography>
                </InputAdornment>
              ),
            }}
            className="recipe-filters__number-input"
          />
        </div>
        <Slider
          value={filters.maxTime}
          min={0}
          max={maxTime}
          step={1}
          color="secondary"
          marks={[
            { value: 0, label: "0" },
            { value: maxTime, label: `${maxTime}` },
          ]}
          onChange={(_, val) => onChange({ maxTime: val })}
        />
      </div>

      <Divider sx={{ my: 2 }} />

      {/* Calories filter */}
      <div className="recipe-filters__section">
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          {t("filters.calories")}
        </Typography>
        <div className="recipe-filters__range-inputs">
          <TextField
            size="small"
            type="number"
            value={calMinStr}
            onChange={(e) => setCalMinStr(e.target.value)}
            onBlur={commitCalMin}
            onKeyDown={(e) => e.key === "Enter" && commitCalMin()}
            inputProps={{ min: 0, max: maxCalories }}
            className="recipe-filters__number-input"
          />
          <Typography variant="caption" color="text.secondary">–</Typography>
          <TextField
            size="small"
            type="number"
            value={calMaxStr}
            onChange={(e) => setCalMaxStr(e.target.value)}
            onBlur={commitCalMax}
            onKeyDown={(e) => e.key === "Enter" && commitCalMax()}
            inputProps={{ min: 0, max: maxCalories }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption">{t("filters.kcal")}</Typography>
                </InputAdornment>
            ),
            }}
            className="recipe-filters__number-input"
          />
        </div>
        <Slider
          value={filters.caloriesRange}
          min={0}
          max={maxCalories}
          step={1}
          color="secondary"
          disableSwap
          marks={[
            { value: 0, label: "0" },
            { value: maxCalories, label: `${maxCalories}` },
          ]}
          onChange={(_, val) => onChange({ caloriesRange: val })}
        />
      </div>

      <Divider sx={{ my: 2 }} />

      {/* Difficulty filter */}
      <div className="recipe-filters__section">
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          {t("filters.difficulty")}
        </Typography>
        {[1, 2, 3, 4, 5].map(renderDifficultyRow)}
      </div>

      {onClear && (
        <>
          <Divider sx={{ my: 2 }} />
          <Button
            variant="text"
            size="small"
            color="primary"
            onClick={onClear}
            disabled={!hasActiveFilters}
            fullWidth
          >
            {t("clearFilters")}
          </Button>
        </>
      )}
    </aside>
  );
};

RecipeFilters.propTypes = {
  filters: PropTypes.shape({
    view: PropTypes.string.isRequired,
    maxTime: PropTypes.number.isRequired,
    caloriesRange: PropTypes.arrayOf(PropTypes.number).isRequired,
    difficulties: PropTypes.arrayOf(PropTypes.number).isRequired,
    selectedTags: PropTypes.arrayOf(PropTypes.number).isRequired,
    tagSearch: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  hasActiveFilters: PropTypes.bool.isRequired,
  maxTime: PropTypes.number.isRequired,
  maxCalories: PropTypes.number.isRequired,
  availableTags: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired })),
  className: PropTypes.string,
};

export default RecipeFilters;
