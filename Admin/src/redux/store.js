import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./adminSlice";
import userReducer from "./userSlice";

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        users: userReducer,
    },
});
