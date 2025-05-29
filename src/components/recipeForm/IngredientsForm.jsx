import "./ingredientsForm.scss";
import {
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useState } from "react";

function IngredientForm(props) {
  const { recipe, setRecipe, handleIngredientUpdate } = props;
  const ingredientTemplate = {
    name: "",
    amount: "",
    optional: false,
  };

  const [newIngredient, setNewIngredient] = useState(ingredientTemplate);

  const handleNewIngredientUpdate = (e) => {
    const { id, value } = e.target;
    setNewIngredient({
      ...newIngredient,
      [id]: value,
    });
  };

  const handleOptionalChange = (e) => {
    setNewIngredient({
      ...newIngredient,
      optional: e.target.value,
    });
  };

  return (
    <div className="ingredients-form">
      <div className="ingredients-form__header">
        <h2 className="ingredients-form__title">Ingredients</h2>
        <p className="ingredients-form__subtitle">
          Add ingredients with their amount. Optional ingredients can be marked.
        </p>
      </div>
      <div className="ingredients-form__inputs">
        <Button
          variant="contained"
          color="secondary"
          className="ingredients-form__add-button"
          onClick={() => {
            handleIngredientUpdate(newIngredient);
            setNewIngredient(ingredientTemplate);
          }}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
        <div className="ingredients-form__input-group">
          <TextField
            id="name"
            value={newIngredient.name}
            size="small"
            label="Ingredient Name"
            variant="filled"
            onChange={handleNewIngredientUpdate}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            id="amount"
            value={newIngredient.amount}
            size="small"
            label="Amount"
            variant="filled"
            onChange={handleNewIngredientUpdate}
          />
          <FormControl id="optional" size="small" sx={{ minWidth: 80 }}>
            <InputLabel>Optional</InputLabel>
            <Select
              id="optional"
              size="small"
              defaultValue={true}
              value={newIngredient.optional}
              label="Optional"
              onChange={handleOptionalChange}
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <ul className="ingredients-form__list">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="ingredients-form__list-item">
            <IconButton
              aria-label="delete"
              sx={{ color: "#ed5858" }}
              onClick={() => {
                const newIngredients = recipe.ingredients.filter(
                  (ing, i) => i !== index
                );
                setRecipe({ ...recipe, ingredients: newIngredients });
              }}
            >
              <RemoveCircleOutlineIcon fontSize="small" />
            </IconButton>
            <span>
              {index + 1}. <strong>{ingredient.name}</strong> -{" "}
              {ingredient.amount}
              {ingredient.optional ? " (Optional)" : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IngredientForm;
