import "./CreateRecipe.scss";
import {
  TextField,
  Button,
  Rating,
  Box,
  InputAdornment,
  Alert,
} from "@mui/material";
import LocalDiningIcon from "@mui/icons-material/LocalDiningOutlined";
import LocalDiningOutlinedIcon from "@mui/icons-material/LocalDiningOutlined";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import IngredientForm from "../components/recipeForm/IngredientsForm";
import StepsForm from "../components/recipeForm/StepsForm";
import ImagesForm from "../components/recipeForm/ImagesForm";
import { useTranslation } from "react-i18next";

const NAME_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;
const NUMERIC_MAX_LENGTH = 3;

function CreateRecipe() {
  const { t } = useTranslation("createRecipe");

  const validationRules = {
    name: (value) => {
      if (!value || value.trim().length === 0)
        return t("validation.name.required");
      if (value.trim().length < 3) return t("validation.name.minLength");
      if (value.length > NAME_MAX_LENGTH)
        return t("validation.name.maxLength", {
          max: NAME_MAX_LENGTH,
        });
      return null;
    },

    description: (value) => {
      if (value.length > DESCRIPTION_MAX_LENGTH)
        return t("validation.description.maxLength", {
          max: DESCRIPTION_MAX_LENGTH,
        });
      return null;
    },

    prepTime: (value) => {
      if (!value || value.toString().trim().length === 0)
        return t("validation.prepTime.required");
      const numValue = parseInt(value);
      if (isNaN(numValue)) return t("validation.prepTime.invalid");
      if (numValue < 1) return t("validation.prepTime.min");
      if (numValue > 999) return t("validation.prepTime.max");
      return null;
    },

    servings: (value) => {
      if (!value || value.toString().trim().length === 0)
        return t("validation.servings.required");
      const numValue = parseInt(value);
      if (isNaN(numValue)) return t("validation.servings.invalid");
      if (numValue < 1) return t("validation.servings.min");
      if (numValue > 99) return t("validation.servings.max");
      return null;
    },

    difficulty: (value) => {
      if (value === null || value === undefined || value < 1)
        return t("validation.difficulty.required");
      if (value > 5) return t("validation.difficulty.max");
      return null;
    },

    ingredients: (ingredients) => {
      if (!ingredients || ingredients.length === 0)
        return t("validation.ingredients.required");
      return null;
    },

    steps: (steps) => {
      if (!steps || steps.length === 0) return t("validation.steps.required");
      return null;
    },
  };

  const recipe = {
    name: "",
    description: "",
    prepTime: "",
    servings: "",
    difficulty: -1,
    ingredients: [],
    steps: [],
    tags: [],
    images: [],
    author: {},
    createdDate: "",
  };

  const [recipeForm, setRecipeForm] = useState(recipe);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Validar un campo específico
  const validateField = (fieldName, value) => {
    if (validationRules[fieldName]) {
      return validationRules[fieldName](value);
    }
    return null;
  };

  // Validar todo el formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar campos básicos
    Object.keys(validationRules).forEach((field) => {
      if (field === "ingredients" || field === "steps") {
        const error = validationRules[field](recipeForm[field]);
        if (error) newErrors[field] = error;
      } else {
        const error = validateField(field, recipeForm[field]);
        if (error) newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (validateForm()) {
      // Aquí irían las acciones de envío (API call, etc.)

      // Reset del formulario después del envío exitoso
      setRecipeForm(recipe);
      setErrors({});
      setTouched({});
      setSubmitAttempted(false);

      console.log("Recipe submitted:", recipeForm);
    } else {
      // Marcar todos los campos como "touched" para mostrar errores
      const allFields = Object.keys(validationRules);
      const newTouched = {};
      allFields.forEach((field) => (newTouched[field] = true));
      setTouched(newTouched);
    }
  };

  const handleFieldUpdate = (e) => {
    const { id, value } = e.target;

    setRecipeForm({ ...recipeForm, [id]: value });

    // Validar en tiempo real si el campo ya fue tocado o si se intentó enviar
    if (touched[id] || submitAttempted) {
      const error = validateField(id, value);
      setErrors((prev) => ({
        ...prev,
        [id]: error,
      }));
    }
  };

  const handleFieldBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    const error = validateField(fieldName, recipeForm[fieldName]);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleIngredientUpdate = (ingredient) => {
    const newIngredients = [...recipeForm.ingredients, ingredient];
    setRecipeForm({
      ...recipeForm,
      ingredients: newIngredients,
    });

    if (newIngredients.length > 0 && errors.ingredients) {
      setErrors((prev) => ({ ...prev, ingredients: null }));
    }
  };

  const handleStepsUpdate = (step) => {
    const newSteps = [...recipeForm.steps, step];
    setRecipeForm({ ...recipeForm, steps: newSteps });

    // Limpiar error de pasos si ahora hay al menos uno
    if (newSteps.length > 0 && errors.steps) {
      setErrors((prev) => ({ ...prev, steps: null }));
    }
  };

  const handleImagesUpdate = (images) => {
    setRecipeForm({ ...recipeForm, images: [...recipeForm.images, images] });
  };

  const handleDifficultyChange = (event, newValue) => {
    setRecipeForm({ ...recipeForm, difficulty: newValue });

    // Validar dificultad inmediatamente
    if (touched.difficulty || submitAttempted) {
      const error = validateField("difficulty", newValue);
      setErrors((prev) => ({ ...prev, difficulty: error }));
    }
  };

  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#ff6d75",
    },
    "& .MuiRating-iconHover": {
      color: "#ff3d47",
    },
  });

  // Verificar si hay errores generales para mostrar alerta
  const hasErrors = Object.values(errors).some((error) => error !== null);

  return (
    <>
      <section className="create-recipe">
        <h2 className="create-recipe__title">{t("title")}</h2>

        {submitAttempted && hasErrors && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {t("messages.error")}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="create-recipe__form">
          <div className="create-recipe__form-fields">
            <TextField
              id="name"
              value={recipeForm.name}
              label={t("fields.name.label")}
              placeholder={t("fields.name.placeholder")}
              variant="filled"
              className="create-recipe__name"
              fullWidth
              onChange={handleFieldUpdate}
              onBlur={() => handleFieldBlur("name")}
              sx={{ mb: 4 }}
              error={!!errors.name}
              helperText={
                errors.name ||
                t("messages.characters", {
                  current: recipeForm.name.length,
                  max: NAME_MAX_LENGTH,
                })
              }
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
              error={!!errors.description}
              helperText={
                errors.description ||
                t("messages.characters", {
                  current: recipeForm.description.length,
                  max: DESCRIPTION_MAX_LENGTH,
                })
              }
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
                label={t("fields.prepTime.label")}
                variant="filled"
                type="number"
                className="create-recipe__preptime"
                onChange={handleFieldUpdate}
                onBlur={() => handleFieldBlur("prepTime")}
                sx={{ width: "100px" }}
                error={!!errors.prepTime}
                helperText={errors.prepTime}
                slotProps={{
                  htmlInput: {
                    min: 1,
                    max: 999,
                    maxLength: NUMERIC_MAX_LENGTH,
                  },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">m</InputAdornment>
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
                label={t("fields.servings.label")}
                variant="filled"
                type="number"
                className="create-recipe__servings"
                onChange={handleFieldUpdate}
                onBlur={() => handleFieldBlur("servings")}
                sx={{ width: "100px" }}
                error={!!errors.servings}
                helperText={errors.servings}
                slotProps={{
                  htmlInput: {
                    min: 1,
                    max: 99,
                    maxLength: NUMERIC_MAX_LENGTH,
                  },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <RestaurantIcon />
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
                }}
              >
                <p className="create-recipe__difficulty-label">
                  {t("fields.difficulty.label")}{" "}
                  {errors.difficulty && (
                    <span style={{ color: "#d32f2f", fontSize: "0.75rem" }}>
                      *
                    </span>
                  )}
                </p>
                <StyledRating
                  sx={{ mt: 1 }}
                  id="difficulty"
                  className="create-recipe__difficulty"
                  value={recipeForm.difficulty}
                  getLabelText={(value) =>
                    `${value} Dining${value !== 1 ? "s" : ""}`
                  }
                  onChange={handleDifficultyChange}
                  onBlur={() => handleFieldBlur("difficulty")}
                  precision={1}
                  icon={<LocalDiningIcon fontSize="inherit" />}
                  emptyIcon={<LocalDiningOutlinedIcon fontSize="inherit" />}
                />
                {errors.difficulty && (
                  <p
                    style={{
                      color: "#d32f2f",
                      fontSize: "0.75rem",
                      margin: "3px 14px 0 14px",
                      textAlign: "center",
                    }}
                  >
                    {errors.difficulty}
                  </p>
                )}
              </Box>
            </div>

            <div className="create-recipe__ingredients-steps">
              <IngredientForm
                recipe={recipeForm}
                setRecipe={setRecipeForm}
                handleIngredientUpdate={handleIngredientUpdate}
              />
              {errors.ingredients && (
                <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
                  {errors.ingredients}
                </Alert>
              )}

              <StepsForm
                recipe={recipeForm}
                setRecipe={setRecipeForm}
                handleStepsUpdate={handleStepsUpdate}
              />
              {errors.steps && (
                <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
                  {errors.steps}
                </Alert>
              )}

              <ImagesForm
                recipe={recipeForm}
                setRecipe={setRecipeForm}
                handleImagesUpdate={handleImagesUpdate}
              />
            </div>

            <div className="submit-container">
              <Button
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                size="large"
                className="submit-container__button"
              >
                {t("buttons.save")}
              </Button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
export default CreateRecipe;
