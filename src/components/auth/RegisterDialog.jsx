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
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircleOutlined,
} from "@mui/icons-material";
import { useAuthStore } from "../../stores/useAuthStore";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

const EMPTY_FORM = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// "idle" | "checking" | "available" | "taken" | "invalid"
const INITIAL_USERNAME_STATUS = "idle";

const RegisterDialog = ({ open, onClose, onSwitchToLogin }) => {
  const { t } = useTranslation("auth");

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(INITIAL_USERNAME_STATUS);
  const [emailStatus, setEmailStatus] = useState("idle"); // "idle" | "checking" | "available" | "taken"

  const signUp = useAuthStore((state) => state.signUp);

  const validationRules = {
    name: (value) => {
      if (!value || value.trim().length === 0)
        return t("validation.name.required");
      if (value.trim().length < 2) return t("validation.name.minLength");
      return null;
    },
    email: (value) => {
      if (!value || value.trim().length === 0)
        return t("validation.email.required");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return t("validation.email.invalid");
      return null;
    },
    password: (value) => {
      if (!value || value.trim().length === 0)
        return t("validation.password.required");
      if (value.length < 6) return t("validation.password.minLength");
      return null;
    },
    confirmPassword: (value) => {
      if (!value || value.trim().length === 0)
        return t("validation.confirmPassword.required");
      if (value !== formData.password)
        return t("validation.confirmPassword.noMatch");
      return null;
    },
  };

  const validateField = (fieldName, value) =>
    validationRules[fieldName] ? validationRules[fieldName](value) : null;

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
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    )
      return false;
    if (usernameStatus !== "available") return false;
    if (emailStatus !== "available") return false;
    return !Object.keys(validationRules).some(
      (field) => validateField(field, formData[field]) !== null,
    );
  };

  const checkEmailAvailability = async (email) => {
    setEmailStatus("checking");
    try {
      const res = await fetch(`${API_URL}/users/check-email/${encodeURIComponent(email)}`);
      const data = await res.json();
      const available = data?.data?.available === true;
      setEmailStatus(available ? "available" : "taken");
    } catch {
      setEmailStatus("idle");
    }
  };

  const checkUsernameAvailability = async (username) => {
    if (!USERNAME_REGEX.test(username)) {
      setUsernameStatus("invalid");
      return;
    }
    setUsernameStatus("checking");
    try {
      const usernameCheck = await fetch(
        `${API_URL}/users/check-username/${encodeURIComponent(username)}`,
      );
      const response = await usernameCheck.json();
      const available = response?.data?.available === true;
      setUsernameStatus(available ? "available" : "taken");
    } catch {
      setUsernameStatus("idle");
    }
  };

  const handleFieldUpdate = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "username") {
      setUsernameStatus("idle");
      return;
    }
    if (name === "email") {
      setEmailStatus("idle");
    }

    if (touched[name] || submitAttempted) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
    if (name === "password" && (touched.confirmPassword || submitAttempted)) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField(
          "confirmPassword",
          formData.confirmPassword,
        ),
      }));
    }
  };

  const handleFieldBlur = (fieldName) => {
    if (fieldName === "username") {
      setTouched((prev) => ({ ...prev, username: true }));
      checkUsernameAvailability(formData.username);
      return;
    }
    if (fieldName === "email") {
      setTouched((prev) => ({ ...prev, email: true }));
      const formatError = validateField("email", formData.email);
      setErrors((prev) => ({ ...prev, email: formatError }));
      if (!formatError) checkEmailAvailability(formData.email);
      return;
    }
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    setErrors((prev) => ({
      ...prev,
      [fieldName]: validateField(fieldName, formData[fieldName]),
    }));
  };

  const getUsernameHelperText = () => {
    if (usernameStatus === "checking") return t("usernameChecking");
    if (usernameStatus === "available") return t("usernameAvailable");
    if (usernameStatus === "taken") return t("usernameTaken");
    if (
      usernameStatus === "invalid" ||
      (touched.username && !formData.username)
    ) {
      return formData.username
        ? t("validation.username.pattern")
        : t("validation.username.required");
    }
    return "";
  };

  const getUsernameAdornment = () => {
    if (usernameStatus === "checking") {
      return (
        <InputAdornment position="end">
          <CircularProgress size={18} />
        </InputAdornment>
      );
    }
    if (usernameStatus === "available") {
      return (
        <InputAdornment position="end">
          <CheckCircleOutlined fontSize="small" color="success" />
        </InputAdornment>
      );
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setGeneralError(null);
    setSuccess(false);

    if (validateForm() && usernameStatus === "available") {
      setLoading(true);
      try {
        await signUp(formData.email, formData.password, {
          name: formData.name.trim(),
          username: formData.username.trim(),
        });
        setSuccess(true);
        setFormData(EMPTY_FORM);
        setErrors({});
        setTouched({});
        setSubmitAttempted(false);
        setUsernameStatus(INITIAL_USERNAME_STATUS);
        setEmailStatus("idle");
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
      newTouched.username = true;
      setTouched(newTouched);
    }
  };

  const handleClose = () => {
    if (success) return;
    onClose();
    setFormData(EMPTY_FORM);
    setErrors({});
    setTouched({});
    setSubmitAttempted(false);
    setGeneralError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setUsernameStatus(INITIAL_USERNAME_STATUS);
    setEmailStatus("idle");
  };

  const usernameError =
    usernameStatus === "taken" ||
    usernameStatus === "invalid" ||
    (touched.username && !formData.username);

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
            slotProps={{ htmlInput: { maxLength: 40 } }}
            error={!!(touched.name || submitAttempted) && !!errors.name}
            helperText={
              (touched.name || submitAttempted) && errors.name
                ? errors.name
                : ""
            }
          />

          <TextField
            label={t("username")}
            type="text"
            name="username"
            value={formData.username}
            onChange={handleFieldUpdate}
            onBlur={() => handleFieldBlur("username")}
            fullWidth
            required
            margin="normal"
            autoComplete="username"
            slotProps={{
              htmlInput: { maxLength: 30 },
              input: {
                startAdornment: (
                  <InputAdornment position="start">@</InputAdornment>
                ),
                endAdornment: getUsernameAdornment(),
              },
            }}
            error={usernameError}
            helperText={getUsernameHelperText()}
            FormHelperTextProps={{
              sx:
                usernameStatus === "available"
                  ? { color: "success.main" }
                  : undefined,
            }}
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
            error={(!!(touched.email || submitAttempted) && !!errors.email) || emailStatus === "taken"}
            helperText={
              emailStatus === "checking" ? t("emailChecking") :
              emailStatus === "available" ? t("emailAvailable") :
              emailStatus === "taken" ? t("emailTaken") :
              (touched.email || submitAttempted) && errors.email ? errors.email : ""
            }
            FormHelperTextProps={{
              sx: emailStatus === "available" ? { color: "success.main" } : undefined,
            }}
            slotProps={{
              input: {
                endAdornment: emailStatus === "checking" ? (
                  <InputAdornment position="end"><CircularProgress size={18} /></InputAdornment>
                ) : emailStatus === "available" ? (
                  <InputAdornment position="end"><CheckCircleOutlined fontSize="small" color="success" /></InputAdornment>
                ) : null,
              },
            }}
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
            error={!!(touched.password || submitAttempted) && !!errors.password}
            helperText={
              (touched.password || submitAttempted) && errors.password
                ? errors.password
                : t("passwordHelper")
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((p) => !p)}
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
              !!errors.confirmPassword
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
                    onClick={() => setShowConfirmPassword((p) => !p)}
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
