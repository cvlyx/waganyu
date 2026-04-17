import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import { formatBudget, formatDate, formatTimeAgo } from "@/utils/format";

export default function JobDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { jobs, savedJobs, toggleSaveJob } = useData();
  const job = jobs.find((j) => j.id === id);
  const [applied, setApplied] = useState(false);

  if (!job) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <Text style={{ color: colors.foreground, fontFamily: "Poppins_400Regular" }}>Job not found</Text>
      </View>
    );
  }

  const isSaved = savedJobs.includes(job.id);

  function handleApply() {
    if (applied) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setApplied(true);
    Alert.alert("Application Sent!", "The job poster will contact you soon.");
  }

  function handleSave() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSaveJob(job.id);
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: Platform.OS === "web" ? 67 : insets.top + 8,
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Poppins_700Bold",
    },
    saveBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    scroll: { flex: 1 },
    content: { padding: 20 },
    categoryBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: colors.primary + "18",
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 8,
      gap: 5,
      marginBottom: 12,
    },
    categoryText: {
      fontSize: 13,
      fontWeight: "600" as const,
      color: colors.primary,
      fontFamily: "Poppins_600SemiBold",
    },
    urgentBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: "#E53E3E18",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 4,
      marginLeft: 8,
    },
    urgentText: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: "#E53E3E",
      fontFamily: "Poppins_600SemiBold",
    },
    badgesRow: { flexDirection: "row", marginBottom: 12 },
    title: {
      fontSize: 22,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Poppins_700Bold",
      lineHeight: 30,
      marginBottom: 16,
    },
    statsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 24,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: colors.secondary,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
    },
    statText: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Poppins_400Regular",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Poppins_700Bold",
      marginBottom: 10,
    },
    description: {
      fontSize: 14,
      color: colors.foreground,
      lineHeight: 22,
      fontFamily: "Poppins_400Regular",
      marginBottom: 24,
    },
    skillsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 24,
    },
    skill: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    skillText: {
      fontSize: 13,
      color: colors.foreground,
      fontFamily: "Poppins_500Medium",
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: 20,
    },
    posterCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
    },
    posterAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.muted,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    posterAvatarText: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.mutedForeground,
      fontFamily: "Poppins_700Bold",
    },
    posterInfo: { flex: 1 },
    posterName: {
      fontSize: 15,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Poppins_700Bold",
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 2,
    },
    ratingText: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Poppins_400Regular",
    },
    messageBtn: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
    },
    messageBtnText: {
      fontSize: 13,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Poppins_600SemiBold",
    },
    budgetCard: {
      backgroundColor: colors.primary + "12",
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.primary + "30",
      marginBottom: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    budgetLabel: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: "Poppins_400Regular",
    },
    budget: {
      fontSize: 24,
      fontWeight: "700" as const,
      color: colors.primary,
      fontFamily: "Poppins_700Bold",
    },
    budgetType: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: "Poppins_400Regular",
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    applyBtn: {
      borderRadius: 14,
      height: 56,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
    },
    applyBtnText: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: "#FFFFFF",
      fontFamily: "Poppins_700Bold",
    },
  });

  const posterInitials = job.posterName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={20}
            color={isSaved ? colors.primary : colors.foreground}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(400)}>
            <View style={styles.badgesRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{job.category}</Text>
              </View>
              {job.urgent && (
                <View style={styles.urgentBadge}>
                  <Feather name="zap" size={12} color="#E53E3E" />
                  <Text style={styles.urgentText}>Urgent</Text>
                </View>
              )}
            </View>

            <Text style={styles.title}>{job.title}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Feather name="map-pin" size={13} color={colors.mutedForeground} />
                <Text style={styles.statText}>{job.location}</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="account-group-outline" size={15} color={colors.mutedForeground} />
                <Text style={styles.statText}>{job.applicants} applicants</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="clock" size={13} color={colors.mutedForeground} />
                <Text style={styles.statText}>{formatTimeAgo(job.createdAt)}</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="calendar" size={13} color={colors.mutedForeground} />
                <Text style={styles.statText}>{formatDate(job.createdAt)}</Text>
              </View>
            </View>

            <View style={styles.budgetCard}>
              <View>
                <Text style={styles.budgetLabel}>Budget</Text>
                <Text style={styles.budget}>
                  MK {job.budget.toLocaleString()}
                </Text>
                <Text style={styles.budgetType}>
                  {job.budgetType === "hourly" ? "per hour" : "fixed price"}
                </Text>
              </View>
              <Feather name="dollar-sign" size={40} color={colors.primary + "40"} />
            </View>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{job.description}</Text>

            {job.skills && job.skills.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Skills Required</Text>
                <View style={styles.skillsRow}>
                  {job.skills.map((skill) => (
                    <View key={skill} style={styles.skill}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Posted By</Text>
            <View style={styles.posterCard}>
              <View style={styles.posterAvatar}>
                <Text style={styles.posterAvatarText}>{posterInitials}</Text>
              </View>
              <View style={styles.posterInfo}>
                <Text style={styles.posterName}>{job.posterName}</Text>
                <View style={styles.ratingRow}>
                  <FontAwesome name="star" size={12} color={colors.star} />
                  <Text style={styles.ratingText}>{job.posterRating.toFixed(1)} rating</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.messageBtn}>
                <Text style={styles.messageBtnText}>Message</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.applyBtn,
            {
              backgroundColor: applied ? colors.muted : colors.primary,
            },
          ]}
          onPress={handleApply}
          disabled={applied}
          activeOpacity={0.85}
        >
          {applied ? (
            <>
              <Feather name="check" size={20} color={colors.mutedForeground} />
              <Text style={[styles.applyBtnText, { color: colors.mutedForeground }]}>
                Application Sent
              </Text>
            </>
          ) : (
            <>
              <Feather name="send" size={18} color="#FFFFFF" />
              <Text style={styles.applyBtnText}>Apply Now</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
