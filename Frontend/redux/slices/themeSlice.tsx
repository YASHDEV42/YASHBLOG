import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  isDark: boolean;
  name: string;
}

const initialState: ThemeState = {
  isDark: false,
  name: "default",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
    },
    setThemeName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const { toggleTheme, setThemeName } = themeSlice.actions;
export default themeSlice.reducer;
