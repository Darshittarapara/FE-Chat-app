import { create } from "zustand";
import type { ThemeInitState } from "./model";

const useThemeStore = create<ThemeInitState>((set) => ({
    theme: localStorage.getItem('theme') || 'coffee',
    setTheme: (theme) => {
        set({theme});
        localStorage.setItem('theme', theme);
    } 
}))

export default useThemeStore