import { MAP_API_KEY } from "../../constants/mapConstants";

const BASE_URL = "https://maps.googleapis.com/maps/api/place";

export const getLocation = async (input: string) => {
  const response = await fetch(
    `${BASE_URL}/autocomplete/json?input=${input}&key=${MAP_API_KEY}`
  );

  return response;
};

export const getDetailedLocation = async (placeId: string) => {
  const response = await fetch(
    `${BASE_URL}/details/json?place_id=${placeId}&key=${MAP_API_KEY}`
  );

  return response;
};
