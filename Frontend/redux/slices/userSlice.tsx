import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserType = User | null;

type UserState = {
  user: UserType;
  loading: boolean;
  error: string | null;
  initialized: boolean;
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
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.initialized = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.initialized = true;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
