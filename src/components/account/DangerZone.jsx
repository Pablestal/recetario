import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { routes } from "../../routes";
import "./DangerZone.scss";

const DangerZone = () => {
  const { t } = useTranslation("account");
  const user = useAuthStore((state) => state.user);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setApiError("");
    try {
      await deleteAccount(user.id);
      navigate(routes.recipes);
    } catch (err) {
      setApiError(err.response?.data?.error || err.message);
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="danger-zone">
      <div className="danger-zone__header">
        <WarningAmberIcon color="error" fontSize="small" />
        <Typography variant="h6" fontWeight={600} color="error">
          {t("account.dangerZone.title")}
        </Typography>
      </div>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t("account.dangerZone.warning")}
      </Typography>

      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError("")}>
          {apiError}
        </Alert>
      )}

      <Button
        variant="outlined"
        color="error"
        onClick={() => setConfirmOpen(true)}
        className="danger-zone__delete-btn"
      >
        {t("account.dangerZone.deleteAccount")}
      </Button>

      <Dialog open={confirmOpen} onClose={() => !deleting && setConfirmOpen(false)}>
        <DialogTitle>{t("account.dangerZone.confirmTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("account.dangerZone.confirmMessage")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
            {t("account.dangerZone.cancelButton")}
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
            {t("account.dangerZone.confirmButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DangerZone;
