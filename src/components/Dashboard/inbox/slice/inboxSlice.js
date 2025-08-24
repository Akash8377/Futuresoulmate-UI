// features/inbox/inboxSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../../../config";

// Async thunks
export const fetchReceiverData = createAsyncThunk(
  "inbox/fetchReceiverData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${config.baseURL}/api/inbox/receiver`); // adjust endpoint if needed
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      return data; // assume array
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const acceptInvitation = createAsyncThunk(
  "inbox/acceptInvitation",
  async (notificationId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${config.baseURL}/api/inbox/accept/${notificationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Fail");
      return notificationId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const rejectInvitation = createAsyncThunk(
  "inbox/rejectInvitation",
  async (notificationId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${config.baseURL}/api/inbox/deleted/${notificationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Fail");
      return notificationId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const inboxSlice = createSlice({
  name: "inbox",
  initialState: {
    receiverData: [],
    status: "idle",
    error: null,
    acceptStatus: "idle",
    rejectStatus: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchReceiverData
      .addCase(fetchReceiverData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReceiverData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.receiverData = action.payload;
      })
      .addCase(fetchReceiverData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // acceptInvitation
      .addCase(acceptInvitation.pending, (state) => {
        state.acceptStatus = "loading";
      })
      .addCase(acceptInvitation.fulfilled, (state, action) => {
        state.acceptStatus = "succeeded";
        // Optionally remove or mark the accepted item; here we refetch externally
      })
      .addCase(acceptInvitation.rejected, (state, action) => {
        state.acceptStatus = "failed";
        state.error = action.payload;
      })
      // rejectInvitation
      .addCase(rejectInvitation.pending, (state) => {
        state.rejectStatus = "loading";
      })
      .addCase(rejectInvitation.fulfilled, (state, action) => {
        state.rejectStatus = "succeeded";
        // Optionally remove or mark
      })
      .addCase(rejectInvitation.rejected, (state, action) => {
        state.rejectStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const selectReceiverData = (state) => state.inbox.receiverData;
export const selectInboxStatus = (state) => state.inbox.status;
export const selectInboxError = (state) => state.inbox.error;

export default inboxSlice.reducer;
