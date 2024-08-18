import { Input } from "@ant-design/react-native";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  useLazyGetDetailedLocationQuery,
  useLazyGetLocationQuery,
} from "../src/api/mapApi";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Keyboard,
  ScrollView,
} from "react-native";
import { debounce } from "lodash";
import { map } from "../typings";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapView from "react-native-maps";
import { useAppDispatch, useAppSelector } from "../../main/src/hooks";
import { addSelectedMap } from "../src/redux/mapSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MAIN_APP_THEME } from "../../main/constants/themeConstants";

interface MapSearchProps {
  mapRef: React.MutableRefObject<MapView | null>;
}

const MapSearch = (props: MapSearchProps) => {
  const { mapRef } = props;
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const dispatch = useAppDispatch();
  const mapSearchedList = useAppSelector((state) => state.map.searchedList);

  const [locationTrigger, locationResult] = useLazyGetLocationQuery();
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
    if (text.length === 0) {
      setHideSearch(true);
    } else {
      setHideSearch(false);
    }
    setText(text);
    triggerSearchDebounced(text);
  }, []);

  const renderSeperator = () => <View style={styles.seperator} />;

  const onPress = useCallback((item: map.AutocompletePredictions) => {
    detailedLocationTrigger(item.place_id);
    setText(item.description);
    dispatch(
      addSelectedMap({
        place_id: item.place_id,
        description: item.description,
        isStored: true,
      })
    );
    setHideSearch(true);
    Keyboard.dismiss();
  }, []);

  const renderItem = (item: map.AutocompletePredictions, index: number) => {
    const icon = item.isStored ? "clockcircleo" : "search1";
    return (
      <Fragment key={index}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onPress(item);
          }}
        >
          <View
            style={{ backgroundColor: "white", padding: 10, borderRadius: 24 }}
          >
            <AntDesign name={icon} size={16} color={"black"} />
          </View>
          <Text style={{ marginEnd: 48 }}>{item.description}</Text>
        </TouchableOpacity>
      </Fragment>
    );
  };

  const renderList = () => {
    return (
      !hideSearch && (
        <ScrollView overScrollMode={"never"} alwaysBounceVertical={false}>
          {mapSearchedList.length > 0 && (
            <View style={styles.recentSearch}>
              <Text style={styles.recentSearchText}>Recent</Text>
              <View>{mapSearchedList.map(renderItem)}</View>
            </View>
          )}

          {predictions.length > 0 && (
            <View style={styles.searchContainer}>
              {predictions.map(renderItem)}
            </View>
          )}
        </ScrollView>
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
        clearButtonMode={"while-editing"}
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
    padding: 10,
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
  },
  searchContainer: {
    borderEndStartRadius: 16,
    borderEndEndRadius: 16,
    backgroundColor: "#e3e3e3",
    paddingHorizontal: 6,
  },
  recentSearch: {
    backgroundColor: "#e3e3e3",
    paddingHorizontal: 6,
  },
  recentSearchText: { padding: 10, color: "#8a8a8a" },
});

export default MapSearch;
