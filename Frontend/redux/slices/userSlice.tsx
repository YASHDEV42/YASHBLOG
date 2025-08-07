import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserType = User | null;
type UserState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
};

// Load user from localStorage if available
const loadUserFromStorage = (): User | null => {
  if (typeof window !== "undefined") {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // Only return if it's a valid user object
        if (parsed && typeof parsed === 'object' && parsed._id) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn("Failed to load user from localStorage:", error);
      // Clear invalid data
      localStorage.removeItem("user");
    }
  }
  return null;
};

const initialState: UserState = {
  user: loadUserFromStorage(),
  loading: false,
  error: null,
  initialized: false, // Set to false initially to trigger auth check
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to set the user
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.initialized = true;

      // Persist user to localStorage
      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("user");
        }
      }
    },
    // Action to clear the user
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.initialized = true;

      // Remove user from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
    // Action to set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Action to set an error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.initialized = true;
    },
    // Action to mark as initialized
    setInitialized: (state) => {
      state.initialized = true;
    },
  },
});

export const { setUser, clearUser, setLoading, setError, setInitialized } =
  userSlice.actions;

export default userSlice.reducer;
