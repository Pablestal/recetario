import "./StepsForm.scss";
import { Button, IconButton, TextField, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import LightbulbOutlineIcon from "@mui/icons-material/LightbulbOutline";
import { useState } from "react";

function IngredientForm(props) {
  const { recipe, setRecipe, handleStepsUpdate } = props;
  const stepTempalte = {
    description: "",
    tip: "",
  };

  const [newStep, setNewStep] = useState(stepTempalte);

  const handleNewStepUpdate = (e) => {
    const { id, value } = e.target;
    setNewStep({ ...newStep, [id]: value });
  };

  return (
    <div className="steps-form">
      <div className="steps-form__header">
        <h2 className="steps-form__title">Steps</h2>
        <p>Add a step with a description and an optional tip</p>
      </div>
      <div className="steps-form__inputs">
        <Button
          className="steps-form__add-button"
          variant="contained"
          color="secondary"
          onClick={() => {
            handleStepsUpdate(newStep);
            setNewStep(stepTempalte);
          }}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
        <div className="steps-form__input-group">
          <TextField
            id="description"
            value={newStep.description}
            size="small"
            fullWidth
            label="Step description"
            variant="filled"
            onChange={handleNewStepUpdate}
          />

          <TextField
            id="tip"
            value={newStep.tip}
            size="small"
            fullWidth
            label="Tip"
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
      </div>
      <ul className="steps-form__list">
        {recipe.steps.map((ingredient, index) => (
          <li key={index} className="steps-form__list-item">
            <IconButton
              aria-label="delete"
              sx={{ color: "#ed5858" }}
              onClick={() => {
                const newSteps = recipe.steps.filter((ing, i) => i !== index);
                setRecipe({ ...recipe, steps: newSteps });
              }}
            >
              <RemoveCircleOutlineIcon fontSize="small" />
            </IconButton>
            <span className="steps-form__list-item-description">
              {ingredient.description}
            </span>
            <span className="steps-form__list-item-tip"> {ingredient.tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IngredientForm;
