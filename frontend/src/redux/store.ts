import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { setStore } from "../utils/axiosInstance";

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

// Inject the store instance into axiosInstance
setStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;                                            