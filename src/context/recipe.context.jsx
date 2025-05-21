import { createContext, useState } from "react";
import mockRecipes from "../utils/mockRecipes.json";

const RecipeContext = createContext();

function RecipeProviderWrapper(props) {
  const [recipes, setRecipes] = useState([]);

  const getRecipes = () => {
    setRecipes(mockRecipes.recipes);
  };

  return (
    <RecipeContext.Provider value={{ recipes, setRecipes, getRecipes }}>
      {props.children}
    </RecipeContext.Provider>
  );
}

export { RecipeContext, RecipeProviderWrapper };
