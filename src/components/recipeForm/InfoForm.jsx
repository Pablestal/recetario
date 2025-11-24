import { TextField, Rating, Box, InputAdornment, Alert } from "@mui/material";
import LocalDiningIcon from "@mui/icons-material/LocalDiningOutlined";
import LocalDiningOutlinedIcon from "@mui/icons-material/LocalDiningOutlined";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import TagForm from "./TagsForm";

const NAME_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;
const NUMERIC_MAX_LENGTH = 3;

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

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
        placeholder={t("fields.name.placeholder")}
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
        placeholder={t("fields.description.placeholder")}
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
          onChange={handleFieldUpdate}
          onBlur={() => handleFieldBlur("prepTime")}
          sx={{ width: "100px" }}
          error={shouldShowError("prepTime")}
          slotProps={{
            htmlInput: {
              min: 1,
              max: 999,
              maxLength: NUMERIC_MAX_LENGTH,
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
          onChange={handleFieldUpdate}
          onBlur={() => handleFieldBlur("servings")}
          sx={{ width: "100px" }}
          error={shouldShowError("servings")}
          slotProps={{
            htmlInput: {
              min: 1,
              max: 99,
              maxLength: NUMERIC_MAX_LENGTH,
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
          onChange={handleFieldUpdate}
          onBlur={() => handleFieldBlur("calories")}
          sx={{ width: "120px" }}
          error={shouldShowError("calories")}
          slotProps={{
            htmlInput: {
              min: 1,
              max: 9999,
              maxLength: 4,
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
