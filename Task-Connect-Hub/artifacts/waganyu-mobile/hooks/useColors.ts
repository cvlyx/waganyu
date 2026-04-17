import colors from "@/constants/colors";

/**
 * Returns the light theme design tokens.
 * Light mode is the default and only mode for now.
 * To enable dark mode, uncomment the useColorScheme logic.
 */
export function useColors() {
  // Force light mode — consistent, professional experience
  return { ...colors.light, radius: colors.radius };
}
