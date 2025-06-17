import "./LanguageSelector.scss";
import { useTranslation } from "react-i18next";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation("common");

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Box sx={{ marginRight: 1 }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={i18n.language}
          onChange={handleLanguageChange}
          sx={{ backgroundColor: "white", maxWidth: 100 }}
        >
          {languages.map((language) => (
            <MenuItem key={language.code} value={language.code}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2">{language.name}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;
