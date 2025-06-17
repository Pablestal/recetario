import "./ImagesForm.scss";
import { useState } from "react";
import { TextField, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useTranslation } from "react-i18next";
import fallbackImage from "../../assets/image-fallback.jpg";

function ImagesForm(props) {
  const { recipe, setRecipe, handleImagesUpdate } = props;
  const { t } = useTranslation("createRecipe");

  const imageTemplate = {
    url: "",
  };

  const [newImage, setNewImage] = useState(imageTemplate);

  const handleNewImageUpdate = (e) => {
    setNewImage({ ...newImage, url: e.target.value });
  };

  const handleAddImage = () => {
    if (newImage.url.trim()) {
      handleImagesUpdate(newImage);
      setNewImage(imageTemplate);
    }
  };

  const handleDeleteImage = (index) => {
    const newImages = recipe.images.filter((img, i) => i !== index);
    setRecipe({ ...recipe, images: newImages });
  };

  return (
    <div className="images-form">
      <div className="images-form__header">
        <h2 className="images-form__title">{t("images.title")}</h2>
        <p className="images-form__subtitle">{t("images.subtitle")}</p>
      </div>

      <div className="images-form__inputs">
        <TextField
          id="imageUrl"
          label={t("images.fields.url.label")}
          placeholder={t("images.fields.url.placeholder")}
          value={newImage.url}
          size="small"
          fullWidth
          variant="filled"
          onChange={handleNewImageUpdate}
        />

        <Button
          variant="contained"
          color="secondary"
          className="images-form__add-button"
          onClick={handleAddImage}
          startIcon={<AddIcon />}
          disabled={!newImage.url.trim()}
        >
          {t("images.buttons.add")}
        </Button>
      </div>

      <ul className="images-form__list">
        {recipe.images.map((image, index) => (
          <li key={index} className="images-form__list-item">
            <img
              src={image.url}
              alt={t("images.list.alt", { number: index + 1 })}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = fallbackImage;
                e.target.alt = "Image not found";
              }}
            />

            <IconButton
              aria-label={t("images.list.delete")}
              title={t("images.list.delete")}
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
              onClick={() => handleDeleteImage(index)}
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
