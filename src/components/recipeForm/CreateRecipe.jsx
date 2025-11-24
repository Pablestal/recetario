import "./CreateRecipe.scss";
import {
  Button,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Box,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useState, useCallback, useMemo, useReducer } from "react";
import RecipeInfoForm from "./InfoForm";
import ImagesForm from "./ImagesForm";
import IngredientForm from "./IngredientsForm";
import StepsForm from "./StepsForm";
import { useTranslation } from "react-i18next";
import { useRecipeStore } from "../../stores/useRecipeStore";
import { useAuthStore } from "../../stores/useAuthStore";

const NAME_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

const INITIAL_RECIPE = {
  name: "",
  description: "",
  prepTime: "",
  servings: "",
  difficulty: -1,
  calories: "",
  ingredients: [],
  steps: [],
  tags: [],
  isPublic: true,
  mainImageURL: "",
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "UPDATE_TAGS":
      return { ...state, tags: action.tags };
    case "ADD_INGREDIENT":
      return {
        ...state,
        ingredients: [...state.ingredients, action.ingredient],
      };
    case "ADD_STEP":
      return { ...state, steps: [...state.steps, action.step] };
    case "UPDATE_STATE":
      return { ...state, ...action.payload };
    case "RESET":
      return INITIAL_RECIPE;
    default:
      return state;
  }
};

