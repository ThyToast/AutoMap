import { Input } from "@ant-design/react-native";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  useLazyGetDetailedLocationQuery,
  useLazyGetLocationQuery,
} from "../src/api/mapApi";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { debounce } from "lodash";
import { map } from "../typings";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapView from "react-native-maps";

interface MapSearchProps {
  mapRef: React.MutableRefObject<MapView | null>;
}

const MapSearch = (props: MapSearchProps) => {
  const { mapRef } = props;
  const [locationTrigger, locationResult] = useLazyGetLocationQuery();
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const { data: locationData } = locationResult ?? {};
  const { predictions = [] } = locationData ?? {};
  const [hideSearch, setHideSearch] = useState(false);

  const [
    detailedLocationTrigger,
    detailedLocationResult,
  ] = useLazyGetDetailedLocationQuery();

  const { data: detailedLocationData } = detailedLocationResult ?? {};
  const { geometry } = detailedLocationData?.result ?? {};

  useEffect(() => {
    // Sets map location based on user selection

    if (mapRef.current && geometry) {
      const latitudeDelta =
        geometry.viewport.northeast.lat - geometry.viewport.southwest.lat;
      mapRef.current?.animateToRegion({
        latitude: geometry.location.lat,
        longitude: geometry.location.lng,
        latitudeDelta,
        longitudeDelta: latitudeDelta * ASPECT_RATIO,
      });
    }
  }, [geometry]);

  const onChangeText = useCallback((text: string) => {
    if (text.length > 3) {
      locationTrigger(text);
    }
  }, []);

  // debounce of 500 ms to prevent excessive API calls
  const onChangeTextDebounced = debounce(onChangeText, 500);

  const renderSeperator = () => <View style={styles.seperator} />;

  const onPress = useCallback((placeId: string) => {
    detailedLocationTrigger(placeId);
  }, []);

  const renderItem = (item: map.AutocompletePredictions, index: number) => {
    return (
      <Fragment key={index}>
        {index === 0 && renderSeperator()}
        <TouchableOpacity
          style={styles.item}
          onPress={() => onPress(item.place_id)}
          activeOpacity={0.5}
        >
          <Text>{item.description}</Text>
        </TouchableOpacity>
        {index !== predictions.length - 1 && renderSeperator()}
      </Fragment>
    );
  };

  const renderList = () => {
    return !hideSearch && <View>{predictions.map(renderItem)}</View>;
  };

  return (
    <View>
      <Input
        style={styles.input}
        placeholder="Search address"
        onChangeText={onChangeTextDebounced}
        onFocus={() => {
          setHideSearch(false);
        }}
        onBlur={() => {
          setHideSearch(true);
        }}
      />
      {renderList()}
    </View>
  );
};

const styles = StyleSheet.create({
  seperator: { backgroundColor: "black", flex: 1, height: 1 },
  input: {
    backgroundColor: "white",
    height: 50,
    padding: 10,
  },
  item: {
    backgroundColor: "#FFFF",
    padding: 10,
  },
});

export default MapSearch;
