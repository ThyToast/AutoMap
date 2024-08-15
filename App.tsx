import React from "react";
import { Provider } from "react-redux";
import { Provider as ThemeProvider } from "@ant-design/react-native";
import { store } from "./app/modules/main/src/store";
import MapScreen from "./app/modules/map/views/MapScreen";

import { SafeAreaView } from "react-native";
import { StyleSheet } from "react-native";
import { MAIN_APP_THEME } from "./app/modules/main/constants/themeConstants";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={MAIN_APP_THEME}>
        <SafeAreaView style={styles.container}>
          <MapScreen />
        </SafeAreaView>
      </ThemeProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MAIN_APP_THEME.brand_primary },
});

export default App;
