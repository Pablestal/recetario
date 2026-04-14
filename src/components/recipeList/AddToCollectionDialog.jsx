import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import { useCollectionStore } from "../../stores/useCollectionStore";
import Loading from "../common/Loading";
import CreateCollectionDialog from "./CreateCollectionDialog";

const AddToCollectionDialog = ({ open, onClose, recipeId }) => {
  const { t } = useTranslation("recipeList");
  const collections = useCollectionStore((state) => state.collections);
  const fetchCollections = useCollectionStore(
    (state) => state.fetchCollections,
  );
  const addRecipeToCollections = useCollectionStore(
    (state) => state.addRecipeToCollections,
  );

  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (open && collections.length === 0) {
      setLocalLoading(true);
      fetchCollections().then(() => setLocalLoading(false));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleToggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = async () => {
    await addRecipeToCollections(recipeId, [...selectedIds]);
    setSelectedIds(new Set());
    setSearchTerm("");
    onClose();
  };

  const handleClose = () => {
    setSelectedIds(new Set());
    setSearchTerm("");
    setCreateDialogOpen(false);
    onClose();
  };

  const handleCollectionCreated = async (newCollection) => {
    await addRecipeToCollections(recipeId, [newCollection.id]);
    setCreateDialogOpen(false);
    onClose();
  };

  const getCollectionName = (c) =>
    c.is_default ? t("addToCollectionDialog.defaultCollectionName") : c.name;

  const filteredCollections = collections.filter((c) =>
    getCollectionName(c).toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <CreateCollectionDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreated={handleCollectionCreated}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        transitionDuration={{ enter: 200, exit: 0 }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {t("addToCollectionDialog.title")}
          <Link component="button" variant="body2" onClick={handleClose}>
            {t("addToCollectionDialog.close")}
          </Link>
        </DialogTitle>
        <DialogContent>
          {localLoading && <Loading />}
          <TextField
            placeholder={t("addToCollectionDialog.searchPlaceholder")}
            fullWidth
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mt: 1, mb: 1 }}
          />
          <List disablePadding sx={{ maxHeight: 170, overflowY: "auto" }}>
            {filteredCollections.map((collection) => (
              <ListItem
                key={collection.id}
                disablePadding
                onClick={() => handleToggle(collection.id)}
                sx={{ cursor: "pointer" }}
              >
                <Checkbox
                  checked={selectedIds.has(collection.id)}
                  disableRipple
                />
                <ListItemText primary={getCollectionName(collection)} />
              </ListItem>
            ))}
          </List>
          <Link
            component="button"
            variant="body2"
            onClick={() => setCreateDialogOpen(true)}
            sx={{ mt: 1, display: "block" }}
          >
            {t("addToCollectionDialog.createCollection")}
          </Link>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={selectedIds.size === 0}
          >
            {t("addToCollectionDialog.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

AddToCollectionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  recipeId: PropTypes.number.isRequired,
};

export default AddToCollectionDialog;
