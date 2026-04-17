import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { useData, type Job } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";
import { formatBudget, formatTimeAgo } from "@/utils/format";

interface Props { job: Job; compact?: boolean; }

export function JobCard({ job, compact = false }: Props) {
  const C = useColors();
  const { savedJobs, toggleSaveJob } = useData();
  const isSaved = savedJobs.includes(job.id);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function handlePress() {
    scale.value = withSpring(0.98, { duration: 80 }, () => { scale.value = withSpring(1); });
    router.push(`/job/${job.id}` as any);
  }

  return (
    <Animated.View style={[animStyle, { marginBottom: 10 }]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.97}
        style={[s.card, { backgroundColor: C.card, borderColor: C.border }]}
      >
        {/* Header row */}
        <View style={s.headerRow}>
          <View style={[s.catPill, { backgroundColor: C.primaryLight }]}>
            <Text style={[s.catText, { color: C.primary }]}>{job.category}</Text>
          </View>
          <View style={s.headerRight}>
            {job.urgent && (
              <View style={s.urgentPill}>
                <Feather name="zap" size={10} color="#DC2626" />
                <Text style={s.urgentText}>Urgent</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleSaveJob(job.id); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={19} color={isSaved ? C.primary : C.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <Text style={[s.title, { color: C.foreground }]} numberOfLines={2}>{job.title}</Text>
        {!compact && <Text style={[s.desc, { color: C.mutedForeground }]} numberOfLines={2}>{job.description}</Text>}

        {/* Footer */}
        <View style={[s.footer, { borderTopColor: C.border }]}>
          <View style={s.meta}>
            <View style={s.metaItem}>
              <Feather name="map-pin" size={11} color={C.mutedForeground} />
              <Text style={[s.metaText, { color: C.mutedForeground }]} numberOfLines={1}>{job.distance ? `${job.distance}km` : job.location.split(",")[0]}</Text>
            </View>
            <View style={s.metaItem}>
              <Feather name="users" size={11} color={C.mutedForeground} />
              <Text style={[s.metaText, { color: C.mutedForeground }]}>{job.applicants} applied</Text>
            </View>
            <View style={s.metaItem}>
              <Feather name="clock" size={11} color={C.mutedForeground} />
              <Text style={[s.metaText, { color: C.mutedForeground }]}>{formatTimeAgo(job.createdAt)}</Text>
            </View>
          </View>
          <Text style={[s.budget, { color: C.primary }]}>{formatBudget(job.budget, job.budgetType)}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 14, padding: 16, borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  catPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  catText: { fontSize: 11, fontFamily: "Poppins_600SemiBold" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  urgentPill: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#FEE2E2", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  urgentText: { fontSize: 10, fontFamily: "Poppins_600SemiBold", color: "#DC2626" },
  title: { fontSize: 15, fontFamily: "Poppins_600SemiBold", lineHeight: 22, marginBottom: 4 },
  desc: { fontSize: 13, fontFamily: "Poppins_400Regular", lineHeight: 19, marginBottom: 12 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, paddingTop: 12, marginTop: 8 },
  meta: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontSize: 11, fontFamily: "Poppins_400Regular" },
  budget: { fontSize: 15, fontFamily: "Poppins_700Bold" },
});
