import { persistReducer } from "redux-persist";
import localStorage from "redux-persist/es/storage";
import { mapSlice } from "./mapSlice";

const mapPersistConfig = {
  key: "map",
  storage: localStorage,
};

const mapPersistReducer = persistReducer(mapPersistConfig, mapSlice.reducer);
