import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/recipes";

export const useRecipeStore = create((set) => ({
  recipes: [],
  loading: false,
  error: null,
  currentRecipe: null,

  getRecipes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ recipes: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  getRecipeById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      set({ currentRecipe: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addRecipe: async (newRecipe) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(API_URL, newRecipe);
      set((state) => ({
        recipes: [...state.recipes, response.data],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateRecipe: async (id, updatedRecipe) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedRecipe);
      set((state) => ({
        recipes: state.recipes.map((recipe) =>
          recipe.id === id ? response.data : recipe
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteRecipe: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        recipes: state.recipes.filter((recipe) => recipe.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
