import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseOtherCost } from '@shared/schema';
import { getOtherCosts as fetchFirestoreOtherCosts } from '@/lib/firebase';

interface OtherCostsState {
  otherCosts: FirebaseOtherCost[];
  loading: boolean;
  error: string | null;
}

const initialState: OtherCostsState = {
  otherCosts: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchOtherCosts = createAsyncThunk(
  'otherCosts/fetchOtherCosts',
  async (userId: string, { rejectWithValue }) => {
    try {
      const costs = await fetchFirestoreOtherCosts(userId);
      return costs as FirebaseOtherCost[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch other costs');
    }
  }
);

const otherCostsSlice = createSlice({
  name: 'otherCosts',
  initialState,
  reducers: {
    addOtherCost: (state, action: PayloadAction<FirebaseOtherCost>) => {
      state.otherCosts.push(action.payload);
    },
    updateOtherCost: (state, action: PayloadAction<{ id: string; description?: string; amount?: number }>) => {
      const { id, ...changes } = action.payload;
      const costIndex = state.otherCosts.findIndex(cost => cost.id === id);
      if (costIndex !== -1) {
        state.otherCosts[costIndex] = { ...state.otherCosts[costIndex], ...changes };
      }
    },
    deleteOtherCost: (state, action: PayloadAction<string>) => {
      state.otherCosts = state.otherCosts.filter(cost => cost.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOtherCosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOtherCosts.fulfilled, (state, action) => {
        state.otherCosts = action.payload;
        state.loading = false;
      })
      .addCase(fetchOtherCosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addOtherCost, updateOtherCost, deleteOtherCost } = otherCostsSlice.actions;

export default otherCostsSlice.reducer;
