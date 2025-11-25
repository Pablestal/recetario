import CreateRecipe from "../components/recipeForm/CreateRecipe";
import { useParams } from "react-router-dom";

const RecipeCreationPage = () => {
  const { id } = useParams();

  return (
    <>
      <section>
        <CreateRecipe recipeId={id} />
      </section>
    </>
  );
};

export default RecipeCreationPage;
