import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import itemsReducer from './items-slice';
import otherCostsReducer from './other-costs-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    otherCosts: otherCostsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
