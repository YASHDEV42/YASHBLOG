import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  isDark: boolean;
  name: string;
}

const getInitialTheme = (): ThemeState => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return JSON.parse(savedTheme);
  }
  return { isDark: false, name: "default" };
};

const initialState: ThemeState = getInitialTheme();

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      localStorage.setItem("theme", JSON.stringify(state));
    },
    setThemeName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      localStorage.setItem("theme", JSON.stringify(state));
    },
  },
});

export const { toggleTheme, setThemeName } = themeSlice.actions;
export default themeSlice.reducer;
