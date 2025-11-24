import { create } from "zustand";
import { supabase } from "../config/supabase";

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  authListener: null,

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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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

  // Get current session token (with automatic refresh)
  getToken: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      return null;
    }

    // If session exists, check if token needs refresh
    if (session) {
      const expiresAt = session.expires_at; // Unix timestamp in seconds
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = expiresAt - now;

      // Refresh token if it expires in less than 5 minutes
      if (timeUntilExpiry < 300) {
        const { data, error: refreshError } =
          await supabase.auth.refreshSession();

        if (refreshError) {
          console.error("Error refreshing session:", refreshError);
          return session.access_token;
        }

        if (data.session) {
          set({ session: data.session, user: data.user });
          return data.session.access_token;
        }
      }

      return session.access_token;
    }

    return null;
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
              set({
                user: session.user,
                session: session,
              });
              await get().loadProfile(session.user.id);
            } else {
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
}));
