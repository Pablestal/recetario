import { TextField, Rating, Box, InputAdornment, Alert } from "@mui/material";
import LocalDiningIcon from "@mui/icons-material/LocalDiningOutlined";
import LocalDiningOutlinedIcon from "@mui/icons-material/LocalDiningOutlined";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import TagForm from "./TagsForm";

const NAME_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: theme.palette.secondary.main,
  },
  "& .MuiRating-iconHover": {
    color: theme.palette.secondary.dark,
  },
}));

const RecipeInfoForm = ({
  recipeForm,
  errors,
  touched,
  handleFieldUpdate,
  handleFieldBlur,
  handleDifficultyChange,
  handleTagsUpdate,
  submitAttempted,
}) => {
  const { t } = useTranslation("createRecipe");

  const hasErrors = Object.keys(errors).some((key) => errors[key]);
  const shouldShowError = (fieldName) =>
    submitAttempted || touched[fieldName] ? !!errors[fieldName] : false;

  const handlePrepTimeChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4) {
      handleFieldUpdate(e);
    }
  };

  const handleServingsChange = (e) => {
    const value = e.target.value;
    if (value.length <= 3) {
      handleFieldUpdate(e);
    }
  };

  const handleCaloriesChange = (e) => {
    const value = e.target.value;
    if (value.length <= 5) {
      handleFieldUpdate(e);
    }
  };

  return (
    <>
      {hasErrors && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t("messages.error")}
        </Alert>
      )}
      <TextField
        id="name"
        value={recipeForm.name}
        label={`${t("fields.name.label")} *`}
        variant="filled"
        className="create-recipe__name"
        fullWidth
        onChange={handleFieldUpdate}
        onBlur={() => handleFieldBlur("name")}
        sx={{ mb: 4 }}
        error={shouldShowError("name")}
        slotProps={{
          htmlInput: {
            maxLength: NAME_MAX_LENGTH,
          },
        }}
      />

      <TextField
        id="description"
        value={recipeForm.description}
        label={t("fields.description.label")}
        variant="filled"
        multiline
        rows={6}
        fullWidth
        className="create-recipe__description"
        onChange={handleFieldUpdate}
        onBlur={() => handleFieldBlur("description")}
        sx={{ mb: 4 }}
        error={shouldShowError("description")}
        helperText={t("messages.characters", {
          current: recipeForm.description.length,
          max: DESCRIPTION_MAX_LENGTH,
        })}
        slotProps={{
          htmlInput: {
            maxLength: DESCRIPTION_MAX_LENGTH,
          },
        }}
      />

      <div className="create-recipe__numeric-inputs">
        <TextField
          id="prepTime"
          value={recipeForm.prepTime}
          label={`${t("fields.prepTime.label")} *`}
          variant="filled"
          type="number"
          className="create-recipe__preptime"
          onChange={handlePrepTimeChange}
          onBlur={() => handleFieldBlur("prepTime")}
          sx={{ width: "100px" }}
          error={shouldShowError("prepTime")}
          slotProps={{
            htmlInput: {
              min: 1,
              max: 9999,
              inputMode: "numeric",
              pattern: "[0-9]*",
            },
            input: {
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{ alignSelf: "flex-end", mb: 1 }}
                >
                  m
                </InputAdornment>
              ),
            },
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          id="servings"
          value={recipeForm.servings}
          label={`${t("fields.servings.label")} *`}
          variant="filled"
          type="number"
          className="create-recipe__servings"
          onChange={handleServingsChange}
          onBlur={() => handleFieldBlur("servings")}
          sx={{ width: "100px" }}
          error={shouldShowError("servings")}
          slotProps={{
            htmlInput: {
              min: 1,
              max: 999,
              inputMode: "numeric",
              pattern: "[0-9]*",
            },
            input: {
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{ alignSelf: "flex-end", mb: 1 }}
                >
                  <RestaurantIcon />
                </InputAdornment>
              ),
            },
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          id="calories"
          value={recipeForm.calories}
          label={t("fields.calories.label")}
          variant="filled"
          type="number"
          className="create-recipe__calories"
          onChange={handleCaloriesChange}
          onBlur={() => handleFieldBlur("calories")}
          sx={{ width: "120px" }}
          error={shouldShowError("calories")}
          slotProps={{
            htmlInput: {
              min: 1,
              max: 99999,
              inputMode: "numeric",
              pattern: "[0-9]*",
            },
            input: {
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{ alignSelf: "flex-end", mb: 1 }}
                >
                  kcal
                </InputAdornment>
              ),
            },
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <Box
          sx={{
            maxWidth: 200,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "baseline",
          }}
        >
          <p
            className="create-recipe__difficulty-label"
            style={{
              color: shouldShowError("difficulty") ? "#d32f2f" : "inherit",
            }}
          >
            {t("fields.difficulty.label")} *
          </p>
          <StyledRating
            sx={{ mt: 1 }}
            id="difficulty"
            className="create-recipe__difficulty"
            value={recipeForm.difficulty}
            getLabelText={(value) => `${value} Dining${value !== 1 ? "s" : ""}`}
            onChange={handleDifficultyChange}
            onBlur={() => handleFieldBlur("difficulty")}
            precision={1}
            icon={<LocalDiningIcon fontSize="inherit" />}
            emptyIcon={<LocalDiningOutlinedIcon fontSize="inherit" />}
          />
        </Box>

        <TagForm recipe={recipeForm} handleTagsUpdate={handleTagsUpdate} />
      </div>
    </>
  );
};

export default RecipeInfoForm;
