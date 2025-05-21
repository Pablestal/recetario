import { useContext, useEffect } from "react";
import { RecipeContext } from "../context/recipe.context";
import { Link } from "react-router-dom";

function RecipeList() {
  const { recipes, getRecipes } = useContext(RecipeContext);

  useEffect(() => {
    getRecipes();
  });

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
