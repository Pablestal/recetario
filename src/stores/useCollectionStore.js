import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";
import { useRecipeStore } from "./useRecipeStore";

const API_URL = `${import.meta.env.VITE_API_URL}/collections`;
const USERS_API_URL = `${import.meta.env.VITE_API_URL}/users`;

const getAuthHeaders = async () => {
  const token = await useAuthStore.getState().getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const useCollectionStore = create((set, get) => ({
  collections: [],
  collectionRecipeIds: null,
  collectionDetail: null,
  collectionRecipes: [],
  loading: false,
  error: null,

  fetchCollectionRecipeIds: async (collectionId) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_URL}/${collectionId}`, { headers });
      const recipes = response.data.data.recipes ?? [];
      set({ collectionRecipeIds: recipes.map((r) => r.id) });
    } catch (error) {
      set({ error: error.message });
    }
  },

  clearCollectionRecipeIds: () => set({ collectionRecipeIds: null }),
  clearCollectionDetail: () => set({ collectionDetail: null, collectionRecipes: [], error: null }),
  clearCollections: () => set({ collections: [] }),
  setCollections: (collections) => set({ collections }),

  fetchCollectionDetail: async (collectionId) => {
    set({ loading: true, error: null });
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_URL}/${collectionId}`, { headers });
      const data = response.data.data;
      set({
        collectionDetail: {
          id: data.id,
          name: data.name,
          is_public: data.is_public,
          is_default: data.is_default,
        },
        collectionRecipes: data.recipes ?? [],
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateCollection: async (collectionId, updates) => {
    try {
      const headers = await getAuthHeaders();
      await axios.patch(`${API_URL}/${collectionId}`, updates, { headers });
      set((state) => ({
        collectionDetail: state.collectionDetail
          ? { ...state.collectionDetail, ...updates }
          : state.collectionDetail,
        collections: state.collections.map((c) =>
          c.id === collectionId ? { ...c, ...updates } : c,
        ),
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteCollection: async (collectionId) => {
    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${API_URL}/${collectionId}`, { headers });
      set((state) => ({
        collections: state.collections.filter((c) => c.id !== collectionId),
        collectionDetail: null,
        collectionRecipes: [],
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  removeRecipesFromCollection: async (collectionId, recipeIds) => {
    try {
      const headers = await getAuthHeaders();
      await Promise.allSettled(
        recipeIds.map((id) =>
          axios.delete(`${API_URL}/${collectionId}/recipes/${id}`, { headers }),
        ),
      );
      set((state) => ({
        collectionRecipes: state.collectionRecipes.filter((r) => !recipeIds.includes(r.id)),
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchCollections: async (userId) => {
    set({ loading: true, error: null });
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${USERS_API_URL}/${userId}/collections`, { headers });
      set({ collections: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createCollection: async (name, isPublic) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        API_URL,
        { name, is_public: isPublic },
        { headers },
      );
      const newCollection = response.data.data;
      set((state) => ({ collections: [...state.collections, newCollection] }));
      return newCollection;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  addRecipeToCollections: async (recipeId, collectionIds) => {
    try {
      const headers = await getAuthHeaders();
      await Promise.all(
        collectionIds.map((id) =>
          axios.post(
            `${API_URL}/${id}/recipes`,
            { recipe_id: recipeId },
            { headers },
          ),
        ),
      );
      useRecipeStore.getState().updateRecipeIsBookmarked(recipeId, true);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  removeRecipeFromCollections: async (recipeId) => {
    try {
      const headers = await getAuthHeaders();
      const collections = get().collections;
      await Promise.allSettled(
        collections.map((c) =>
          axios.delete(`${API_URL}/${c.id}/recipes/${recipeId}`, { headers }),
        ),
      );
      useRecipeStore.getState().updateRecipeIsBookmarked(recipeId, false);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));
