import "./RecipeList.scss";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecipeStore } from "../../stores/useRecipeStore";
import RecipeCard from "./RecipeCard";

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
        <ul className="recipe-list">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </ul>
      </section>
    </>
  );
};

export default RecipeList;
