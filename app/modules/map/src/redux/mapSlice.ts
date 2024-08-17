import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { map } from "../../typings";

export interface mapState {
  searchedList: map.AutocompletePredictions[];
}

const MAP_INITIAL_STATE: mapState = {
  searchedList: [],
};

export const mapSlice = createSlice({
  name: "map",
  initialState: MAP_INITIAL_STATE,
  reducers: {
    addSelectedMap: (
      state,
      action: PayloadAction<map.AutocompletePredictions>
    ) => {
      const searchedList = state.searchedList;
      const isPresent = searchedList.some(function (list) {
        return list.place_id === action.payload.place_id;
      });

      if (!isPresent) {
        state.searchedList.push(action.payload);
      }
    },
    clearSelectedMap: (state, action: PayloadAction<string>) => {
      state.searchedList.filter((value) => value.place_id !== action.payload);
    },
    clearAllSelectedMaps: (state) => {
      state.searchedList = [];
    },
  },
});

export const { addSelectedMap, clearSelectedMap, clearAllSelectedMaps } =
  mapSlice.actions;
export default mapSlice;
