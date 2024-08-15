import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MAP_API_KEY } from "../constants/mapConstants";
import { StyleSheet, View } from "react-native";
import { Button } from "@ant-design/react-native";

const MapScreen = () => {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        query={{
          key: MAP_API_KEY,
          language: "en",
        }}
        onPress={(data, details = null) => console.log(data)}
        onFail={(error) => console.error(error)}
      />
      <Button type="primary">Hello</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ecf0f1",
    height: "100%",
  },
});

export default MapScreen;
