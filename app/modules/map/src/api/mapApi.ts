import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MAP_API_KEY } from "../../constants/mapConstants";
import { map } from "../../typings";

export const autoCompleteApi = createApi({
  reducerPath: "autoCompleteApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://maps.googleapis.com/maps/api/place",
  }),
  endpoints: (builder) => ({
    getLocation: builder.query<map.AutocompleteResponse, string>({
      query: (input) => `/autocomplete/json?input=${input}&key=${MAP_API_KEY}`,
    }),
    getDetailedLocation: builder.query<map.LocationDetailedResponse, string>({
      query: (placeId) =>
        `/details/json?place_id=${placeId}&key=${MAP_API_KEY}`,
    }),
  }),
});

export const { useLazyGetLocationQuery, useLazyGetDetailedLocationQuery } =
  autoCompleteApi;
