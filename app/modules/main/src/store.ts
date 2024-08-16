import { configureStore } from "@reduxjs/toolkit";
import { autoCompleteApi } from "../../map/src/api/mapApi";

export const store = configureStore({
  reducer: {
    [autoCompleteApi.reducerPath]: autoCompleteApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(autoCompleteApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
