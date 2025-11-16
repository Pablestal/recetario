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
import { useAuthStore } from "../../stores/useAuthStore";
import { useTranslation } from "react-i18next";

const RegisterDialog = ({ open, onClose, onSwitchToLogin }) => {
  const { t } = useTranslation("auth");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signUp = useAuthStore((state) => state.signUp);

  const validationRules = {
    name: (value) => {
      if (!value || value.trim().length === 0) {
        return t("validation.name.required");
      }
      if (value.trim().length < 2) {
        return t("validation.name.minLength");
      }
      return null;
    },
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
    confirmPassword: (value) => {
      if (!value || value.trim().length === 0) {
        return t("validation.confirmPassword.required");
      }
      if (value !== formData.password) {
        return t("validation.confirmPassword.noMatch");
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
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
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

    if (name === "password" && (touched.confirmPassword || submitAttempted)) {
      const confirmError = validateField(
        "confirmPassword",
        formData.confirmPassword
      );
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError,
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
    setSuccess(false);

    if (validateForm()) {
      setLoading(true);
      try {
        await signUp(formData.email, formData.password, {
          name: formData.name.trim(),
        });
        setSuccess(true);

        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
        setTouched({});
        setSubmitAttempted(false);

        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      } catch (err) {
        setGeneralError(err.message || t("errors.registerError"));
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
    if (!success) {
      onClose();
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      setTouched({});
      setSubmitAttempted(false);
      setGeneralError(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("createAccount")}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 0 }}>
          {generalError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {generalError}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {t("success.registrationSuccess")}
            </Alert>
          )}

          <TextField
            label={t("name")}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleFieldUpdate}
            onBlur={() => handleFieldBlur("name")}
            fullWidth
            required
            margin="normal"
            autoComplete="name"
            error={!!(touched.name || submitAttempted) && errors.name}
            helperText={
              (touched.name || submitAttempted) && errors.name
                ? errors.name
                : ""
            }
          />

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
            autoComplete="new-password"
            error={!!(touched.password || submitAttempted) && errors.password}
            helperText={
              (touched.password || submitAttempted) && errors.password
                ? errors.password
                : t("passwordHelper")
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

          <TextField
            label={t("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleFieldUpdate}
            onBlur={() => handleFieldBlur("confirmPassword")}
            fullWidth
            required
            margin="normal"
            autoComplete="new-password"
            error={
              !!(touched.confirmPassword || submitAttempted) &&
              errors.confirmPassword
            }
            helperText={
              (touched.confirmPassword || submitAttempted) &&
              errors.confirmPassword
                ? errors.confirmPassword
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleToggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              {t("alreadyHaveAccount")}{" "}
              <Typography
                component="span"
                onClick={onSwitchToLogin}
                sx={{
                  color: "primary.main",
                  cursor: "pointer",
                  textDecoration: "underline",
                  "&:hover": { color: "primary.dark" },
                }}
              >
                {t("loginHere")}
              </Typography>
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={success}>
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || success || !isFormValid()}
          >
            {loading ? t("loading") : t("register")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RegisterDialog;
