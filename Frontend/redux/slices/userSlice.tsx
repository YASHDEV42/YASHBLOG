import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserType = User | null;
type UserState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean; // Track if user data has been loaded
};

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
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
    },
    // Action to clear the user
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.initialized = true; // Still mark as initialized
    },
    // Action to set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Action to set an error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.initialized = true; // Mark as initialized even on error
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;
