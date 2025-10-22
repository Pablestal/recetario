import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useTranslation } from "react-i18next";
import "./DeleteConfirmationDialog.scss";

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, recipeName }) => {
  const { t } = useTranslation("recipeDetails");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="delete-dialog"
    >
      <DialogTitle id="alert-dialog-title" className="delete-dialog__title">
        <WarningAmberIcon className="delete-dialog__icon" />
        {t("deleteDialog.title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t("deleteDialog.message")} <strong>"{recipeName}"</strong>?
        </DialogContentText>
        <DialogContentText className="delete-dialog__warning">
          {t("deleteDialog.warning")}
        </DialogContentText>
      </DialogContent>
      <DialogActions className="delete-dialog__actions">
        <Button onClick={onClose} color="primary" variant="outlined">
          {t("deleteDialog.cancel")}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          {t("deleteDialog.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
