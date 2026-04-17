import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = 8, style }: SkeletonProps) {
  const C = useColors();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1,   { duration: 700, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius, backgroundColor: C.muted },
        animStyle,
        style,
      ]}
    />
  );
}

export function JobCardSkeleton() {
  const C = useColors();
  return (
    <View style={[sk.card, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={sk.topRow}>
        <Skeleton width={80} height={24} borderRadius={20} />
        <Skeleton width={50} height={24} borderRadius={20} />
      </View>
      <Skeleton width="90%" height={18} borderRadius={6} style={{ marginBottom: 8 }} />
      <Skeleton width="60%" height={14} borderRadius={6} style={{ marginBottom: 16 }} />
      <View style={sk.bottomRow}>
        <Skeleton width={120} height={12} borderRadius={6} />
        <Skeleton width={70} height={24} borderRadius={20} />
      </View>
    </View>
  );
}

export function WorkerCardSkeleton() {
  const C = useColors();
  return (
    <View style={[sk.card, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={sk.topRow}>
        <Skeleton width={44} height={44} borderRadius={12} />
        <View style={{ flex: 1, gap: 6 }}>
          <Skeleton width="60%" height={14} borderRadius={6} />
          <Skeleton width="40%" height={12} borderRadius={6} />
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 6, marginBottom: 12 }}>
        <Skeleton width={60} height={22} borderRadius={20} />
        <Skeleton width={60} height={22} borderRadius={20} />
        <Skeleton width={60} height={22} borderRadius={20} />
      </View>
      <View style={sk.bottomRow}>
        <Skeleton width={80} height={14} borderRadius={6} />
        <Skeleton width={60} height={12} borderRadius={6} />
      </View>
    </View>
  );
}

const sk = StyleSheet.create({
  card: { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 10 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
