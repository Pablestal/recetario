import "./StepsForm.scss";
import { Button, IconButton, TextField, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import LightbulbOutlineIcon from "@mui/icons-material/LightbulbOutline";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function StepsForm(props) {
  const { recipe, setRecipe, handleStepsUpdate } = props;
  const { t } = useTranslation("createRecipe");

  const stepTemplate = {
    description: "",
    tip: "",
  };

  const [newStep, setNewStep] = useState(stepTemplate);

  const handleNewStepUpdate = (e) => {
    const { id, value } = e.target;
    setNewStep({ ...newStep, [id]: value });
  };

  const handleAddStep = () => {
    if (newStep.description.trim()) {
      handleStepsUpdate(newStep);
      setNewStep(stepTemplate);
    }
  };

  const handleDeleteStep = (index) => {
    const newSteps = recipe.steps.filter((step, i) => i !== index);
    setRecipe({ ...recipe, steps: newSteps });
  };

  return (
    <div className="steps-form">
      <div className="steps-form__header">
        <h2 className="steps-form__title">{t("steps.title")}</h2>
        <p className="steps-form__subtitle">{t("steps.subtitle")}</p>
      </div>

      <div className="steps-form__inputs">
        <div className="steps-form__input-group">
          <TextField
            id="description"
            value={newStep.description}
            size="small"
            fullWidth
            label={t("steps.fields.description.label")}
            placeholder={t("steps.fields.description.placeholder")}
            variant="filled"
            onChange={handleNewStepUpdate}
          />

          <TextField
            id="tip"
            value={newStep.tip}
            size="small"
            fullWidth
            label={t("steps.fields.tip.label")}
            placeholder={t("steps.fields.tip.placeholder")}
            variant="filled"
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
        </div>

        <Button
          className="steps-form__add-button"
          variant="contained"
          color="secondary"
          onClick={handleAddStep}
          startIcon={<AddIcon />}
          disabled={!newStep.description.trim()}
        >
          {t("steps.buttons.add")}
        </Button>
      </div>

      <ul className="steps-form__list">
        {recipe.steps.map((step, index) => (
          <li key={index} className="steps-form__list-item">
            <IconButton
              aria-label={t("steps.list.delete")}
              sx={{ color: "#ed5858" }}
              onClick={() => handleDeleteStep(index)}
              title={t("steps.list.delete")}
            >
              <RemoveCircleOutlineIcon fontSize="small" />
            </IconButton>

            <div className="steps-form__list-item-content">
              <span className="steps-form__list-item-number">{index + 1}.</span>
              <div className="steps-form__list-item-text">
                <span className="steps-form__list-item-description">
                  {step.description}
                </span>
                {step.tip && (
                  <span className="steps-form__list-item-tip">
                    <LightbulbOutlineIcon
                      fontSize="small"
                      sx={{ mr: 0.5, color: "warning.main" }}
                    />
                    {step.tip}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StepsForm;
