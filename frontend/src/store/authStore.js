import { create } from "zustand";
import {jwtDecode} from "jwt-decode";

const useAuthStore = create((set) => ({
    user: localStorage.getItem("token") ? jwtDecode(localStorage.getItem("token")) : null,
    login: (token) => {
        localStorage.setItem("token", token);
        set({ user: jwtDecode(token) });
    },
    logout: () => {
        localStorage.removeItem("token");
        set({ user: null });
    }
}));

export default useAuthStore;
