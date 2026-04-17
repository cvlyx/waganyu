import { Feather, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

export default function WorkerDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workers } = useData();
  const worker = workers.find((w) => w.id === id);

  if (!worker) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <Text style={{ color: colors.foreground, fontFamily: "Poppins_400Regular" }}>Worker not found</Text>
      </View>
    );
  }

  const initials = worker.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: Platform.OS === "web" ? 67 : insets.top + 8,
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      justifyContent: "space-between",
    },
    backBtn: {
      width: 40, height: 40, borderRadius: 12,
      backgroundColor: colors.surface, justifyContent: "center", alignItems: "center",
      borderWidth: 1, borderColor: colors.border,
    },
    headerTitle: {
      fontSize: 17, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Poppins_700Bold",
    },
    headerSpacer: { width: 40 },
    scroll: { flex: 1 },
    profileSection: {
      alignItems: "center",
      padding: 28,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatarContainer: { position: "relative", marginBottom: 14 },
    avatar: {
      width: 90, height: 90, borderRadius: 45,
      backgroundColor: colors.primary + "20",
      justifyContent: "center", alignItems: "center",
      borderWidth: 3, borderColor: colors.primary,
    },
    avatarText: {
      fontSize: 32, fontWeight: "700" as const, color: colors.primary, fontFamily: "Poppins_700Bold",
    },
    onlineDot: {
      position: "absolute", bottom: 4, right: 4,
      width: 18, height: 18, borderRadius: 9,
      backgroundColor: colors.online,
      borderWidth: 3, borderColor: colors.card,
    },
    name: {
      fontSize: 22, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Poppins_700Bold",
      marginBottom: 6, flexDirection: "row", alignItems: "center",
    },
    nameText: {
      fontSize: 22, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Poppins_700Bold",
    },
    ratingRow: {
      flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 10,
    },
    ratingText: {
      fontSize: 16, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Poppins_700Bold",
    },
    reviewCount: {
      fontSize: 13, color: colors.mutedForeground, fontFamily: "Poppins_400Regular",
    },
    badgesRow: {
      flexDirection: "row", flexWrap: "wrap", gap: 6, justifyContent: "center",
    },
    badge: {
      flexDirection: "row", alignItems: "center", gap: 4,
      backgroundColor: colors.star + "20",
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    },
    badgeText: {
      fontSize: 11, fontWeight: "600" as const, color: colors.star, fontFamily: "Poppins_600SemiBold",
    },
    statsRow: {
      flexDirection: "row",
      borderBottomWidth: 1, borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    stat: {
      flex: 1, alignItems: "center", paddingVertical: 16,
      borderRightWidth: 1, borderRightColor: colors.border,
    },
    statLast: { borderRightWidth: 0 },
    statValue: {
      fontSize: 18, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Poppins_700Bold",
    },
    statLabel: {
      fontSize: 11, color: colors.mutedForeground, fontFamily: "Poppins_400Regular",
    },
    section: { padding: 20 },
    sectionTitle: {
      fontSize: 16, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Poppins_700Bold",
      marginBottom: 10,
    },
    bio: {
      fontSize: 14, color: colors.foreground, lineHeight: 22, fontFamily: "Poppins_400Regular",
    },
    skillsRow: {
      flexDirection: "row", flexWrap: "wrap", gap: 8,
    },
    skill: {
      flexDirection: "row", alignItems: "center", gap: 5,
      backgroundColor: colors.secondary,
      paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
    },
    skillText: {
      fontSize: 13, color: colors.foreground, fontFamily: "Poppins_500Medium",
    },
    divider: { height: 1, backgroundColor: colors.border },
    rateCard: {
      backgroundColor: colors.primary + "12",
      borderRadius: 14, padding: 16,
      borderWidth: 1, borderColor: colors.primary + "30",
      flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    },
    rateLabel: {
      fontSize: 13, color: colors.primary, fontFamily: "Poppins_400Regular",
    },
    rate: {
      fontSize: 24, fontWeight: "700" as const, color: colors.primary, fontFamily: "Poppins_700Bold",
    },
    rateUnit: {
      fontSize: 13, color: colors.primary, fontFamily: "Poppins_400Regular",
    },
    metaCard: {
      backgroundColor: colors.card, borderRadius: 14, padding: 14,
      borderWidth: 1, borderColor: colors.border, gap: 10,
    },
    metaItem: {
      flexDirection: "row", alignItems: "center", gap: 10,
    },
    metaText: {
      fontSize: 14, color: colors.foreground, fontFamily: "Poppins_400Regular",
    },
    footer: {
      flexDirection: "row", gap: 12,
      paddingHorizontal: 20,
      paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16,
      paddingTop: 12,
      borderTopWidth: 1, borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    msgBtn: {
      flex: 1, height: 52, borderRadius: 14,
      justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 8,
      backgroundColor: colors.secondary,
      borderWidth: 1.5, borderColor: colors.border,
    },
    msgBtnText: {
      fontSize: 15, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Poppins_700Bold",
    },
    hireBtn: {
      flex: 2, height: 52, borderRadius: 14,
      justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 8,
      backgroundColor: colors.primary,
    },
    hireBtnText: {
      fontSize: 15, fontWeight: "700" as const, color: "#FFFFFF", fontFamily: "Poppins_700Bold",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Professional Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              {worker.isOnline && <View style={styles.onlineDot} />}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Text style={styles.nameText}>{worker.name}</Text>
              {worker.isVerified && (
                <MaterialCommunityIcons name="check-decagram" size={20} color={colors.primary} />
              )}
            </View>

            <View style={styles.ratingRow}>
              <FontAwesome name="star" size={16} color={colors.star} />
              <Text style={styles.ratingText}>{worker.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({worker.reviewCount} reviews)</Text>
            </View>

            <View style={styles.badgesRow}>
              {worker.badges.map((badge) => (
                <View key={badge} style={styles.badge}>
                  <Feather name="award" size={11} color={colors.star} />
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{worker.completedJobs}</Text>
              <Text style={styles.statLabel}>Jobs Done</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{worker.responseTime}</Text>
              <Text style={styles.statLabel}>Response</Text>
            </View>
            <View style={[styles.stat, styles.statLast]}>
              <Text style={styles.statValue}>{worker.isOnline ? "Online" : "Offline"}</Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{worker.bio}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills & Expertise</Text>
            <View style={styles.skillsRow}>
              {worker.skills.map((skill) => (
                <View key={skill} style={styles.skill}>
                  <Feather name="check-circle" size={13} color={colors.primary} />
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rate & Availability</Text>
            <View style={styles.rateCard}>
              <View>
                <Text style={styles.rateLabel}>Hourly Rate</Text>
                <Text style={styles.rate}>MK {worker.hourlyRate.toLocaleString()}</Text>
                <Text style={styles.rateUnit}>per hour</Text>
              </View>
              <Feather name="clock" size={36} color={colors.primary + "40"} />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.metaCard}>
              <View style={styles.metaItem}>
                <Feather name="map-pin" size={16} color={colors.primary} />
                <Text style={styles.metaText}>{worker.location}</Text>
              </View>
              <View style={styles.metaItem}>
                <Feather name="clock" size={16} color={colors.primary} />
                <Text style={styles.metaText}>Responds in {worker.responseTime}</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="briefcase-check-outline" size={16} color={colors.primary} />
                <Text style={styles.metaText}>{worker.completedJobs} jobs completed</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.msgBtn} activeOpacity={0.8}>
          <Feather name="message-circle" size={18} color={colors.foreground} />
          <Text style={styles.msgBtnText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.hireBtn} activeOpacity={0.85}>
          <Feather name="user-check" size={18} color="#FFFFFF" />
          <Text style={styles.hireBtnText}>Hire Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
