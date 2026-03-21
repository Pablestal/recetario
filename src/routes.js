export const routes = {
  home: "/",
  profile: "/profile",
  account: "/account",
  recipes: "/recipes",
  recipeCreation: "/recipes/recipe-creation",
  recipeEdit: (id) => `/recipes/recipe-creation/${id}`,
  recipeDetails: (id) => `/recipes/recipe-details/${id}`,
  shoppingList: "/shopping-list",
  weeklyMenu: "/weekly-menu",
};
