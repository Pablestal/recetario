import "./LanguageSelector.scss";
import { useTranslation } from "react-i18next";
import { Select, MenuItem, FormControl, Box } from "@mui/material";

const languages = [
  { code: "en", name: "English", flag: "fi fi-gb" },
  { code: "es", name: "Español", flag: "fi fi-es" },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation("common");

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Box sx={{ marginRight: 2 }}>
      <FormControl size="small">
        <Select
          value={i18n.language}
          onChange={handleLanguageChange}
          sx={{ maxWidth: 100 }}
          variant="standard"
          IconComponent={null}
        >
          {languages.map((language) => (
            <MenuItem key={language.code} value={language.code}>
              <span className={language.flag}></span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;
