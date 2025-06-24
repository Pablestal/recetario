import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecipeStore } from "../stores/useRecipeStore";

const RecipeList = () => {
  const recipes = useRecipeStore((state) => state.recipes);
  const getRecipes = useRecipeStore((state) => state.getRecipes);

  useEffect(() => {
    getRecipes();
  }, [getRecipes]);

  return (
    <>
      <section>
        <h2>Recipes</h2>
        <Link to="/recipe-creation">Crear receta</Link>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>{recipe.name}</li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default RecipeList;
