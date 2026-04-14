import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useCollectionStore } from "../../stores/useCollectionStore";
import collectionPlaceholder from "../../assets/recipe_collection.png";
import CollectionDetail from "./CollectionDetail";
import CreateCollectionDialog from "../recipeList/CreateCollectionDialog";

const MAX_COLLECTION_RECIPES = 50;

const ProfileCollectionsTab = ({ userId, isOwner, initialCollections }) => {
  const { t } = useTranslation("userProfile");
  const collections = useCollectionStore((state) => state.collections);
  const setCollections = useCollectionStore((state) => state.setCollections);

  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [createCollectionOpen, setCreateCollectionOpen] = useState(false);

  useEffect(() => {
    setCollections(initialCollections ?? []);
  }, [initialCollections]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleCollections = isOwner
    ? collections
    : collections.filter((c) => c.is_public);

  if (selectedCollectionId !== null) {
    return (
      <CollectionDetail
        collectionId={selectedCollectionId}
        onBack={() => setSelectedCollectionId(null)}
        isOwner={isOwner}
      />
    );
  }

  return (
    <>
      {isOwner && (
        <div className="user-profile__collections-toolbar">
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setCreateCollectionOpen(true)}
          >
            {t("createCollection")}
          </Button>
        </div>
      )}

      {visibleCollections.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 6, textAlign: "center" }}>
          {isOwner ? t("noCollections") : t("noPublicCollections")}
        </Typography>
      ) : (
        <div className="user-profile__collection-grid">
          {[...visibleCollections]
            .sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))
            .map((collection) => (
              <div
                key={collection.id}
                className="user-profile__collection-card"
                onClick={() => setSelectedCollectionId(collection.id)}
                style={{
                  backgroundImage: `url(${collection.cover_image_url || collectionPlaceholder})`,
                }}
              >
                <div className="user-profile__collection-card__overlay" />
                <span className="user-profile__collection-card__count">
                  {(isOwner ? collection.recipe_count : collection.public_recipe_count) ?? 0}/{MAX_COLLECTION_RECIPES}
                </span>
                <div className="user-profile__collection-card__footer">
                  <Typography
                    className="user-profile__collection-card__name"
                    variant="subtitle1"
                    fontWeight={700}
                    noWrap
                  >
                    {collection.is_default
                      ? t("addToCollectionDialog.defaultCollectionName", {
                          ns: "recipeList",
                        })
                      : collection.name}
                  </Typography>
                  {isOwner && (collection.is_public ? (
                    <LockOpenIcon
                      className="user-profile__collection-card__icon"
                      fontSize="small"
                    />
                  ) : (
                    <LockIcon
                      className="user-profile__collection-card__icon"
                      fontSize="small"
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {isOwner && (
        <CreateCollectionDialog
          open={createCollectionOpen}
          onClose={() => setCreateCollectionOpen(false)}
          onCreated={() => setCreateCollectionOpen(false)}
        />
      )}
    </>
  );
};

ProfileCollectionsTab.propTypes = {
  userId: PropTypes.string.isRequired,
  isOwner: PropTypes.bool,
  initialCollections: PropTypes.array,
};

ProfileCollectionsTab.defaultProps = {
  isOwner: false,
  initialCollections: [],
};

export default ProfileCollectionsTab;
