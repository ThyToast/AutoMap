import { Drawer } from "@ant-design/react-native";
import React from "react";
import { FC, PropsWithChildren } from "react";
import { View } from "react-native";

interface DrawerComponentProps {
  renderDrawer: () => React.JSX.Element;
  drawerRef: React.MutableRefObject<Drawer | null>;
}

const DrawerComponent: FC<PropsWithChildren<DrawerComponentProps>> = (
  props
) => {
  const { renderDrawer, drawerRef, children } = props;
  return (
    <Drawer
      sidebar={renderDrawer()}
      position="left"
      open={false}
      drawerBackgroundColor="#ccc"
      ref={drawerRef}
    >
      <View>{children}</View>
    </Drawer>
  );
};

export default DrawerComponent;
