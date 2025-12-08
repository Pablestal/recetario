import "./ImagesForm.scss";
import { TextField, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useTranslation } from "react-i18next";
import fallbackImage from "../../assets/image-fallback.jpg";

const ImagesForm = (props) => {
  const {
    recipe,
    setRecipe,
    errors = {},
    touched = {},
    handleFieldBlur,
    validateField,
    setErrors,
  } = props;
  const { t } = useTranslation("createRecipe");

  const handleImageUpdate = (e) => {
    const { value } = e.target;

    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      mainImageURL: value,
    }));

    // Clear error if field becomes valid
    if (errors.mainImageURL && validateField) {
      const error = validateField("mainImageURL", value);
      if (!error && setErrors) {
        setErrors((prev) => ({
          ...prev,
          mainImageURL: null,
        }));
      }
    }
  };

  const handleDeleteImage = () => {
    setRecipe((prevRecipe) => ({ ...prevRecipe, mainImageURL: "" }));
  };

  const shouldShowError = touched.mainImageURL && errors.mainImageURL;

  return (
    <div className="images-form">
      <div className="images-form__inputs">
        <TextField
          id="imageUrl"
          label="Imagen de portada"
          helperText={
            shouldShowError
              ? errors.mainImageURL
              : "Añade una URL de imagen para mostrar como portada de la receta"
          }
          value={recipe.mainImageURL || ""}
          size="small"
          fullWidth
          variant="filled"
          onChange={handleImageUpdate}
          onBlur={() => handleFieldBlur && handleFieldBlur("mainImageURL")}
          error={!!shouldShowError}
        />
      </div>

      {recipe.mainImageURL && (
        <div className="images-form__preview">
          <div className="images-form__image-wrapper">
            <img
              src={recipe.mainImageURL}
              alt={t("images.preview.alt")}
              className="images-form__preview-image"
              onError={(e) => {
                e.target.src = fallbackImage;
                e.target.alt = "Image not found";
              }}
            />

            <IconButton
              aria-label={t("images.list.delete")}
              title={t("images.list.delete")}
              size="small"
              className="images-form__delete-button"
              sx={{
                color: "#ed5858",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  backgroundColor: "rgba(199, 197, 197, 0.9)",
                },
              }}
              onClick={handleDeleteImage}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesForm;
