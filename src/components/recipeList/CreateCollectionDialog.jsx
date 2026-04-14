import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import { useCollectionStore } from "../../stores/useCollectionStore";

const CreateCollectionDialog = ({ open, onClose, onCreated }) => {
  const { t } = useTranslation("recipeList");
  const createCollection = useCollectionStore(
    (state) => state.createCollection,
  );

  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const newCollection = await createCollection(name.trim(), isPublic);
      setName("");
      setIsPublic(true);
      onCreated(newCollection);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setIsPublic(true);
    onClose();
  };

  return (
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
        {t("createCollectionDialog.title")}
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
          {t("createCollectionDialog.nameLabel")}
        </Typography>
        <TextField
          fullWidth
          placeholder={t("createCollectionDialog.namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
        />
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "grey.100",
            borderRadius: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t("createCollectionDialog.makePublic")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("createCollectionDialog.makePublicDescription")}
            </Typography>
          </Box>
          <Switch
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleCreate}
          disabled={!name.trim() || loading}
        >
          {t("createCollectionDialog.create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CreateCollectionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func.isRequired,
};

export default CreateCollectionDialog;
