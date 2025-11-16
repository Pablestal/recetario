import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../stores/useAuthStore";

const LoginDialog = ({ open, onClose, onSwitchToRegister }) => {
  const { t } = useTranslation("auth");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const signIn = useAuthStore((state) => state.signIn);

  const validationRules = {
    email: (value) => {
      if (!value || value.trim().length === 0) {
        return t("validation.email.required");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return t("validation.email.invalid");
      }
      return null;
    },
    password: (value) => {
      if (!value || value.trim().length === 0) {
        return t("validation.password.required");
      }
      if (value.length < 6) {
        return t("validation.password.minLength");
      }
      return null;
    },
  };

  const validateField = (fieldName, value) => {
    if (validationRules[fieldName]) {
      return validationRules[fieldName](value);
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    if (!formData.email || !formData.password) {
      return false;
    }

    const hasErrors = Object.keys(validationRules).some((field) => {
      const error = validateField(field, formData[field]);
      return error !== null;
    });

    return !hasErrors;
  };

  const handleFieldUpdate = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (touched[name] || submitAttempted) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleFieldBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    const error = validateField(fieldName, formData[fieldName]);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setGeneralError(null);

    if (validateForm()) {
      setLoading(true);
      try {
        await signIn(formData.email, formData.password);
        onClose();
        setFormData({ email: "", password: "" });
        setErrors({});
        setTouched({});
        setSubmitAttempted(false);
      } catch (err) {
        setGeneralError(err.message || t("errors.loginError"));
      } finally {
        setLoading(false);
      }
    } else {
      const newTouched = {};
      Object.keys(validationRules).forEach((field) => {
        newTouched[field] = true;
      });
      setTouched(newTouched);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({ email: "", password: "" });
    setErrors({});
    setTouched({});
    setSubmitAttempted(false);
    setGeneralError(null);
    setShowPassword(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("login")}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 0 }}>
          {generalError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {generalError}
            </Alert>
          )}

          <TextField
            label={t("email")}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFieldUpdate}
            onBlur={() => handleFieldBlur("email")}
            fullWidth
            required
            margin="normal"
            autoComplete="email"
            error={!!(touched.email || submitAttempted) && errors.email}
            helperText={
              (touched.email || submitAttempted) && errors.email
                ? errors.email
                : ""
            }
          />

          <TextField
            label={t("password")}
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleFieldUpdate}
            onBlur={() => handleFieldBlur("password")}
            fullWidth
            required
            margin="normal"
            autoComplete="current-password"
            error={!!(touched.password || submitAttempted) && errors.password}
            helperText={
              (touched.password || submitAttempted) && errors.password
                ? errors.password
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              {t("noAccount")}{" "}
              <Typography
                component="span"
                onClick={onSwitchToRegister}
                sx={{
                  color: "primary.main",
                  cursor: "pointer",
                  textDecoration: "underline",
                  "&:hover": { color: "primary.dark" },
                }}
              >
                {t("registerHere")}
              </Typography>
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>{t("cancel")}</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !isFormValid()}
          >
            {loading ? t("loading") : t("login")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
