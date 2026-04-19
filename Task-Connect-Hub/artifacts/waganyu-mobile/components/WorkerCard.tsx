import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import type { WorkerProfile } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

interface Props { worker: WorkerProfile; horizontal?: boolean; }

export function WorkerCard({ worker, horizontal = false }: Props) {
  const C = useColors();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function handlePress() {
    scale.value = withSpring(0.98, { duration: 80 }, () => { scale.value = withSpring(1); });
    router.push(`/worker/${worker.id}` as any);
  }

  const initials = worker.name ? worker.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "??";

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.97}
        style={[s.card, horizontal && s.cardH, { backgroundColor: C.card, borderColor: C.border }]}
      >
        {/* Avatar + name */}
        <View style={s.topRow}>
          <View style={s.avatarWrap}>
            <View style={[s.avatar, { backgroundColor: C.primaryLight }]}>
              <Text style={[s.avatarText, { color: C.primary }]}>{initials}</Text>
            </View>
            {worker.isOnline && <View style={[s.onlineDot, { borderColor: C.card }]} />}
          </View>
          <View style={{ flex: 1 }}>
            <View style={s.nameRow}>
              <Text style={[s.name, { color: C.foreground }]} numberOfLines={1}>{worker.name}</Text>
              {worker.isVerified && <MaterialCommunityIcons name="check-decagram" size={13} color={C.primary} />}
            </View>
            <View style={s.ratingRow}>
              <Feather name="star" size={11} color={C.accent} />
              <Text style={[s.rating, { color: C.foreground }]}>{worker.rating.toFixed(1)}</Text>
              <Text style={[s.reviews, { color: C.mutedForeground }]}>({worker.reviewCount})</Text>
            </View>
          </View>
          {worker.badges[0] === "Top Rated" && (
            <View style={[s.topBadge, { backgroundColor: C.accentLight }]}>
              <Text style={[s.topBadgeText, { color: C.accent }]}>Top</Text>
            </View>
          )}
        </View>

        {/* Skills */}
        <View style={s.skillsRow}>
          {worker.skills.slice(0, horizontal ? 2 : 3).map((skill) => (
            <View key={skill} style={[s.skill, { backgroundColor: C.secondary }]}>
              <Text style={[s.skillText, { color: C.mutedForeground }]}>{skill}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={[s.footer, { borderTopColor: C.border }]}>
          <Text style={[s.rate, { color: C.primary }]}>MK {worker.hourlyRate.toLocaleString()}<Text style={[s.rateUnit, { color: C.mutedForeground }]}>/hr</Text></Text>
          <View style={s.jobsMeta}>
            <Feather name="check-circle" size={11} color={C.mutedForeground} />
            <Text style={[s.jobsText, { color: C.mutedForeground }]}>{worker.completedJobs} jobs</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  cardH: { width: 190, marginRight: 10, marginBottom: 0 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  avatarWrap: { position: "relative" },
  avatar: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 16, fontFamily: "Poppins_700Bold" },
  onlineDot: { position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: 6, backgroundColor: "#059669", borderWidth: 2 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 2 },
  name: { fontSize: 14, fontFamily: "Poppins_600SemiBold", flex: 1 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  rating: { fontSize: 12, fontFamily: "Poppins_600SemiBold" },
  reviews: { fontSize: 11, fontFamily: "Poppins_400Regular" },
  topBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  topBadgeText: { fontSize: 10, fontFamily: "Poppins_600SemiBold" },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginBottom: 10 },
  skill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  skillText: { fontSize: 11, fontFamily: "Poppins_500Medium" },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, paddingTop: 10 },
  rate: { fontSize: 14, fontFamily: "Poppins_700Bold" },
  rateUnit: { fontSize: 11, fontFamily: "Poppins_400Regular" },
  jobsMeta: { flexDirection: "row", alignItems: "center", gap: 3 },
  jobsText: { fontSize: 11, fontFamily: "Poppins_400Regular" },
});
