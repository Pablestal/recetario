import { create } from "zustand";
import axios from "axios";
import { supabase } from "../config/supabase";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}`;

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  authListener: null,
  redirectPath: null,
  showLoginModal: false,
  loginSuccessCallback: null,

  // Register new user
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        await supabase.from("users").upsert(
          {
            id: data.user.id,
            email: data.user.email,
            name: userData.name || null,
            username: userData.username || null,
          },
          {
            onConflict: "id",
            ignoreDuplicates: false,
          }
        );
      } catch (profileError) {
        console.error("Error creating/updating profile:", profileError);
        throw new Error("Error al crear el perfil de usuario");
      }
    }

    return data;
  },

  // Login existing user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    set({
      user: data.user,
      session: data.session,
    });

    // Load user profile
    await get().loadProfile(data.user.id);

    return data;
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("sb-") && k.endsWith("-auth-token"))
        .forEach((k) => localStorage.removeItem(k));
    }
    set({ user: null, profile: null, session: null });
  },

  // Load user profile
  loadProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      set({ profile: data });
      return data;
    } catch (error) {
      console.error("Error loading profile:", error);
      return null;
    }
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    set({ profile: data });
    return data;
  },

  // Update profile data via REST API
  updateProfileData: async (userId, updates) => {
    const token = await get().getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await axios.patch(`${API_URL}/users/${userId}`, updates, { headers });
    return await get().loadProfile(userId);
  },

  // Change password via REST API
  changePassword: async (userId, currentPassword, newPassword) => {
    const token = await get().getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post(
      `${API_URL}/users/${userId}/change-password`,
      { currentPassword, newPassword },
      { headers }
    );
    return response.data;
  },

  // Change email via REST API
  changeEmail: async (userId, currentPassword, newEmail) => {
    const token = await get().getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post(
      `${API_URL}/users/${userId}/change-email`,
      { currentPassword, newEmail },
      { headers }
    );
    return response.data;
  },

  // Delete account via REST API then sign out
  deleteAccount: async (userId) => {
    const token = await get().getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await axios.delete(`${API_URL}/users/${userId}`, { headers });
    await get().signOut();
  },

  // Get current session token (with automatic refresh)
  getToken: async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        return null;
      }

      if (!session) {
        return null;
      }

      // Update store with latest session
      set({ session, user: session.user });

      return session.access_token;
    } catch (error) {
      console.error("Error in getToken:", error);
      return null;
    }
  },

  // Initialize auth state
  initialize: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        set({
          user: session.user,
          session: session,
        });

        await get().loadProfile(session.user.id);
      }

      set({ loading: false });

      // Listen for auth state changes (only if not already listening)
      if (!get().authListener) {
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event);

            if (session?.user) {
              // Capture current state before updating
              const currentUserId = get().user?.id;
              const hasProfile = !!get().profile;

              // Always update session to ensure we have the latest token
              set({
                user: session.user,
                session: session,
              });

              // Only reload profile if user changed or not loaded yet
              const newUserId = session.user.id;
              if (currentUserId !== newUserId || !hasProfile) {
                await get().loadProfile(session.user.id);
              }
            } else if (event === "SIGNED_OUT") {
              set({ user: null, profile: null, session: null });
            }
          }
        );

        set({ authListener });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ loading: false });
    }
  },

  // Cleanup auth listener
  cleanup: () => {
    const authListener = get().authListener;
    if (authListener?.subscription) {
      authListener.subscription.unsubscribe();
      set({ authListener: null });
    }
  },

  // Set redirect path for after login
  setRedirectPath: (path) => {
    set({ redirectPath: path });
  },

  // Clear redirect path
  clearRedirectPath: () => {
    set({ redirectPath: null });
  },

  // Open login modal
  openLoginModal: (onSuccess = null) => {
    set({ showLoginModal: true, loginSuccessCallback: onSuccess });
  },

  // Close login modal
  closeLoginModal: () => {
    set({ showLoginModal: false, loginSuccessCallback: null });
  },
}));
