import "./LanguageSelector.scss";
import { useTranslation } from "react-i18next";
import { Select, MenuItem, FormControl, Box, useMediaQuery, useTheme } from "@mui/material";

const languages = [
  { code: "en", name: "English", shortName: "EN" },
  { code: "es", name: "Español", shortName: "ES" },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation("common");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Box sx={{ marginRight: 2, display: "flex", alignItems: "center" }}>
      <FormControl size="small">
        <Select
          value={i18n.language}
          onChange={handleLanguageChange}
          sx={{
            color: "primary.main",
            minHeight: "auto",
            ".MuiSelect-select": {
              paddingTop: "8px",
              paddingBottom: "8px",
              paddingRight: "24px !important",
              lineHeight: "1.5",
            },
            ".MuiSelect-icon": {
              color: "primary.main",
            },
            "&:before": { display: "none" },
            "&:after": { display: "none" },
          }}
          variant="standard"
        >
          {languages.map((language) => (
            <MenuItem key={language.code} value={language.code}>
              {isMobile ? language.shortName : language.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;
