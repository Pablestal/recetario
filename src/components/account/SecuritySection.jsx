import { useState } from "react";
import {
  Alert,
  Button,
  Collapse,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../stores/useAuthStore";
import "./SecuritySection.scss";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_PASSWORD_FORM = { currentPassword: "", newPassword: "", confirmPassword: "" };
const EMPTY_EMAIL_FORM = { currentPassword: "", newEmail: "", confirmEmail: "" };

const SecuritySection = () => {
  const { t } = useTranslation("account");
  const user = useAuthStore((state) => state.user);
  const changePassword = useAuthStore((state) => state.changePassword);
  const changeEmail = useAuthStore((state) => state.changeEmail);

  // null | "password" | "email"
  const [openSection, setOpenSection] = useState(null);

  const [passwordForm, setPasswordForm] = useState(EMPTY_PASSWORD_FORM);
  const [passwordShow, setPasswordShow] = useState({ current: false, new: false, confirm: false });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordApiError, setPasswordApiError] = useState("");

  const [emailForm, setEmailForm] = useState(EMPTY_EMAIL_FORM);
  const [emailPasswordShow, setEmailPasswordShow] = useState(false);
  const [emailErrors, setEmailErrors] = useState({});
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState("");
  const [emailApiError, setEmailApiError] = useState("");

  const handleOpenSection = (section) => {
    setOpenSection(section);
    setPasswordSuccess("");
    setEmailSuccess("");
  };

  const handleCancelPassword = () => {
    setOpenSection(null);
    setPasswordForm(EMPTY_PASSWORD_FORM);
    setPasswordErrors({});
    setPasswordApiError("");
  };

  const handleCancelEmail = () => {
    setOpenSection(null);
    setEmailForm(EMPTY_EMAIL_FORM);
    setEmailErrors({});
    setEmailApiError("");
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
    setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
    setPasswordApiError("");
  };

  const handleEmailChange = (field) => (e) => {
    setEmailForm((prev) => ({ ...prev, [field]: e.target.value }));
    setEmailErrors((prev) => ({ ...prev, [field]: "" }));
    setEmailApiError("");
  };

  const togglePasswordShow = (field) => {
    setPasswordShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const visibilityAdornment = (visible, onToggle) => (
    <InputAdornment position="end">
      <IconButton onClick={onToggle} edge="end" size="small">
        {visible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
      </IconButton>
    </InputAdornment>
  );

  const handleSubmitPassword = async () => {
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = t("account.securitySection.currentPassword");
    if (!PASSWORD_REGEX.test(passwordForm.newPassword)) errors.newPassword = t("account.securitySection.passwordTooWeak");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = t("account.securitySection.passwordMismatch");
    if (Object.keys(errors).length > 0) { setPasswordErrors(errors); return; }

    setPasswordSaving(true);
    setPasswordApiError("");
    try {
      await changePassword(user.id, passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordSuccess(t("account.securitySection.passwordUpdateSuccess"));
      setPasswordForm(EMPTY_PASSWORD_FORM);
      setOpenSection(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setPasswordErrors({ currentPassword: t("account.securitySection.wrongPassword") });
      } else {
        setPasswordApiError(err.response?.data?.error || err.message);
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSubmitEmail = async () => {
    const errors = {};
    if (!emailForm.currentPassword) errors.currentPassword = t("account.securitySection.currentPassword");
    if (!EMAIL_REGEX.test(emailForm.newEmail)) errors.newEmail = t("account.securitySection.invalidEmail");
    if (emailForm.newEmail !== emailForm.confirmEmail) errors.confirmEmail = t("account.securitySection.emailMismatch");
    if (Object.keys(errors).length > 0) { setEmailErrors(errors); return; }

    setEmailSaving(true);
    setEmailApiError("");
    try {
      await changeEmail(user.id, emailForm.currentPassword, emailForm.newEmail);
      setEmailSuccess(t("account.securitySection.emailUpdateSuccess"));
      setEmailForm(EMPTY_EMAIL_FORM);
      setOpenSection(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setEmailErrors({ currentPassword: t("account.securitySection.wrongPasswordForEmail") });
      } else {
        setEmailApiError(err.response?.data?.error || err.message);
      }
    } finally {
      setEmailSaving(false);
    }
  };

  return (
    <div className="security-section">
      <div className="security-section__header">
        <div className="security-section__header-text">
          <div className="security-section__title-row">
            <LockOutlinedIcon fontSize="small" color="action" />
            <Typography variant="h6" fontWeight={600}>
              {t("account.securitySection.title")}
            </Typography>
          </div>
          <Typography variant="body2" color="text.secondary">
            {t("account.securitySection.subtitle")}
          </Typography>
        </div>

        {openSection === null && (
          <div className="security-section__header-buttons">
            <Button variant="outlined" onClick={() => handleOpenSection("password")}>
              {t("account.securitySection.changePasswordButton")}
            </Button>
            <Button variant="outlined" onClick={() => handleOpenSection("email")}>
              {t("account.securitySection.changeEmailButton")}
            </Button>
          </div>
        )}
      </div>

      {passwordSuccess && openSection === null && (
        <Alert severity="success" sx={{ mt: 2 }} onClose={() => setPasswordSuccess("")}>
          {passwordSuccess}
        </Alert>
      )}
      {emailSuccess && openSection === null && (
        <Alert severity="success" sx={{ mt: 2 }} onClose={() => setEmailSuccess("")}>
          {emailSuccess}
        </Alert>
      )}

      {/* Change password form */}
      <Collapse in={openSection === "password"} unmountOnExit>
        <Divider sx={{ mt: 2 }} />
        <div className="security-section__form">
          {passwordApiError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPasswordApiError("")}>
              {passwordApiError}
            </Alert>
          )}
          <TextField
            label={t("account.securitySection.currentPassword")}
            type={passwordShow.current ? "text" : "password"}
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange("currentPassword")}
            error={!!passwordErrors.currentPassword}
            helperText={passwordErrors.currentPassword}
            slotProps={{ input: { endAdornment: visibilityAdornment(passwordShow.current, () => togglePasswordShow("current")) } }}
            fullWidth
          />
          <TextField
            label={t("account.securitySection.newPassword")}
            type={passwordShow.new ? "text" : "password"}
            value={passwordForm.newPassword}
            onChange={handlePasswordChange("newPassword")}
            error={!!passwordErrors.newPassword}
            helperText={passwordErrors.newPassword}
            slotProps={{ input: { endAdornment: visibilityAdornment(passwordShow.new, () => togglePasswordShow("new")) } }}
            fullWidth
          />
          <TextField
            label={t("account.securitySection.confirmPassword")}
            type={passwordShow.confirm ? "text" : "password"}
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange("confirmPassword")}
            error={!!passwordErrors.confirmPassword}
            helperText={passwordErrors.confirmPassword}
            slotProps={{ input: { endAdornment: visibilityAdornment(passwordShow.confirm, () => togglePasswordShow("confirm")) } }}
            fullWidth
          />
          <div className="security-section__actions">
            <Button variant="text" onClick={handleCancelPassword} disabled={passwordSaving}>
              {t("account.securitySection.cancel")}
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmitPassword} disabled={passwordSaving}>
              {t("account.securitySection.updatePassword")}
            </Button>
          </div>
        </div>
      </Collapse>

      {/* Change email form */}
      <Collapse in={openSection === "email"} unmountOnExit>
        <Divider sx={{ mt: 2 }} />
        <div className="security-section__form">
          {emailApiError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setEmailApiError("")}>
              {emailApiError}
            </Alert>
          )}
          <TextField
            label={t("account.securitySection.currentPassword")}
            type={emailPasswordShow ? "text" : "password"}
            value={emailForm.currentPassword}
            onChange={handleEmailChange("currentPassword")}
            error={!!emailErrors.currentPassword}
            helperText={emailErrors.currentPassword}
            slotProps={{ input: { endAdornment: visibilityAdornment(emailPasswordShow, () => setEmailPasswordShow((v) => !v)) } }}
            fullWidth
          />
          <TextField
            label={t("account.securitySection.newEmail")}
            type="email"
            value={emailForm.newEmail}
            onChange={handleEmailChange("newEmail")}
            error={!!emailErrors.newEmail}
            helperText={emailErrors.newEmail}
            fullWidth
          />
          <TextField
            label={t("account.securitySection.confirmEmail")}
            type="email"
            value={emailForm.confirmEmail}
            onChange={handleEmailChange("confirmEmail")}
            error={!!emailErrors.confirmEmail}
            helperText={emailErrors.confirmEmail}
            fullWidth
          />
          <div className="security-section__actions">
            <Button variant="text" onClick={handleCancelEmail} disabled={emailSaving}>
              {t("account.securitySection.cancel")}
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmitEmail} disabled={emailSaving}>
              {t("account.securitySection.updateEmail")}
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default SecuritySection;
