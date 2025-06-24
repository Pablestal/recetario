import { useEffect, useState } from "react";

const RecipeCard = (props) => {
  const [recipe, setRecipe] = useState();

  useEffect(() => {
    setRecipe(props.recipe);
  }, [props.recipe]);

  return <div>{recipe.name}</div>;
};

export default RecipeCard;
