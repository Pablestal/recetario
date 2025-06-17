import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecipeStore } from "../utils/useRecipeStore";

function RecipeList() {
  const recipes = useRecipeStore((state) => state.recipes);
  const getRecipes = useRecipeStore((state) => state.getRecipes);

  useEffect(() => {
    getRecipes();
  }, [getRecipes]);

  const recipeCards = recipes.map((recipe) => (
    <li key={recipe.id}>{recipe.name}</li>
  ));

  return (
    <>
      <section>
        <h2>Recipes</h2>
        <Link to="/recipe-creation">Crear receta</Link>
        <ul>{recipeCards}</ul>
      </section>
    </>
  );
}

export default RecipeList;
