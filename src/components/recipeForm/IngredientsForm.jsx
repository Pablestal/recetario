import "./IngredientsForm.scss";
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable component for each ingredient
const SortableIngredient = ({ ingredient, index, onDelete, onChange, t }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ingredient.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`ingredients-form__list-item ${isDragging ? "dragging" : ""}`}
    >
      <div
        className="ingredients-form__drag-handle"
        {...attributes}
        {...listeners}
      >
        <DragIndicatorIcon sx={{ color: "#9e9e9e", cursor: "grab" }} />
      </div>

      <div className="ingredients-form__item-fields">
        <TextField
          value={ingredient.name || ""}
          size="small"
          label={t("ingredients.fields.name.label")}
          variant="outlined"
          onChange={(e) => onChange(index, "name", e.target.value)}
          slotProps={{ htmlInput: { maxLength: 50 } }}
          sx={{ flexGrow: 1 }}
        />

        <TextField
          value={ingredient.quantity || ""}
          size="small"
          label={t("ingredients.fields.quantity.label")}
          variant="outlined"
          onChange={(e) => onChange(index, "quantity", e.target.value)}
          slotProps={{ htmlInput: { maxLength: 10 } }}
          sx={{ width: "120px" }}
        />

        <TextField
          value={ingredient.unit || ""}
          size="small"
          label={t("ingredients.fields.unit.label")}
          variant="outlined"
          onChange={(e) => onChange(index, "unit", e.target.value)}
          slotProps={{ htmlInput: { maxLength: 15 } }}
          sx={{ width: "150px" }}
        />

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>{t("ingredients.fields.optional.label")}</InputLabel>
          <Select
            value={ingredient.optional}
            size="small"
            label={t("ingredients.fields.optional.label")}
            onChange={(e) => onChange(index, "optional", e.target.value)}
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
          onClick={() => onDelete(index)}
          title={t("ingredients.list.delete")}
        >
          <RemoveCircleOutlineIcon />
        </IconButton>
      </div>
    </li>
  );
};

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

  // Configure sensors for dnd-kit (includes touch support)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
        id: `ingredient-${Date.now()}`, // Add unique id for dnd-kit
        order: recipe.ingredients.length + 1,
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

  // Handler for when drag ends (dnd-kit)
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = recipe.ingredients.findIndex(
      (ing) => ing.id === active.id
    );
    const newIndex = recipe.ingredients.findIndex((ing) => ing.id === over.id);

    const newIngredients = arrayMove(
      recipe.ingredients,
      oldIndex,
      newIndex
    ).map((ing, i) => ({ ...ing, order: i + 1 }));

    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  return (
    <div className="ingredients-form">
      <p className="ingredients-form__subtitle">{t("ingredients.subtitle")}</p>

      <div className="ingredients-form__inputs">
        <div className="ingredients-form__input-group">
          <TextField
            id="name"
            value={newIngredient.name}
            size="small"
            label={t("ingredients.fields.name.label")}
            variant="outlined"
            onChange={handleNewIngredientUpdate}
            slotProps={{ htmlInput: { maxLength: 50 } }}
            sx={{ flexGrow: 1 }}
          />

          <TextField
            id="quantity"
            value={newIngredient.quantity}
            size="small"
            label={t("ingredients.fields.quantity.label")}
            variant="outlined"
            onChange={handleNewIngredientUpdate}
            slotProps={{ htmlInput: { maxLength: 10 } }}
            sx={{ width: "120px" }}
          />

          <TextField
            id="unit"
            value={newIngredient.unit}
            size="small"
            label={t("ingredients.fields.unit.label")}
            variant="outlined"
            onChange={handleNewIngredientUpdate}
            slotProps={{ htmlInput: { maxLength: 15 } }}
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
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
              "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
            }}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={recipe.ingredients.map(
            (ing) => ing.id || `ingredient-${ing.order}`
          )}
          strategy={verticalListSortingStrategy}
        >
          <ul className="ingredients-form__list">
            {recipe.ingredients.map((ingredient, index) => (
              <SortableIngredient
                key={ingredient.id || `ingredient-${index}`}
                ingredient={{
                  ...ingredient,
                  id: ingredient.id || `ingredient-${index}`,
                }}
                index={index}
                onDelete={handleDeleteIngredient}
                onChange={handleIngredientChange}
                t={t}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default IngredientForm;
