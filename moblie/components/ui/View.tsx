import useTheme from "@/hooks/useTheme";
import React from "react"; // Add this import
import { View as NativeView, TamaguiElement, ViewProps } from "tamagui";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

// Wrap the View component with React.forwardRef
export const View = React.forwardRef<TamaguiElement, ViewProps>(
  ({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps, ref) => {
    const backgroundColor = useTheme().getThemeColor({
      props: { light: lightColor, dark: darkColor },
      colorName: "background"
    });

    return (
      <NativeView
        ref={ref as React.Ref<TamaguiElement>}
        style={[{ backgroundColor }, style]}
        {...otherProps}
      />
    );
  }
);
