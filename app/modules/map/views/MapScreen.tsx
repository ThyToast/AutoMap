import React, { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  BACKGROUND_COLOR,
  MAIN_APP_THEME,
} from "../../main/constants/themeConstants";
import MapView, { Marker } from "react-native-maps";
import AntDesign from "@expo/vector-icons/AntDesign";
import MapSearch from "../components/MapSearch";
import { useAppSelector } from "../../main/src/hooks";
import useGetCurrentLocation from "../src/hooks/useGetCurrentLocation";

const MapScreen = () => {
  const mapRef = useRef<MapView | null>(null);
  const selectedLocation = useAppSelector(
    (state) => state.map.selectedLocation
  );

  const { location: currentLocation } = useGetCurrentLocation();

  useEffect(() => {
    if (selectedLocation) {
      mapRef.current?.animateToRegion({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.0043,
        longitudeDelta: 0.0034,
      });
    }
  }, [selectedLocation]);

  const onLocationPress = () => {
    if (currentLocation) {
      mapRef.current?.animateToRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0043,
        longitudeDelta: 0.0034,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} ref={mapRef} showsUserLocation={true}>
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation?.latitude,
              longitude: selectedLocation?.longitude,
            }}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={onLocationPress}>
          <AntDesign name="enviroment" size={24} color="black" />
        </TouchableOpacity>
      </MapView>

      <View style={styles.autocomplete}>
        <MapSearch />
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
  autocomplete: {
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    top: 16,
  },
});

export default MapScreen;
