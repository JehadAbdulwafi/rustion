import { Colors } from "@/constants/Colors";
import React from "react";
import { View as NativeView, TamaguiElement, ViewProps } from "tamagui";
import { useAppLanguage } from "@/hooks/app-preferences";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
};

export const View = React.forwardRef<TamaguiElement, ThemedViewProps>(
  ({ style, lightColor, darkColor, colorName, flexDirection = 'column', ...otherProps }, ref) => {
    const lang = useAppLanguage();
    const isRTL = lang === 'ar';

    const adjustedFlexDirection = (() => {
      if (flexDirection === 'row') {
        return isRTL ? 'row-reverse' : 'row';
      }
      if (flexDirection === 'row-reverse') {
        return isRTL ? 'row' : 'row-reverse';
      }
      return flexDirection;
    })();

    return (
      <NativeView
        ref={ref}
        style={[
          {
            // backgroundColor,
            flexDirection: adjustedFlexDirection
          },
          style
        ]}
        {...otherProps}
      />
    );
  }
);
