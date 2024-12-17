import { Text as NativeText, type TextProps } from "tamagui";
import { useAppLanguage } from "@/hooks/app-preferences";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  textAlign?: 'left' | 'right' | 'center' | 'auto' | 'justify';
};

export function Text({ style, lightColor, darkColor, textAlign = 'auto', ...rest }: ThemedTextProps) {
  const lang = useAppLanguage();
  const isRTL = lang === 'ar';

  const adjustedTextAlign = (() => {
    if (textAlign === 'auto') {
      return isRTL ? 'right' : 'left';
    }
    return textAlign;
  })();

  return (
    <NativeText
      style={[
        { 
          textAlign: adjustedTextAlign 
        },
        style,
      ]}
      {...rest}
    />
  );
}


// const styles = StyleSheet.create({
//   default: {
//     fontSize: 16,
//     lineHeight: 24,
//   },
//   defaultSemiBold: {
//     fontSize: 16,
//     lineHeight: 24,
//     fontWeight: "600",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     lineHeight: 32,
//   },
//   subtitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   link: {
//     lineHeight: 30,
//     fontSize: 16,
//     color: "#0a7ea4",
//   },
// });
