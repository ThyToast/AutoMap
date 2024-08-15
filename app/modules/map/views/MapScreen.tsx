import React, { useEffect, useRef, useState } from "react";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { MAP_API_KEY } from "../constants/mapConstants";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  BACKGROUND_COLOR,
  MAIN_APP_THEME,
} from "../../main/constants/themeConstants";
import MapView from "react-native-maps";
import * as ExpoLocation from "expo-location";
import AntDesign from "@expo/vector-icons/AntDesign";

const MapScreen = () => {
  const mapRef = useRef<MapView | null>(null);
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
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

  const onLocationPress = () => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0043,
        longitudeDelta: 0.0034,
      });
    }
  };

  const onMapPress = (
    _data: GooglePlaceData,
    detail: GooglePlaceDetail | null
  ) => {
    if (detail) {
      const latitudeDelta =
        detail.geometry.viewport.northeast.lat -
        detail.geometry.viewport.southwest.lat;
      mapRef.current?.animateToRegion({
        latitude: detail.geometry.location.lat,
        longitude: detail.geometry.location.lng,
        latitudeDelta,
        longitudeDelta: latitudeDelta * ASPECT_RATIO,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} ref={mapRef} showsUserLocation={true}>
        <TouchableOpacity style={styles.button} onPress={onLocationPress}>
          <AntDesign name="enviroment" size={24} color="black" />
        </TouchableOpacity>
      </MapView>

      <View
        style={{
          position: "absolute",
          width: "100%",
          alignSelf: "center",
          top: 16,
        }}
      >
        <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails={true}
          query={{
            key: MAP_API_KEY,
            language: "en",
          }}
          onPress={onMapPress}
          onFail={(error) => console.error(error)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    padding: 16,
  },
  map: {
    width: "100%",
    flex: 1,
    borderRadius: 16,
  },
  button: {
    backgroundColor: MAIN_APP_THEME.brand_primary,
    height: 42,
    width: 42,
    borderRadius: 42 / 2,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});

export default MapScreen;
