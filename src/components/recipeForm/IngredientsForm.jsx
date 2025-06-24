import "./ingredientsForm.scss";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const IngredientForm = (props) => {
  const { recipe, setRecipe, handleIngredientUpdate } = props;
  const { t } = useTranslation("createRecipe");

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

  const handleAddIngredient = () => {
    if (newIngredient.name.trim() && newIngredient.amount.trim()) {
      handleIngredientUpdate(newIngredient);
      setNewIngredient(ingredientTemplate);
    }
  };

  const handleDeleteIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((ing, i) => i !== index);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  return (
    <div className="ingredients-form">
      <div className="ingredients-form__header">
        <h2 className="ingredients-form__title">{t("ingredients.title")}</h2>
        <p className="ingredients-form__subtitle">
          {t("ingredients.subtitle")}
        </p>
      </div>

      <div className="ingredients-form__inputs">
        <div className="ingredients-form__input-group">
          <TextField
            id="name"
            value={newIngredient.name}
            size="small"
            label={t("ingredients.fields.name.label")}
            placeholder={t("ingredients.fields.name.placeholder")}
            variant="filled"
            onChange={handleNewIngredientUpdate}
            sx={{ flexGrow: 1 }}
          />

          <TextField
            id="amount"
            value={newIngredient.amount}
            size="small"
            label={t("ingredients.fields.amount.label")}
            placeholder={t("ingredients.fields.amount.placeholder")}
            variant="filled"
            onChange={handleNewIngredientUpdate}
            className="ingredients-form__amount-input"
          />

          <FormControl id="optional" size="small" sx={{ minWidth: 100 }}>
            <InputLabel>{t("ingredients.fields.optional.label")}</InputLabel>
            <Select
              id="optional"
              size="small"
              value={newIngredient.optional}
              label={t("ingredients.fields.optional.label")}
              onChange={handleOptionalChange}
            >
              <MenuItem value={false}>
                {t("ingredients.fields.optional.no")}
              </MenuItem>
              <MenuItem value={true}>
                {t("ingredients.fields.optional.yes")}
              </MenuItem>
            </Select>
          </FormControl>
        </div>

        <Button
          variant="contained"
          color="secondary"
          className="ingredients-form__add-button"
          onClick={handleAddIngredient}
          startIcon={<AddIcon />}
          disabled={!newIngredient.name.trim() || !newIngredient.amount.trim()}
        >
          {t("ingredients.buttons.add")}
        </Button>
      </div>

      <ul className="ingredients-form__list">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="ingredients-form__list-item">
            <IconButton
              aria-label={t("ingredients.list.delete")}
              sx={{ color: "#ed5858" }}
              onClick={() => handleDeleteIngredient(index)}
              title={t("ingredients.list.delete")}
            >
              <RemoveCircleOutlineIcon fontSize="small" />
            </IconButton>

            <span>
              {index + 1}. <strong>{ingredient.name}</strong> -{" "}
              {ingredient.amount}
              {ingredient.optional ? ` ${t("ingredients.list.optional")}` : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientForm;
