import { Colors } from "@/constants/Colors";
import useTheme from "@/hooks/useTheme";
import React from "react"; // Add this import
import { View as NativeView, TamaguiElement, ViewProps } from "tamagui";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark;
};

// Wrap the View component with React.forwardRef
export const View = React.forwardRef<TamaguiElement, ViewProps>(
  ({ style, lightColor, darkColor, colorName, ...otherProps }: ThemedViewProps, ref) => {
    const backgroundColor = useTheme().getThemeColor({
      props: { light: lightColor, dark: darkColor },
      colorName: colorName ? colorName : "background"
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
