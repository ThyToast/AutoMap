import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDetailedLocation } from "../api/mapApi";
import { map } from "../../typings";

export const mapAutocompleteDetailed = createAsyncThunk(
  "mapAutocompleteDetailed",
  async ({ placeId }: { placeId: string }) => {
    const response = await getDetailedLocation(placeId);
    return response.json();
  }
);

const mapAutocompleteDetailedSlice = createSlice({
  name: "mapAutocompleteDetailed",
  initialState: {
    isLoading: false,
    data: {} as map.LocationDetailedResponse,
    isError: false,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(mapAutocompleteDetailed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(mapAutocompleteDetailed.fulfilled, (state, action) => {
        (state.isLoading = false), (state.data = action.payload);
      })
      .addCase(mapAutocompleteDetailed.rejected, (state) => {
        (state.isLoading = false), (state.isError = true);
      })
      .addDefaultCase((state) => state);
  },
});

export default mapAutocompleteDetailedSlice;