const CreateRecipe = () => {
  const { t } = useTranslation("createRecipe");
  const { addRecipe, loading } = useRecipeStore();
  const { user } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);
  const [recipeForm, dispatch] = useReducer(formReducer, INITIAL_RECIPE);

  const steps = useMemo(
    () => [
      t("stepper.basicInfo"),
      t("stepper.ingredients"),
      t("stepper.steps"),
    ],
    [t]
  );

  const isValidImageUrl = useCallback((url) => {
    if (!url || url.trim() === "") return true; // Empty is valid (optional field)

    // Check if it's a valid URL format
    try {
      new URL(url);
    } catch {
      return false;
    }

    // Check if URL ends with common image extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
    return imageExtensions.test(url);
  }, []);

  const validationRules = useMemo(
    () => ({
      name: (value) => {
        if (!value || value.trim().length === 0)
          return t("validation.name.required");
        if (value.trim().length < 1) return t("validation.name.minLength");
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
        if (!value || value === "") return t("validation.prepTime.required");
        const numValue = parseInt(value);
        if (isNaN(numValue)) return t("validation.prepTime.invalid");
        if (numValue < 1) return t("validation.prepTime.min");
        if (numValue > 999) return t("validation.prepTime.max");
        return null;
      },

      servings: (value) => {
        if (!value || value === "") return t("validation.servings.required");
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

      calories: (value) => {
        if (!value || value === "") return null; // Optional field
        const numValue = parseInt(value);
        if (isNaN(numValue)) return t("validation.calories.invalid");
        if (numValue < 1) return t("validation.calories.min");
        if (numValue > 9999) return t("validation.calories.max");
        return null;
      },

      mainImageURL: (value) => {
        if (!value || value.trim() === "") return null; // Optional field
        if (!isValidImageUrl(value))
          return t("validation.mainImageURL.invalid");
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
    }),
    [t, isValidImageUrl]
  );

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateField = useCallback(
    (fieldName, value) => {
      if (validationRules[fieldName]) {
        return validationRules[fieldName](value);
      }
      return null;
    },
    [validationRules]
  );

  const validateStep = useCallback(
    (step) => {
      const stepErrors = {};

      switch (step) {
        case 0: {
          // Basic info and images
          [
            "name",
            "description",
            "prepTime",
            "servings",
            "difficulty",
            "calories",
            "mainImageURL",
          ].forEach((field) => {
            const error = validateField(field, recipeForm[field]);
            if (error) stepErrors[field] = error;
          });
          break;
        }
        case 1: {
          // Ingredients
          const ingredientsError = validationRules.ingredients(
            recipeForm.ingredients
          );
          if (ingredientsError) stepErrors.ingredients = ingredientsError;
          break;
        }
        case 2: {
          // Steps
          const stepsError = validationRules.steps(recipeForm.steps);
          if (stepsError) stepErrors.steps = stepsError;
          break;
        }
        default:
          break;
      }

      return stepErrors;
    },
    [validateField, validationRules, recipeForm]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

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
  }, [validationRules, validateField, recipeForm]);

  const handleNext = useCallback(() => {
    const stepErrors = validateStep(activeStep);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      // Mark fields as touched so errors display
      const newTouched = {};
      Object.keys(stepErrors).forEach((field) => (newTouched[field] = true));
      setTouched((prev) => ({ ...prev, ...newTouched }));
    }
  }, [validateStep, activeStep]);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitAttempted(true);

      if (!user?.id) {
        console.error("No user authenticated");
        return;
      }

      if (validateForm()) {
        try {
          const recipeToSubmit = {
            ...recipeForm,
            user_id: user.id,
            createdDate: new Date().toISOString(),
          };

          await addRecipe(recipeToSubmit);
          setSubmitSuccess(true);

          dispatch({ type: "RESET" });
          setErrors({});
          setTouched({});
          setSubmitAttempted(false);
          setActiveStep(0);
          setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error) {
          console.error("Error submitting recipe:", error);
        }
      } else {
        console.error("Validation errors:", errors);
      }
    },
    [validateForm, recipeForm, addRecipe, errors, user]
  );

  const handleFieldUpdate = useCallback(
    (e) => {
      const { id, value } = e.target;

      dispatch({ type: "UPDATE_FIELD", field: id, value });

      // Only clear error if it exists and field is now valid
      if (errors[id]) {
        const error = validateField(id, value);
        if (!error) {
          setErrors((prev) => ({
            ...prev,
            [id]: null,
          }));
        }
      }
    },
    [errors, validateField]
  );

  const handleFieldBlur = useCallback((fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    // Don't validate on blur, just mark as touched
  }, []);

  const handleTagsUpdate = useCallback(
    (tags) => {
      dispatch({ type: "UPDATE_TAGS", tags });

      if (tags.length > 0 && errors.tags) {
        setErrors((prev) => ({ ...prev, tags: null }));
      }
    },
    [errors.tags]
  );

  const setRecipeForm = useCallback(
    (updater) => {
      if (typeof updater === "function") {
        const newState = updater(recipeForm);
        dispatch({ type: "UPDATE_STATE", payload: newState });
      } else {
        dispatch({ type: "UPDATE_STATE", payload: updater });
      }
    },
    [recipeForm]
  );

  const handleIngredientUpdate = useCallback((ingredient) => {
    dispatch({ type: "ADD_INGREDIENT", ingredient });

    setErrors((prev) => {
      if (prev.ingredients) {
        return { ...prev, ingredients: null };
      }
      return prev;
    });
  }, []);

  const handleStepsUpdate = useCallback((step) => {
    dispatch({ type: "ADD_STEP", step });

    setErrors((prev) => {
      if (prev.steps) {
        return { ...prev, steps: null };
      }
      return prev;
    });
  }, []);


  const handleDifficultyChange = useCallback(
    (_event, newValue) => {
      dispatch({ type: "UPDATE_FIELD", field: "difficulty", value: newValue });

      // Only clear error if it exists and value is now valid
      if (errors.difficulty) {
        const error = validateField("difficulty", newValue);
        if (!error) {
          setErrors((prev) => ({ ...prev, difficulty: null }));
        }
      }
    },
    [errors.difficulty, validateField]
  );

  const handlePublicChange = useCallback((event) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "isPublic",
      value: event.target.checked,
    });
  }, []);

  const isStepValid = useCallback(
    (step) => {
      const stepErrors = validateStep(step);
      return Object.keys(stepErrors).length === 0;
    },
    [validateStep]
  );

  const getStepContent = (step, touched) => {
    switch (step) {
      case 0:
        return (
          <>
            <RecipeInfoForm
              recipeForm={recipeForm}
              errors={errors}
              touched={touched}
              handleFieldUpdate={handleFieldUpdate}
              handleFieldBlur={handleFieldBlur}
              handleDifficultyChange={handleDifficultyChange}
              handleTagsUpdate={handleTagsUpdate}
              submitAttempted={submitAttempted}
            />
            <ImagesForm
              recipe={recipeForm}
              setRecipe={setRecipeForm}
              errors={errors}
              touched={touched}
              handleFieldBlur={handleFieldBlur}
              validateField={validateField}
              setErrors={setErrors}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 3,
              }}
            >
              <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                * {t("messages.requiredFields")}
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={recipeForm.isPublic}
                    onChange={handlePublicChange}
                    color="primary"
                  />
                }
                label={t("fields.isPublic.label")}
              />
            </Box>
          </>
        );
      case 1:
        return (
          <>
            <IngredientForm
              recipe={recipeForm}
              setRecipe={setRecipeForm}
              handleIngredientUpdate={handleIngredientUpdate}
            />
            {errors.ingredients && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.ingredients}
              </Alert>
            )}
          </>
        );
      case 2:
        return (
          <>
            <StepsForm
              recipe={recipeForm}
              setRecipe={setRecipeForm}
              handleStepsUpdate={handleStepsUpdate}
            />
            {errors.steps && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.steps}
              </Alert>
            )}
          </>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <section className="create-recipe">
      <h2 className="create-recipe__title">{t("title")}</h2>

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {t("messages.success")}
        </Alert>
      )}

      {submitAttempted && Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t("messages.error")}
        </Alert>
      )}

      <Box sx={{ width: "100%", mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <form onSubmit={handleSubmit} className="create-recipe__form">
        <div className="create-recipe__form-fields">
          {getStepContent(activeStep, touched)}

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 4,
            }}
          >
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              {t("stepper.back")}
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !isStepValid(activeStep)}
              >
                {t("buttons.save")}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid(activeStep)}
              >
                {t("stepper.next")}
              </Button>
            )}
          </Box>
        </div>
      </form>
    </section>
  );
};

export default CreateRecipe;
