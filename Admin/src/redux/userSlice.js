import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
    const res = await API.get("/admin/users");
    return res.data;
});

export const deleteUser = createAsyncThunk("users/delete", async (id) => {
    await API.delete(`/admin/users/${id}`);
    return id;
});

const userSlice = createSlice({
    name: "users",
    initialState: { list: [], loading: false },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.list = state.list.filter((u) => u._id !== action.payload);
            });
    },
});

export default userSlice.reducer;
