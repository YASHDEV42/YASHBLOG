import { Comment, LikedPosts, Post, User } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserType = User & {
  posts: Post[];
  likes: LikedPosts[];
  comments: Comment[];
};

type UserState = {
  user: UserType | null;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
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
    },
    // Action to clear the user
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    // Action to set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Action to set an error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;
