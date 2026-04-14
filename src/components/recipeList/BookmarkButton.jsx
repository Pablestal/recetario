import { useState } from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useTranslation } from "react-i18next";
import { useCollectionStore } from "../../stores/useCollectionStore";
import Loading from "../common/Loading";
import AddToCollectionDialog from "./AddToCollectionDialog";
import "./RecipeCard.scss";

const BookmarkButton = ({ recipeId, isBookmarked }) => {
  const { t } = useTranslation("recipeList");
  const collections = useCollectionStore((state) => state.collections);
  const fetchCollections = useCollectionStore(
    (state) => state.fetchCollections,
  );
  const removeRecipeFromCollections = useCollectionStore(
    (state) => state.removeRecipeFromCollections,
  );

  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);
  const [removeBookmarkDialogOpen, setRemoveBookmarkDialogOpen] =
    useState(false);
  const [fetching, setFetching] = useState(false);

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) {
      setRemoveBookmarkDialogOpen(true);
    } else {
      if (collections.length === 0) {
        setFetching(true);
        await fetchCollections();
        setFetching(false);
      }
      setBookmarkDialogOpen(true);
    }
  };

  const handleConfirmRemoveBookmark = async () => {
    setRemoveBookmarkDialogOpen(false);
    await removeRecipeFromCollections(recipeId);
  };

  return (
    <>
      {fetching && <Loading />}
      <IconButton
        aria-label={
          isBookmarked
            ? t("recipeCard.removeBookmark")
            : t("recipeCard.addBookmark")
        }
        onClick={handleBookmarkClick}
      >
        {isBookmarked ? (
          <BookmarkIcon className="recipe-card__bookmark-icon--active" />
        ) : (
          <BookmarkBorderIcon />
        )}
      </IconButton>
      <AddToCollectionDialog
        open={bookmarkDialogOpen}
        onClose={() => setBookmarkDialogOpen(false)}
        recipeId={recipeId}
      />
      <Dialog
        open={removeBookmarkDialogOpen}
        onClose={() => setRemoveBookmarkDialogOpen(false)}
        transitionDuration={{ enter: 200, exit: 0 }}
      >
        <DialogTitle>{t("removeBookmarkDialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("removeBookmarkDialog.message")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setRemoveBookmarkDialogOpen(false)}
          >
            {t("removeBookmarkDialog.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmRemoveBookmark}
          >
            {t("removeBookmarkDialog.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

BookmarkButton.propTypes = {
  recipeId: PropTypes.number.isRequired,
  isBookmarked: PropTypes.bool.isRequired,
};

export default BookmarkButton;
