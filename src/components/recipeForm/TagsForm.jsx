import "./TagsForm.scss";
import { useEffect } from "react";
import { useTagStore } from "../../stores/useTagStore";
import { useTranslation } from "react-i18next";
import { Autocomplete, TextField, Chip } from "@mui/material";
import { useIsMobile } from "../../utils/common";

const TagForm = (props) => {
  const isMobile = useIsMobile();
  const { recipe, handleTagsUpdate } = props;
  const { t } = useTranslation("createRecipe");

  const tags = useTagStore((state) => state.tags);
  const getTags = useTagStore((state) => state.getTags);

  useEffect(() => {
    getTags();
  }, [getTags]);

  return (
    <div className="tags-form">
      <Autocomplete
        sx={{ minWidth: "250px" }}
        multiple
        options={tags}
        limitTags={isMobile ? 2 : 4}
        size="medium"
        getOptionLabel={(option) => option.name}
        value={recipe.tags}
        onChange={(event, newValue) => {
          if (newValue.length <= 4) {
            handleTagsUpdate(newValue);
          }
        }}
        getOptionDisabled={(option) => {
          return (
            recipe.tags.length >= 4 &&
            !recipe.tags.some((tag) => tag.id === option.id)
          );
        }}
        slotProps={{
          listbox: {
            style: {
              maxHeight: "200px",
              overflow: "auto",
            },
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("fields.tags.label")}
            helperText={`${recipe.tags.length}/4 ${t("fields.tags.numberLabel")}`}
          />
        )}
        renderValue={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                variant="filled"
                label={option.name}
                size="small"
                {...tagProps}
                sx={{
                  backgroundColor: option.color || "#43a047",
                  color: "#fff",
                  "& .MuiChip-deleteIcon": {
                    color: "#fff",
                  },
                }}
              />
            );
          })
        }
      />
    </div>
  );
};

export default TagForm;
