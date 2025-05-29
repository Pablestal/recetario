import "./ImagesForm.scss";
import { useState } from "react";
import { TextField, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

function ImagesForm(props) {
  const { recipe, setRecipe, handleImagesUpdate } = props;
  const imageTemplate = {
    url: "",
  };
  const [newImage, setNewImage] = useState(imageTemplate);

  const handleNewImageUpdate = (e) => {
    setNewImage({ ...newImage, url: e.target.value });
  };

  return (
    <div className="images-form">
      <h2 className="images-form__title">Images</h2>
      <p>Insert image URL</p>
      <div className="images-form__inputs">
        <Button
          variant="contained"
          color="secondary"
          className="images-form__add-button"
          onClick={() => {
            handleImagesUpdate(newImage);
            setNewImage(imageTemplate);
          }}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
        <TextField
          id="imageUrl"
          label="Image URL"
          value={newImage.url}
          size="small"
          fullWidth
          variant="filled"
          onChange={handleNewImageUpdate}
        />
      </div>
      <ul className="images-form__list">
        {recipe.images.map((image, index) => (
          <li key={index} className="images-form__list-item">
            <img
              src={image.url}
              alt={`Recipe Image ${index + 1}`}
              style={{ width: "100px", height: "100px" }}
            />
            <IconButton
              aria-label="delete"
              size="small"
              sx={{
                color: "#ed5858",
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  backgroundColor: "rgba(199, 197, 197, 0.9)",
                },
              }}
              onClick={() => {
                const newImages = recipe.images.filter((img, i) => i !== index);
                setRecipe({ ...recipe, images: newImages });
                setNewImage(imageTemplate);
              }}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ImagesForm;
