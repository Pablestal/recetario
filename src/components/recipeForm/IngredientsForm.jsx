import "./IngredientsForm.scss";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const IngredientForm = (props) => {
  const { recipe, setRecipe, handleIngredientUpdate } = props;
  const { t } = useTranslation("createRecipe");

  const ingredientTemplate = {
    name: "",
    quantity: "",
    unit: "",
    optional: false,
  };

  const [newIngredient, setNewIngredient] = useState(ingredientTemplate);
  const [draggedIndex, setDraggedIndex] = useState(null);

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
    if (newIngredient.name.trim()) {
      const ingredientWithOrder = {
        ...newIngredient,
        order: recipe.ingredients.length + 1
      };
      handleIngredientUpdate(ingredientWithOrder);
      setNewIngredient(ingredientTemplate);
    }
  };

  const handleDeleteIngredient = (index) => {
    const newIngredients = recipe.ingredients
      .filter((ing, i) => i !== index)
      .map((ing, i) => ({ ...ing, order: i + 1 }));
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, hoverIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === hoverIndex) {
      return;
    }

    // Reorder in real-time while dragging
    const newIngredients = [...recipe.ingredients];
    const draggedItem = newIngredients[draggedIndex];

    // Remove dragged item
    newIngredients.splice(draggedIndex, 1);
    // Insert at new position
    newIngredients.splice(hoverIndex, 0, draggedItem);

    // Update order numbers
    const updatedIngredients = newIngredients.map((ing, i) => ({ ...ing, order: i + 1 }));

    setRecipe({ ...recipe, ingredients: updatedIngredients });
    setDraggedIndex(hoverIndex);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Touch events for mobile support
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchCurrentY, setTouchCurrentY] = useState(null);

  const handleTouchStart = (e, index) => {
    setDraggedIndex(index);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (draggedIndex === null) return;

    e.preventDefault();
    setTouchCurrentY(e.touches[0].clientY);

    // Find element under touch point
    const touchY = e.touches[0].clientY;
    const elements = document.elementsFromPoint(e.touches[0].clientX, touchY);
    const listItem = elements.find(el => el.classList.contains('ingredients-form__list-item'));

    if (listItem) {
      const allItems = Array.from(document.querySelectorAll('.ingredients-form__list-item'));
      const hoverIndex = allItems.indexOf(listItem);

      if (hoverIndex !== -1 && hoverIndex !== draggedIndex) {
        const newIngredients = [...recipe.ingredients];
        const draggedItem = newIngredients[draggedIndex];

        newIngredients.splice(draggedIndex, 1);
        newIngredients.splice(hoverIndex, 0, draggedItem);

        const updatedIngredients = newIngredients.map((ing, i) => ({ ...ing, order: i + 1 }));

        setRecipe({ ...recipe, ingredients: updatedIngredients });
        setDraggedIndex(hoverIndex);
      }
    }
  };

  const handleTouchEnd = () => {
    setDraggedIndex(null);
    setTouchStartY(null);
    setTouchCurrentY(null);
  };

  return (
    <div className="ingredients-form">
      <p className="ingredients-form__subtitle">
        {t("ingredients.subtitle")}
      </p>

      <div className="ingredients-form__inputs">
        <div className="ingredients-form__input-group">
          <TextField
            id="name"
            value={newIngredient.name}
            size="small"
            label={t("ingredients.fields.name.label")}
            placeholder={t("ingredients.fields.name.placeholder")}
            variant="outlined"
            onChange={handleNewIngredientUpdate}
            sx={{ flexGrow: 1 }}
          />

          <TextField
            id="quantity"
            value={newIngredient.quantity}
            size="small"
            label={t("ingredients.fields.quantity.label")}
            placeholder={t("ingredients.fields.quantity.placeholder")}
            variant="outlined"
            onChange={handleNewIngredientUpdate}
            sx={{ width: "120px" }}
          />

          <TextField
            id="unit"
            value={newIngredient.unit}
            size="small"
            label={t("ingredients.fields.unit.label")}
            placeholder={t("ingredients.fields.unit.placeholder")}
            variant="outlined"
            onChange={handleNewIngredientUpdate}
            sx={{ width: "150px" }}
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

          <IconButton
            aria-label={t("ingredients.buttons.add")}
            color="primary"
            onClick={handleAddIngredient}
            disabled={!newIngredient.name.trim()}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': { bgcolor: 'action.disabledBackground' }
            }}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>

      <ul className="ingredients-form__list">
        {recipe.ingredients.map((ingredient, index) => (
          <li
            key={index}
            className={`ingredients-form__list-item ${draggedIndex === index ? 'dragging' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <>
              <div className="ingredients-form__drag-handle">
                <DragIndicatorIcon sx={{ color: '#9e9e9e', cursor: 'grab' }} />
              </div>

              <div className="ingredients-form__item-fields">
              <TextField
                value={ingredient.name}
                size="small"
                label={t("ingredients.fields.name.label")}
                variant="outlined"
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                sx={{ flexGrow: 1 }}
              />

              <TextField
                value={ingredient.quantity}
                size="small"
                label={t("ingredients.fields.quantity.label")}
                variant="outlined"
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                sx={{ width: "120px" }}
              />

              <TextField
                value={ingredient.unit}
                size="small"
                label={t("ingredients.fields.unit.label")}
                variant="outlined"
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                sx={{ width: "150px" }}
              />

              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>{t("ingredients.fields.optional.label")}</InputLabel>
                <Select
                  value={ingredient.optional}
                  size="small"
                  label={t("ingredients.fields.optional.label")}
                  onChange={(e) => handleIngredientChange(index, 'optional', e.target.value)}
                >
                  <MenuItem value={false}>
                    {t("ingredients.fields.optional.no")}
                  </MenuItem>
                  <MenuItem value={true}>
                    {t("ingredients.fields.optional.yes")}
                  </MenuItem>
                </Select>
              </FormControl>

              <IconButton
                aria-label={t("ingredients.list.delete")}
                sx={{ color: "#ed5858" }}
                onClick={() => handleDeleteIngredient(index)}
                title={t("ingredients.list.delete")}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </div>
            </>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientForm;
