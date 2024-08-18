import { useState, useEffect } from "react";
import * as ExpoLocation from "expo-location";

const useGetCurrentLocation = () => {
  const [location, setLocation] = useState<null | ExpoLocation.LocationObject>(
    null
  );

  useEffect(() => {
    (async () => {
      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await ExpoLocation.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return {
    location,
  };
};

export default useGetCurrentLocation;
