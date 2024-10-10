import React from "react"; // Add this import
import { useThemeColor } from "@/hooks/useThemeColor";
import { View as NativeView, TamaguiElement, ViewProps } from "tamagui";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

// Wrap the View component with React.forwardRef
export const View = React.forwardRef<TamaguiElement, ViewProps>(
  ({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps, ref) => {
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "background"
    );

    return (
      <NativeView
        ref={ref as React.Ref<TamaguiElement>}
        style={[{ backgroundColor }, style]}
        {...otherProps}
      />
    );
  }
);
