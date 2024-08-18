import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getLocation } from "../api/mapApi";
import { map } from "../../typings";

export const mapAutocomplete = createAsyncThunk(
  "mapAutocomplete",
  async ({ input }: { input: string }) => {
    const response = await getLocation(input);
    return response.json();
  }
);

const mapAutoCompleteSlice = createSlice({
  name: "mapAutocomplete",
  initialState: {
    isLoading: false,
    data: {} as map.AutocompleteResponse,
    isError: false,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(mapAutocomplete.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(mapAutocomplete.fulfilled, (state, action) => {
        (state.isLoading = false), (state.data = action.payload);
      })
      .addCase(mapAutocomplete.rejected, (state) => {
        (state.isLoading = false), (state.isError = true);
      })
      .addDefaultCase((state) => state);
  },
});

export default mapAutoCompleteSlice;
