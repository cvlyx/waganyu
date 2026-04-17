/**
 * Waganyu Design System
 * Primary palette: Deep Emerald + Warm White + Slate
 * Light mode is the default and primary experience.
 */
const colors = {
  light: {
    // Backgrounds
    background:       "#FAFAFA",
    surface:          "#FFFFFF",
    surfaceElevated:  "#FFFFFF",
    card:             "#FFFFFF",
    cardForeground:   "#0F172A",

    // Text
    foreground:       "#0F172A",
    text:             "#0F172A",
    mutedForeground:  "#64748B",

    // Brand — deep emerald
    primary:          "#059669",
    primaryForeground:"#FFFFFF",
    primaryLight:     "#D1FAE5",
    primaryMid:       "#6EE7B7",

    // Accent — rich amber (used sparingly)
    accent:           "#D97706",
    accentForeground: "#FFFFFF",
    accentLight:      "#FEF3C7",

    // Secondary surfaces
    secondary:        "#F1F5F9",
    secondaryForeground: "#0F172A",
    muted:            "#F8FAFC",

    // Semantic
    destructive:      "#DC2626",
    destructiveForeground: "#FFFFFF",
    warning:          "#D97706",
    info:             "#2563EB",
    infoLight:        "#EFF6FF",
    star:             "#D97706",
    online:           "#059669",

    // Borders
    border:           "#E2E8F0",
    borderStrong:     "#CBD5E1",
    input:            "#E2E8F0",

    // Tab bar
    tabBar:           "#FFFFFF",
    tabBarBorder:     "#E2E8F0",
    tint:             "#059669",

    // Misc
    glass:            "rgba(255,255,255,0.85)",
    overlay:          "rgba(15,23,42,0.04)",
  },
  dark: {
    background:       "#0A0F1E",
    surface:          "#111827",
    surfaceElevated:  "#1F2937",
    card:             "#111827",
    cardForeground:   "#F9FAFB",
    foreground:       "#F9FAFB",
    text:             "#F9FAFB",
    mutedForeground:  "#9CA3AF",
    primary:          "#10B981",
    primaryForeground:"#FFFFFF",
    primaryLight:     "#064E3B",
    primaryMid:       "#065F46",
    accent:           "#F59E0B",
    accentForeground: "#FFFFFF",
    accentLight:      "#451A03",
    secondary:        "#1F2937",
    secondaryForeground: "#F9FAFB",
    muted:            "#1F2937",
    destructive:      "#EF4444",
    destructiveForeground: "#FFFFFF",
    warning:          "#F59E0B",
    info:             "#3B82F6",
    infoLight:        "#1E3A5F",
    star:             "#F59E0B",
    online:           "#10B981",
    border:           "#1F2937",
    borderStrong:     "#374151",
    input:            "#1F2937",
    tabBar:           "#0A0F1E",
    tabBarBorder:     "#1F2937",
    tint:             "#10B981",
    glass:            "rgba(17,24,39,0.9)",
    overlay:          "rgba(0,0,0,0.3)",
  },
  radius: 12,
};

export default colors;
