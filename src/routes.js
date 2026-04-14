export const routes = {
  home: "/",
  profile: (username) => `/profile/${username}`,
  account: "/account",
  recipes: "/recipes",
  recipeCreation: "/recipes/recipe-creation",
  recipeEdit: (id) => `/recipes/recipe-creation/${id}`,
  recipeDetails: (id) => `/recipes/recipe-details/${id}`,
  shoppingList: "/shopping-list",
  weeklyMenu: "/weekly-menu",
};
