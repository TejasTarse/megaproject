import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

export const adminLogin = createAsyncThunk(
    "admin/login",
    async ({ email, password }, thunkAPI) => {
        try {
            const res = await API.post("/auth/login", { email, password });

            if (res.data.user.role !== "admin") {
                return thunkAPI.rejectWithValue("Not an admin account");
            }

            localStorage.setItem("adminToken", res.data.token);
            localStorage.setItem("adminUser", JSON.stringify(res.data.user));

            return res.data.user;

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        user: JSON.parse(localStorage.getItem("adminUser")) || null,
        loading: false,
        error: null,
    },
    reducers: {
        logoutAdmin(state) {
            state.user = null;
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
