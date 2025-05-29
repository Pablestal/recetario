import "./CreateRecipe.scss";
import { TextField, Button, Rating, Box, InputAdornment } from "@mui/material";
import LocalDiningIcon from "@mui/icons-material/LocalDiningOutlined";
import LocalDiningOutlinedIcon from "@mui/icons-material/LocalDiningOutlined";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import IngredientForm from "../components/recipeForm/IngredientsForm";
import StepsForm from "../components/recipeForm/StepsForm";
import ImagesForm from "../components/recipeForm/ImagesForm";

const NAME_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;
const NUMERIC_MAX_LENGTH = 3;

function CreateRecipe() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Recipe submitted:", recipeForm);
    setRecipeForm(recipe);
  };

  const handleFieldUpdate = (e) => {
    setRecipeForm({ ...recipeForm, [e.target.id]: e.target.value });
  };

  const handleIngredientUpdate = (ingredient) => {
    setRecipeForm({
      ...recipeForm,
      ingredients: [...recipeForm.ingredients, ingredient],
    });
  };

  const handleStepsUpdate = (step) => {
    setRecipeForm({ ...recipeForm, steps: [...recipeForm.steps, step] });
  };

  const handleImagesUpdate = (images) => {
    setRecipeForm({ ...recipeForm, images: [...recipeForm.images, images] });
  };

  const handleDifficultyChange = (event, newValue) => {
    setRecipeForm({ ...recipeForm, difficulty: newValue });
  };

  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#ff6d75",
    },
    "& .MuiRating-iconHover": {
      color: "#ff3d47",
    },
  });

  return (
    <>
      <section className="create-recipe">
        <h2 className="create-recipe__title">Create a new recipe</h2>
        <form onSubmit={handleSubmit} className="create-recipe__form">
          <div className="create-recipe__form-fields">
            <TextField
              id="name"
              value={recipeForm.name}
              label="Name"
              variant="filled"
              className="create-recipe__name"
              fullWidth
              onChange={handleFieldUpdate}
              sx={{ mb: 4 }}
              slotProps={{
                htmlInput: {
                  maxLength: NAME_MAX_LENGTH,
                },
              }}
              helperText={`${recipeForm.name.length}/${NAME_MAX_LENGTH} characters`}
            />

            <TextField
              id="description"
              value={recipeForm.description}
              label="Description"
              variant="filled"
              multiline
              rows={6}
              fullWidth
              className="create-recipe__description"
              onChange={handleFieldUpdate}
              sx={{ mb: 4 }}
              slotProps={{
                htmlInput: {
                  maxLength: DESCRIPTION_MAX_LENGTH,
                },
              }}
              helperText={`${recipeForm.description.length}/${DESCRIPTION_MAX_LENGTH} characters`}
            />

            <div className="create-recipe__numeric-inputs">
              <TextField
                id="prepTime"
                value={recipeForm.prepTime}
                label="Time"
                variant="filled"
                className="create-recipe__preptime"
                onChange={handleFieldUpdate}
                sx={{ width: "100px" }}
                slotProps={{
                  htmlInput: {
                    min: 1,
                    max: 200,
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
                label="Servings"
                variant="filled"
                className="create-recipe__servings"
                onChange={handleFieldUpdate}
                sx={{ width: "100px" }}
                slotProps={{
                  htmlInput: {
                    min: 1,
                    max: 999,
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
                <p className="create-recipe__difficulty-label">Difficulty</p>
                <StyledRating
                  sx={{ mt: 1 }}
                  id="difficulty"
                  className="create-recipe__difficulty"
                  value={recipeForm.difficulty}
                  getLabelText={(value) =>
                    `${value} Dining${value !== 1 ? "s" : ""}`
                  }
                  onChange={handleDifficultyChange}
                  precision={1}
                  icon={<LocalDiningIcon fontSize="inherit" />}
                  emptyIcon={<LocalDiningOutlinedIcon fontSize="inherit" />}
                />
              </Box>
            </div>

            <div className="create-recipe__ingredients-steps">
              <IngredientForm
                recipe={recipeForm}
                setRecipe={setRecipeForm}
                handleIngredientUpdate={handleIngredientUpdate}
              />
              <StepsForm
                recipe={recipeForm}
                setRecipe={setRecipeForm}
                handleStepsUpdate={handleStepsUpdate}
              />
            </div>

            <ImagesForm
              recipe={recipeForm}
              setRecipe={setRecipeForm}
              handleImagesUpdate={handleImagesUpdate}
            />

            <div className="submit-container">
              <Button
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                size="large"
                className="submit-container__button"
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
export default CreateRecipe;
