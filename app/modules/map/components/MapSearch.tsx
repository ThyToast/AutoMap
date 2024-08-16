import { Input } from "@ant-design/react-native";
import React, { useCallback } from "react";
import { useLazyGetLocationQuery } from "../src/api/mapApi";
import { View } from "react-native";
import { debounce } from "lodash";

const MapSearch = () => {
  const [trigger, result] = useLazyGetLocationQuery();
  const { data } = result ?? {};
  const { predictions = [] } = data ?? {};

  const onChangeText = useCallback((text: string) => {
    if (text.length > 3) {
      trigger(text);
    }
  }, []);

  // debounce of 500 ms to prevent excessive API calls
  const onChangeTextDebounced = debounce(onChangeText, 500);

  return (
    <View>
      <Input
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          height: 50,
          padding: 10,
        }}
        placeholder="Search address"
        onChangeText={onChangeTextDebounced}
        onFocus={() => {
          console.log("focused");
        }}
        onBlur={() => {
          console.log("blurred");
        }}
      />
    </View>
  );
};

export default MapSearch;
