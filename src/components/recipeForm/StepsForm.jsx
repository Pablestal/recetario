import "./StepsForm.scss";
import { IconButton, TextField, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import LightbulbOutlineIcon from "@mui/icons-material/LightbulbOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ImageIcon from "@mui/icons-material/Image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import fallbackImage from "../../assets/image-fallback.jpg";
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

const DESCRIPTION_MAX_LENGTH = 600;
const TIP_MAX_LENGTH = 200;

// Helper function to validate URL format
const isValidUrl = (url) => {
  if (!url || url.trim() === "") return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Sortable component for each step
const SortableStep = ({ step, index, onDelete, onChange, t }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`steps-form__list-item ${isDragging ? "dragging" : ""}`}
    >
      <div className="steps-form__step-number">{index + 1}</div>

      <div className="steps-form__item-header">
        <div className="steps-form__drag-handle" {...attributes} {...listeners}>
          <DragIndicatorIcon sx={{ color: "#9e9e9e", cursor: "grab" }} />
        </div>

        {step.imageUrl && (
          <div className="steps-form__step-image">
            <img
              src={step.imageUrl}
              alt={`Step ${index + 1}`}
              onError={(e) => {
                e.target.src = fallbackImage;
                e.target.alt = "Image not found";
              }}
            />
          </div>
        )}
      </div>

      <div className="steps-form__item-content">
        <div className="steps-form__item-fields">
          <TextField
            value={step.description}
            fullWidth
            size="small"
            multiline
            minRows={1}
            label={t("steps.fields.description.label")}
            variant="outlined"
            onChange={(e) => onChange(index, "description", e.target.value)}
            slotProps={{
              htmlInput: {
                maxLength: DESCRIPTION_MAX_LENGTH,
              },
            }}
          />

          <TextField
            value={step.tip || ""}
            fullWidth
            multiline
            size="small"
            minRows={1}
            label={t("steps.fields.tip.label")}
            variant="outlined"
            onChange={(e) => onChange(index, "tip", e.target.value)}
            slotProps={{
              htmlInput: {
                maxLength: TIP_MAX_LENGTH,
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LightbulbOutlineIcon color="warning" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            value={step.imageUrl || ""}
            size="small"
            fullWidth
            label={t("steps.fields.imageUrl.label")}
            variant="outlined"
            onChange={(e) => onChange(index, "imageUrl", e.target.value)}
            error={!isValidUrl(step.imageUrl)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <ImageIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
      </div>

      <div className="steps-form__item-actions">
        <IconButton
          aria-label={t("steps.list.delete")}
          sx={{ color: "#ed5858" }}
          onClick={() => onDelete(index)}
          title={t("steps.list.delete")}
        >
          <RemoveCircleOutlineIcon />
        </IconButton>
      </div>
    </li>
  );
};

const StepsForm = (props) => {
  const { recipe, setRecipe, handleStepsUpdate } = props;
  const { t } = useTranslation("createRecipe");

  const stepTemplate = {
    description: "",
    tip: "",
    imageUrl: "",
  };

  const [newStep, setNewStep] = useState(stepTemplate);

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

  const handleNewStepUpdate = (e) => {
    const { id, value } = e.target;
    setNewStep({ ...newStep, [id]: value });
  };

  const handleAddStep = () => {
    if (newStep.description.trim()) {
      const stepWithOrder = {
        ...newStep,
        id: `step-${Date.now()}`, // Add unique id for dnd-kit
        order: recipe.steps.length + 1,
      };
      handleStepsUpdate(stepWithOrder);
      setNewStep(stepTemplate);
    }
  };

  const handleDeleteStep = (index) => {
    const newSteps = recipe.steps
      .filter((step, i) => i !== index)
      .map((step, i) => ({ ...step, order: i + 1 }));
    setRecipe({ ...recipe, steps: newSteps });
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...recipe.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setRecipe({ ...recipe, steps: newSteps });
  };

  // Handler for when drag ends (dnd-kit)
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = recipe.steps.findIndex((step) => step.id === active.id);
    const newIndex = recipe.steps.findIndex((step) => step.id === over.id);

    const newSteps = arrayMove(recipe.steps, oldIndex, newIndex).map(
      (step, i) => ({
        ...step,
        order: i + 1,
      })
    );

    setRecipe({ ...recipe, steps: newSteps });
  };

  return (
    <div className="steps-form">
      <p className="steps-form__subtitle">{t("steps.subtitle")}</p>

      <div className="steps-form__inputs">
        <div className="steps-form__input-group">
          <TextField
            id="description"
            value={newStep.description}
            size="small"
            fullWidth
            label={t("steps.fields.description.label")}
            variant="outlined"
            onChange={handleNewStepUpdate}
            slotProps={{
              htmlInput: {
                maxLength: DESCRIPTION_MAX_LENGTH,
              },
            }}
          />

          <TextField
            id="tip"
            value={newStep.tip}
            size="small"
            fullWidth
            label={t("steps.fields.tip.label")}
            variant="outlined"
            onChange={handleNewStepUpdate}
            slotProps={{
              htmlInput: {
                maxLength: TIP_MAX_LENGTH,
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LightbulbOutlineIcon color="warning" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            id="imageUrl"
            value={newStep.imageUrl}
            size="small"
            fullWidth
            label={t("steps.fields.imageUrl.label")}
            variant="outlined"
            onChange={handleNewStepUpdate}
            error={!isValidUrl(newStep.imageUrl)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <ImageIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <IconButton
          aria-label={t("steps.buttons.add")}
          color="primary"
          onClick={handleAddStep}
          disabled={!newStep.description.trim()}
          className="steps-form__add-button"
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={recipe.steps.map((step) => step.id || `step-${step.order}`)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="steps-form__list">
            {recipe.steps.map((step, index) => (
              <SortableStep
                key={step.id || `step-${index}`}
                step={{
                  ...step,
                  id: step.id || `step-${index}`,
                }}
                index={index}
                onDelete={handleDeleteStep}
                onChange={handleStepChange}
                t={t}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default StepsForm;
