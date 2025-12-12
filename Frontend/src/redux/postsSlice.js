import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

/* thunks */
export const fetchPosts = createAsyncThunk("posts/fetchAll", async (query = "") => {
  const res = await API.get(`/posts${query}`);
  return res.data;
});

export const fetchPost = createAsyncThunk("posts/fetchOne", async (slug) => {
  const res = await API.get(`/posts/${slug}`);
  return res.data;
});

export const fetchMyPosts = createAsyncThunk("posts/fetchMyPosts", async () => {
  const res = await API.get("/posts/mine"); // protected
  return res.data;
});

export const createPost = createAsyncThunk("posts/create", async (payload, thunkAPI) => {
  const res = await API.post("/posts", payload);
  return res.data;
});

export const updatePost = createAsyncThunk("posts/update", async ({ slug, data }) => {
  const res = await API.put(`/posts/${slug}`, data);
  return res.data;
});

export const deletePost = createAsyncThunk("posts/delete", async (slug) => {
  await API.delete(`/posts/${slug}`);
  return slug;
});

export const likePost = createAsyncThunk("posts/like", async (slug) => {
  const res = await API.post(`/posts/${slug}/like`);
  return res.data;
});

export const viewPost = createAsyncThunk("posts/view", async (slug) => {
  const res = await API.post(`/posts/${slug}/view`);
  return res.data; // should return updated post
});

/* slice */
const postsSlice = createSlice({
  name: "posts",
  initialState: { list: [], current: null, loading: false },
  reducers: {
    // Optimistic toggle like locally (immediate UI feedback)
    optimisticToggleLike(state, action) {
      const { slug, userId } = action.payload;
      if (!userId) return; // guard: don't do anything if no userId

      // update list
      state.list = state.list.map(p => {
        if (p._id !== slug) return p;
        const liked = (p.likes || []).some(id => id.toString() === userId.toString());
        if (liked) {
          return { ...p, likes: (p.likes || []).filter(id => id.toString() !== userId.toString()) };
        } else {
          return { ...p, likes: [...(p.likes || []), userId] };
        }
      });

      // update current if open
      if (state.current?._id === slug) {
        const p = state.current;
        const liked = (p.likes || []).some(id => id.toString() === userId.toString());
        state.current = liked
          ? { ...p, likes: (p.likes || []).filter(id => id.toString() !== userId.toString()) }
          : { ...p, likes: [...(p.likes || []), userId] };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPosts.fulfilled, (s, a) => { s.list = a.payload; s.loading = false; })
      .addCase(fetchMyPosts.pending, (s) => { s.loading = true; })

      .addCase(fetchPosts.fulfilled, (s, a) => { s.list = a.payload; s.loading = false; })
      .addCase(fetchPosts.pending, (s) => { s.loading = true; })

      .addCase(fetchPost.fulfilled, (s, a) => { s.current = a.payload; })
      .addCase(createPost.fulfilled, (s, a) => { s.list.unshift(a.payload); })
      .addCase(updatePost.fulfilled, (s, a) => {
        s.list = s.list.map(p => p._id === a.payload._id ? a.payload : p);
        if (s.current?._id === a.payload._id) s.current = a.payload;
      })
      .addCase(deletePost.fulfilled, (s, a) => {
        s.list = s.list.filter(p => p._id !== a.payload);
        if (s.current?._id === a.payload) s.current = null;
      })
      .addCase(likePost.fulfilled, (s, a) => {
        // server returned updated post — overwrite
        s.list = s.list.map(p => p._id === a.payload._id ? a.payload : p);
        if (s.current?._id === a.payload._id) s.current = a.payload;
      })
      .addCase(likePost.rejected, (s, a) => {
        // On error: attempt to refetch single post if current is that post (simple revert)
        // NOTE: we can't make async calls here; components should handle re-fetch on error,
        // but we can mark current as stale (optional)
        // For simplicity we'll just keep current as-is and expect components to refetch
      })
      .addCase(viewPost.fulfilled, (s, a) => {
        // server returned updated post — overwrite
        s.list = s.list.map(p => p._id === a.payload._id ? a.payload : p);
        if (s.current?._id === a.payload._id) s.current = a.payload;
      });
  },
});

export const { optimisticToggleLike } = postsSlice.actions;
export default postsSlice.reducer;
