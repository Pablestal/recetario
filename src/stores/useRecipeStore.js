import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/recipes`;

const getAuthHeaders = async () => {
  const token = await useAuthStore.getState().getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const useRecipeStore = create((set) => ({
  recipes: [],
  loading: false,
  error: null,
  currentRecipe: null,

  getRecipes: async () => {
    set({ loading: true, error: null });
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(API_URL, { headers });
      set({ recipes: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  getRecipeById: async (id) => {
    set({ loading: true, error: null });
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_URL}/${id}`, { headers });
      set({ currentRecipe: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addRecipe: async (newRecipe) => {
    set({ loading: true, error: null });
    try {
      const token = await useAuthStore.getState().getToken();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post(API_URL, newRecipe, config);
      set((state) => ({
        recipes: [...state.recipes, response.data.data],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateRecipe: async (id, updatedRecipe) => {
    set({ loading: true, error: null });
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(`${API_URL}/${id}`, updatedRecipe, {
        headers,
      });
      set((state) => ({
        recipes: state.recipes.map((recipe) =>
          recipe.id === id ? response.data.data : recipe
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteRecipe: async (id) => {
    set({ loading: true, error: null });
    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${API_URL}/${id}`, { headers });
      set((state) => ({
        recipes: state.recipes.filter((recipe) => recipe.id !== id),
        currentRecipe: state.currentRecipe?.id === id ? null : state.currentRecipe,
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
