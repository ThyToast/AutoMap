import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { map } from "../../typings";
import { LatLng } from "react-native-maps";

export interface mapState {
  searchedList: map.AutocompletePredictions[];
  selectedLocation: LatLng | null;
}

const MAP_INITIAL_STATE: mapState = {
  searchedList: [],
  selectedLocation: null,
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
      const isPresent = searchedList.some((list) => {
        return list.place_id === action.payload.place_id;
      });

      if (!isPresent) {
        state.searchedList.push(action.payload);
      }
    },
    clearSelectedMap: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        searchedList: [...state.searchedList].filter(
          (value) => value.place_id !== action.payload
        ),
      };
    },
    updateSelectedLocation: (state, action: PayloadAction<LatLng>) => {
      return {
        ...state,
        selectedLocation: action.payload,
      };
    },
  },
});

export const { addSelectedMap, clearSelectedMap, updateSelectedLocation } =
  mapSlice.actions;
export default mapSlice;
