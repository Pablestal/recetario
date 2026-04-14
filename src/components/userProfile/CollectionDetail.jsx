import "./CollectionDetail.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import BoltIcon from "@mui/icons-material/Bolt";
import LocalDiningIcon from "@mui/icons-material/LocalDiningOutlined";
import imageFallback from "../../assets/recipe-card-img-fallback.png";
import Loading from "../common/Loading";
import { useCollectionStore } from "../../stores/useCollectionStore";
import { routes } from "../../routes";

const CollectionRecipeItem = ({ recipe, selected, onToggle, isOwner }) => {
  const { t } = useTranslation("recipeList");
  const navigate = useNavigate();

  return (
    <div
      className={`collection-recipe-item${selected ? " collection-recipe-item--selected" : ""}`}
      onClick={() => navigate(routes.recipeDetails(recipe.id))}
    >
      {isOwner && (
        <Checkbox
          checked={selected}
          color="secondary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(recipe.id);
          }}
          onChange={() => {}}
        />
      )}
      <img
        className="collection-recipe-item__thumbnail"
        src={recipe.main_image_url || imageFallback}
        alt={recipe.name}
      />
      <div className="collection-recipe-item__content">
        <Typography
          className="collection-recipe-item__name"
          variant="subtitle2"
        >
          {recipe.name}
        </Typography>
        <div className="collection-recipe-item__meta">
          <span className="collection-recipe-item__stat">
            <AccessTimeIcon sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography
              variant="caption"
              fontWeight={600}
              className="collection-recipe-item__stat-text"
            >
              {recipe.prep_time ?? t("statFallback")}
              <span className="collection-recipe-item__unit">
                {" "}
                {t("recipeCard.minutes")}
              </span>
            </Typography>
          </span>
          <span className="collection-recipe-item__stat">
            <PeopleAltOutlinedIcon
              sx={{ fontSize: 18, color: "primary.main" }}
            />
            <Typography
              variant="caption"
              fontWeight={600}
              className="collection-recipe-item__stat-text"
            >
              {recipe.servings ?? t("statFallback")}
            </Typography>
          </span>
          <span className="collection-recipe-item__stat">
            <LocalFireDepartmentIcon
              sx={{ fontSize: 18, color: "primary.main" }}
            />
            <Typography
              variant="caption"
              fontWeight={600}
              className="collection-recipe-item__stat-text"
            >
              {recipe.calories ?? t("statFallback")}
              {recipe.calories != null && (
                <span className="collection-recipe-item__unit">
                  {" "}
                  {t("recipeCard.kcal")}
                </span>
              )}
            </Typography>
          </span>
          <span className="collection-recipe-item__stat">
            <BoltIcon sx={{ fontSize: 18, color: "primary.main" }} />
            <span className="collection-recipe-item__difficulty">
              {Array.from({ length: recipe.difficulty ?? 0 }, (_, i) => (
                <LocalDiningIcon
                  key={i}
                  sx={{ fontSize: 13, color: "#d32f2f" }}
                />
              ))}
            </span>
          </span>
          {recipe.description && (
            <>
              <span className="collection-recipe-item__divider">|</span>
              <Typography
                variant="body2"
                className="collection-recipe-item__description"
              >
                {recipe.description}
              </Typography>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

CollectionRecipeItem.propTypes = {
  recipe: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  isOwner: PropTypes.bool,
};

const CollectionDetail = ({ collectionId, onBack, isOwner }) => {
  const { t } = useTranslation("userProfile");

  const collectionDetail = useCollectionStore(
    (state) => state.collectionDetail,
  );
  const collectionRecipes = useCollectionStore(
    (state) => state.collectionRecipes,
  );
  const loading = useCollectionStore((state) => state.loading);
  const error = useCollectionStore((state) => state.error);
  const fetchCollectionDetail = useCollectionStore(
    (state) => state.fetchCollectionDetail,
  );
  const clearCollectionDetail = useCollectionStore(
    (state) => state.clearCollectionDetail,
  );
  const updateCollection = useCollectionStore(
    (state) => state.updateCollection,
  );
  const deleteCollection = useCollectionStore(
    (state) => state.deleteCollection,
  );
  const removeRecipesFromCollection = useCollectionStore(
    (state) => state.removeRecipesFromCollection,
  );

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    clearCollectionDetail();
    fetchCollectionDetail(collectionId);
  }, [collectionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = (recipeId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(recipeId)) next.delete(recipeId);
      else next.add(recipeId);
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    await removeRecipesFromCollection(collectionId, [...selectedIds]);
    setSelectedIds(new Set());
  };

  const handleDeleteCollection = async () => {
    setDeleting(true);
    try {
      await deleteCollection(collectionId);
      onBack();
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleTogglePublic = async () => {
    await updateCollection(collectionId, {
      is_public: !collectionDetail.is_public,
    });
  };

  const collectionName = collectionDetail?.is_default
    ? t("addToCollectionDialog.defaultCollectionName", { ns: "recipeList" })
    : (collectionDetail?.name ?? "");

  const isPublic = collectionDetail?.is_public ?? false;

  if (loading) return <Loading />;

  if (error || !collectionDetail) {
    return (
      <div className="collection-detail">
        <button className="collection-detail__back" onClick={onBack}>
          <ArrowBackIcon fontSize="small" />
          {t("collectionDetail.backToCollections")}
        </button>
        <Typography color="text.secondary" sx={{ py: 6, textAlign: "center" }}>
          {t("collectionDetail.loadError")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="collection-detail">
      <button className="collection-detail__back" onClick={onBack}>
        <ArrowBackIcon fontSize="small" />
        {t("collectionDetail.backToCollections")}
      </button>

      <div className="collection-detail__title-row">
        <Typography
          className="collection-detail__title"
          variant="h4"
          fontWeight={700}
        >
          {collectionName}
        </Typography>

        {isOwner && !collectionDetail?.is_default && (
          <div className="collection-detail__actions">
            <Tooltip
              title={
                isPublic
                  ? t("collectionDetail.makePrivate")
                  : t("collectionDetail.makePublic")
              }
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={!isPublic}
                    onChange={handleTogglePublic}
                    color="secondary"
                  />
                }
                label={
                  isPublic ? (
                    <LockOpenIcon fontSize="small" sx={{ display: "block" }} />
                  ) : (
                    <LockIcon fontSize="small" sx={{ display: "block" }} />
                  )
                }
                labelPlacement="start"
                sx={{ ml: 0, mr: 0, gap: 0 }}
              />
            </Tooltip>

            <Button
              className="collection-detail__delete-btn"
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              <span className="collection-detail__delete-label">
                {t("collectionDetail.deleteCollection")}
              </span>
            </Button>
          </div>
        )}
      </div>

      {selectedIds.size > 0 && (
        <div className="collection-detail__selection-bar">
          <Typography variant="body2" fontWeight={600}>
            {t("collectionDetail.selectedCount", { count: selectedIds.size })}
          </Typography>
          <Button
            variant="contained"
            color="warning"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
          >
            {t("collectionDetail.deleteSelected", { count: selectedIds.size })}
          </Button>
        </div>
      )}

      {collectionRecipes.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 6, textAlign: "center" }}>
          {t("collectionDetail.noRecipes")}
        </Typography>
      ) : (
        <div className="collection-detail__list">
          {collectionRecipes.map((recipe) => (
            <CollectionRecipeItem
              key={recipe.id}
              recipe={recipe}
              selected={selectedIds.has(recipe.id)}
              onToggle={handleToggle}
              isOwner={isOwner}
            />
          ))}
        </div>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        transitionDuration={{ enter: 200, exit: 0 }}
      >
        <DialogTitle>{t("collectionDetail.deleteCollectionTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("collectionDetail.deleteCollectionMessage", {
              name: collectionName,
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>
            {t("collectionDetail.deleteCollectionCancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteCollection}
            disabled={deleting}
          >
            {t("collectionDetail.deleteCollectionConfirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

CollectionDetail.propTypes = {
  collectionId: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
  isOwner: PropTypes.bool,
};

CollectionDetail.defaultProps = {
  isOwner: false,
};

export default CollectionDetail;
