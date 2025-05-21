import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseProjectItem } from '@shared/schema';
import { getItems as fetchFirestoreItems } from '@/lib/firebase';

interface ItemsState {
  items: FirebaseProjectItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (userId: string, { rejectWithValue }) => {
    try {
      const items = await fetchFirestoreItems(userId);
      return items as FirebaseProjectItem[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch items');
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<FirebaseProjectItem>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<{ id: string; name?: string; cost?: number }>) => {
      const { id, ...changes } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        state.items[itemIndex] = { ...state.items[itemIndex], ...changes };
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addItem, updateItem, deleteItem } = itemsSlice.actions;

export default itemsSlice.reducer;
