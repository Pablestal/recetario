import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/tags";

export const useTagStore = create((set) => ({
  tags: [],
  loading: false,
  error: null,

  getTagsByLanguage: async (language) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/${language}`);
      set({ tags: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
