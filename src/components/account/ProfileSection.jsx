import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  Alert,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../stores/useAuthStore";
import "./ProfileSection.scss";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

const ProfileSection = () => {
  const { t } = useTranslation("account");
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const updateProfileData = useAuthStore((state) => state.updateProfileData);

  const [form, setForm] = useState({
    name: profile?.name || "",
    username: profile?.username || "",
    location: profile?.location || "",
    bio: profile?.bio || "",
  });
  useEffect(() => {
    setForm({
      name: profile?.name || "",
      username: profile?.username || "",
      location: profile?.location || "",
      bio: profile?.bio || "",
    });
  }, [profile]);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSuccessMessage("");
    setApiError("");
  };

  const validate = () => {
    const next = {};
    if (!form.name) next.name = t("account.profileSection.nameTooLong");
    if (!USERNAME_REGEX.test(form.username)) next.username = t("account.profileSection.usernameInvalid");
    return next;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    setApiError("");
    try {
      await updateProfileData(user.id, form);
      setSuccessMessage(t("account.profileSection.saveSuccess"));
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors({ username: t("account.profileSection.usernameTaken") });
      } else {
        setApiError(err.response?.data?.error || err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-section">
      <div className="profile-section__cover">
        <Tooltip title={t("account.profileSection.coverPhotoTooltip")}>
          <span className="profile-section__cover-btn">
            <IconButton disabled size="small">
              <CameraAltIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </div>

      <div className="profile-section__avatar-row">
        <div className="profile-section__avatar-wrap">
          <Avatar
            src={profile?.avatar_url}
            className="profile-section__avatar"
            sx={{ width: 108, height: 108 }}
          >
            {profile?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Tooltip title={t("account.profileSection.avatarTooltip")}>
            <span className="profile-section__avatar-edit">
              <IconButton disabled size="small" className="profile-section__avatar-edit-btn">
                <CameraAltIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>

      <div className="profile-section__body">
        <Typography variant="h6" fontWeight={600}>
          {t("account.profileSection.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t("account.profileSection.subtitle")}
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage("")}>
            {successMessage}
          </Alert>
        )}
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError("")}>
            {apiError}
          </Alert>
        )}

        <div className="profile-section__form">
          <Box className="profile-section__field profile-section__field--half">
            <TextField
              label={t("account.profileSection.name")}
              value={form.name}
              onChange={handleChange("name")}
              error={!!errors.name}
              helperText={errors.name}
              slotProps={{ htmlInput: { maxLength: 40 } }}
              fullWidth
            />
          </Box>

          <Box className="profile-section__field profile-section__field--half">
            <TextField
              label={t("account.profileSection.username")}
              value={form.username}
              onChange={handleChange("username")}
              error={!!errors.username}
              helperText={errors.username}
              slotProps={{
                htmlInput: { maxLength: 30 },
                input: { startAdornment: <span className="profile-section__at">@</span> },
              }}
              fullWidth
            />
          </Box>

          <Box className="profile-section__field profile-section__field--half">
            <TextField
              label={t("account.profileSection.location")}
              value={form.location}
              onChange={handleChange("location")}
              slotProps={{
                htmlInput: { maxLength: 40 },
                input: { startAdornment: <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} /> },
              }}
              fullWidth
            />
          </Box>

          <Box className="profile-section__field profile-section__field--full">
            <TextField
              label={t("account.profileSection.bio")}
              value={form.bio}
              onChange={handleChange("bio")}
              helperText={`${form.bio.length} / 500`}
              slotProps={{ htmlInput: { maxLength: 500 } }}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </div>

        <div className="profile-section__actions">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {t("account.profileSection.saveChanges")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
