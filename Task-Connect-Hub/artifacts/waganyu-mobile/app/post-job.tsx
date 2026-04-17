import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useData, type JobCategory } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const CATEGORIES: JobCategory[] = [
  "Plumbing", "Electrical", "Cleaning", "Carpentry",
  "Painting", "Moving", "Delivery", "Tutoring",
  "Cooking", "Gardening", "IT Support", "Other",
];

export default function PostJobScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addJob } = useData();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<JobCategory>("Plumbing");
  const [budget, setBudget] = useState("");
  const [budgetType, setBudgetType] = useState<"fixed" | "hourly">("fixed");
  const [location, setLocation] = useState(user?.location ?? "Lilongwe, Malawi");
  const [urgent, setUrgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handlePost() {
    if (!title.trim() || !description.trim() || !budget) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsLoading(true);
    try {
      addJob({
        title: title.trim(),
        description: description.trim(),
        category,
        budget: Number(budget),
        budgetType,
        location: location.trim(),
        posterId: user?.id ?? "1",
        posterName: user?.name ?? "You",
        posterRating: user?.rating ?? 5.0,
        urgent,
      });
      Alert.alert("Job Posted!", "Your job is now live and accepting applications.", [
        { text: "View Jobs", onPress: () => router.replace("/(tabs)") },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

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
    },
    backBtn: {
      width: 40, height: 40, borderRadius: 12,
      backgroundColor: colors.surface, justifyContent: "center", alignItems: "center",
      borderWidth: 1, borderColor: colors.border, marginRight: 12,
    },
    headerTitle: {
      fontSize: 18, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Poppins_700Bold",
    },
    scroll: { flex: 1 },
    content: { padding: 20 },
    label: {
      fontSize: 12, fontWeight: "600" as const, color: colors.mutedForeground,
      letterSpacing: 0.8, textTransform: "uppercase" as const,
      fontFamily: "Poppins_600SemiBold", marginBottom: 8, marginTop: 4,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 14, borderWidth: 1.5, borderColor: colors.border,
      paddingHorizontal: 16, paddingVertical: 14, marginBottom: 18,
      fontSize: 15, color: colors.foreground, fontFamily: "Poppins_400Regular",
    },
    textArea: {
      height: 100, textAlignVertical: "top" as const,
    },
    catGrid: {
      flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 18,
    },
    catBtn: {
      paddingHorizontal: 12, paddingVertical: 7,
      borderRadius: 10, borderWidth: 1.5,
    },
    catBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    catBtnInactive: { backgroundColor: colors.surface, borderColor: colors.border },
    catBtnText: {
      fontSize: 12, fontWeight: "600" as const, fontFamily: "Poppins_600SemiBold",
    },
    budgetRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
    budgetInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 14, borderWidth: 1.5, borderColor: colors.border,
      paddingHorizontal: 16, paddingVertical: 14,
      fontSize: 15, color: colors.foreground, fontFamily: "Poppins_400Regular",
    },
    budgetTypeRow: { flexDirection: "row", gap: 8 },
    budgetTypeBtn: {
      paddingHorizontal: 14, paddingVertical: 10,
      borderRadius: 12, borderWidth: 1.5,
    },
    budgetTypeBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    budgetTypeBtnInactive: { backgroundColor: colors.surface, borderColor: colors.border },
    budgetTypeBtnText: {
      fontSize: 13, fontWeight: "600" as const, fontFamily: "Poppins_600SemiBold",
    },
    urgentToggle: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      backgroundColor: urgent ? "#E53E3E12" : colors.surface,
      borderRadius: 14, padding: 16,
      borderWidth: 1.5, borderColor: urgent ? "#E53E3E" : colors.border,
      marginBottom: 24,
    },
    urgentLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    urgentLabel: {
      fontSize: 15, fontWeight: "600" as const, color: urgent ? "#E53E3E" : colors.foreground,
      fontFamily: "Poppins_600SemiBold",
    },
    urgentDesc: {
      fontSize: 12, color: colors.mutedForeground, fontFamily: "Poppins_400Regular",
    },
    toggle: {
      width: 48, height: 28, borderRadius: 14,
      justifyContent: "center",
      backgroundColor: urgent ? "#E53E3E" : colors.muted,
      paddingHorizontal: 2,
    },
    toggleKnob: {
      width: 22, height: 22, borderRadius: 11,
      backgroundColor: "#FFFFFF",
      alignSelf: urgent ? "flex-end" : "flex-start",
    },
    postBtn: {
      backgroundColor: colors.primary, borderRadius: 14,
      height: 56, justifyContent: "center", alignItems: "center",
      flexDirection: "row", gap: 8,
    },
    postBtnText: {
      fontSize: 16, fontWeight: "700" as const, color: "#FFFFFF", fontFamily: "Poppins_700Bold",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a Job</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.scroll}
      >
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.duration(400)} style={styles.content}>
            <Text style={styles.label}>Job Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Fix leaking kitchen sink"
              placeholderTextColor={colors.mutedForeground}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what needs to be done, any requirements, timeline..."
              placeholderTextColor={colors.mutedForeground}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.catGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catBtn,
                    category === cat ? styles.catBtnActive : styles.catBtnInactive,
                  ]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.catBtnText,
                      { color: category === cat ? "#FFFFFF" : colors.mutedForeground },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Budget (MK) *</Text>
            <View style={styles.budgetRow}>
              <TextInput
                style={styles.budgetInput}
                placeholder="e.g. 5000"
                placeholderTextColor={colors.mutedForeground}
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
              />
              <View style={styles.budgetTypeRow}>
                {(["fixed", "hourly"] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.budgetTypeBtn,
                      budgetType === type ? styles.budgetTypeBtnActive : styles.budgetTypeBtnInactive,
                    ]}
                    onPress={() => setBudgetType(type)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.budgetTypeBtnText,
                        { color: budgetType === type ? "#FFFFFF" : colors.mutedForeground },
                      ]}
                    >
                      {type === "fixed" ? "Fixed" : "Hourly"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Area 47, Lilongwe"
              placeholderTextColor={colors.mutedForeground}
              value={location}
              onChangeText={setLocation}
            />

            <Text style={styles.label}>Urgency</Text>
            <TouchableOpacity
              style={styles.urgentToggle}
              onPress={() => {
                Haptics.selectionAsync();
                setUrgent(!urgent);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.urgentLeft}>
                <Feather
                  name="zap"
                  size={20}
                  color={urgent ? "#E53E3E" : colors.mutedForeground}
                />
                <View>
                  <Text style={styles.urgentLabel}>Mark as Urgent</Text>
                  <Text style={styles.urgentDesc}>Gets priority visibility</Text>
                </View>
              </View>
              <View style={styles.toggle}>
                <View style={styles.toggleKnob} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.postBtn, isLoading && { opacity: 0.6 }]}
              onPress={handlePost}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Feather name="plus-circle" size={20} color="#FFFFFF" />
              <Text style={styles.postBtnText}>
                {isLoading ? "Posting..." : "Post Job"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
