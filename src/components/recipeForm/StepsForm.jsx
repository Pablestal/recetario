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

const StepsForm = (props) => {
  const { recipe, setRecipe, handleStepsUpdate } = props;
  const { t } = useTranslation("createRecipe");

  const stepTemplate = {
    description: "",
    tip: "",
    imageUrl: "",
  };

  const [newStep, setNewStep] = useState(stepTemplate);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleNewStepUpdate = (e) => {
    const { id, value } = e.target;
    setNewStep({ ...newStep, [id]: value });
  };

  const handleAddStep = () => {
    if (newStep.description.trim()) {
      const stepWithOrder = {
        ...newStep,
        order: recipe.steps.length + 1
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

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, hoverIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === hoverIndex) {
      return;
    }

    // Reorder in real-time while dragging
    const newSteps = [...recipe.steps];
    const draggedItem = newSteps[draggedIndex];

    // Remove dragged item
    newSteps.splice(draggedIndex, 1);
    // Insert at new position
    newSteps.splice(hoverIndex, 0, draggedItem);

    // Update order numbers
    const updatedSteps = newSteps.map((step, i) => ({ ...step, order: i + 1 }));

    setRecipe({ ...recipe, steps: updatedSteps });
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
    const listItem = elements.find(el => el.classList.contains('steps-form__list-item'));

    if (listItem) {
      const allItems = Array.from(document.querySelectorAll('.steps-form__list-item'));
      const hoverIndex = allItems.indexOf(listItem);

      if (hoverIndex !== -1 && hoverIndex !== draggedIndex) {
        const newSteps = [...recipe.steps];
        const draggedItem = newSteps[draggedIndex];

        newSteps.splice(draggedIndex, 1);
        newSteps.splice(hoverIndex, 0, draggedItem);

        const updatedSteps = newSteps.map((step, i) => ({ ...step, order: i + 1 }));

        setRecipe({ ...recipe, steps: updatedSteps });
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
    <div className="steps-form">
      <p className="steps-form__subtitle">
        {t("steps.subtitle")}
      </p>

      <div className="steps-form__inputs">
        <div className="steps-form__input-group">
          <TextField
            id="description"
            value={newStep.description}
            size="small"
            fullWidth
            label={t("steps.fields.description.label")}
            placeholder={t("steps.fields.description.placeholder")}
            variant="outlined"
            onChange={handleNewStepUpdate}
          />

          <TextField
            id="tip"
            value={newStep.tip}
            size="small"
            fullWidth
            label={t("steps.fields.tip.label")}
            placeholder={t("steps.fields.tip.placeholder")}
            variant="outlined"
            onChange={handleNewStepUpdate}
            slotProps={{
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
            placeholder={t("steps.fields.imageUrl.placeholder")}
            variant="outlined"
            onChange={handleNewStepUpdate}
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
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground' }
          }}
        >
          <AddIcon />
        </IconButton>
      </div>

      <ul className="steps-form__list">
        {recipe.steps.map((step, index) => (
          <li
            key={index}
            className={`steps-form__list-item ${draggedIndex === index ? 'dragging' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="steps-form__step-number">{index + 1}</div>

            <div className="steps-form__item-header">
              <div className="steps-form__drag-handle">
                <DragIndicatorIcon sx={{ color: '#9e9e9e', cursor: 'grab' }} />
              </div>

              {step.imageUrl && (
                <div className="steps-form__step-image">
                  <img
                    src={step.imageUrl}
                    alt={`Paso ${index + 1}`}
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
                  size="small"
                  fullWidth
                  label={t("steps.fields.description.label")}
                  variant="outlined"
                  onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                />

                <TextField
                  value={step.tip || ""}
                  size="small"
                  fullWidth
                  label={t("steps.fields.tip.label")}
                  variant="outlined"
                  onChange={(e) => handleStepChange(index, 'tip', e.target.value)}
                  slotProps={{
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
                  onChange={(e) => handleStepChange(index, 'imageUrl', e.target.value)}
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
                onClick={() => handleDeleteStep(index)}
                title={t("steps.list.delete")}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StepsForm;
