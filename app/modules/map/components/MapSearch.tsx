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
  const [text, setText] = useState("");

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

  const triggerSearch = useCallback((text: string) => {
    if (text.length > 3) {
      locationTrigger(text);
    }
  }, []);

  // debounce of 500 ms to prevent excessive API calls
  const triggerSearchDebounced = debounce(triggerSearch, 500);

  const onTextChanged = useCallback((text: string) => {
    setText(text);
    triggerSearchDebounced(text);
  }, []);

  const renderSeperator = () => <View style={styles.seperator} />;

  const onPress = useCallback((item: map.AutocompletePredictions) => {
    detailedLocationTrigger(item.place_id);
    setText(item.description);
    setHideSearch(true);
  }, []);

  const renderItem = (item: map.AutocompletePredictions, index: number) => {
    return (
      <Fragment key={index}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onPress(item);
          }}
        >
          <Text>{item.description}</Text>
        </TouchableOpacity>
        {index !== predictions.length - 1 && renderSeperator()}
      </Fragment>
    );
  };

  const renderList = () => {
    return (
      !hideSearch && (
        <View style={styles.searchContainer}>
          {predictions.map(renderItem)}
        </View>
      )
    );
  };

  return (
    <View>
      <Input
        style={styles.input}
        placeholder="Search address"
        onChangeText={onTextChanged}
        value={text}
        onFocus={() => {
          setHideSearch(false);
        }}
        onBlur={() => {
          setHideSearch(true);
        }}
      />
      {renderSeperator()}

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
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
  },
  item: {
    backgroundColor: "#FFFF",
    padding: 10,
    paddingVertical: 20,
  },
  searchContainer: {
    borderEndStartRadius: 16,
    borderEndEndRadius: 16,
    backgroundColor: "white",
  },
});

export default MapSearch;
