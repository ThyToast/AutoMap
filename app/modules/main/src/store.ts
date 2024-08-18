import { configureStore } from "@reduxjs/toolkit";
import mapSlice from "../../map/src/redux/mapSlice";
import mapAutocompleteDetailedSlice from "../../map/src/redux/mapAutocompleteDetailSlice";
import mapAutoCompleteSlice from "../../map/src/redux/mapAutocompleteSlice";

export const store = configureStore({
  reducer: {
    map: mapSlice.reducer,
    autoComplete: mapAutoCompleteSlice.reducer,
    autoCompleteDetailed: mapAutocompleteDetailedSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
