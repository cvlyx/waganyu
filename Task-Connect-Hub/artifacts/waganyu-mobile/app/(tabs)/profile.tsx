import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { formatDate } from "@/utils/format";

const ROLE_LABEL: Record<string, string> = { poster: "Job Poster", worker: "Worker", skilled: "Skilled Professional" };

function MenuItem({ icon, label, value, onPress, danger = false }: { icon: string; label: string; value?: string; onPress: () => void; danger?: boolean }) {
  const C = useColors();
  return (
    <TouchableOpacity style={[s.menuItem, { borderBottomColor: C.border }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[s.menuIcon, { backgroundColor: danger ? "#FEE2E2" : C.secondary }]}>
        <Feather name={icon as any} size={16} color={danger ? C.destructive : C.foreground} />
      </View>
      <Text style={[s.menuLabel, { color: danger ? C.destructive : C.foreground }]}>{label}</Text>
      {value && <Text style={[s.menuValue, { color: C.mutedForeground }]}>{value}</Text>}
      {!danger && <Feather name="chevron-right" size={15} color={C.mutedForeground} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const C = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) ?? "U";

  function handleLogout() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: async () => { await logout(); router.replace("/(auth)/login"); } },
    ]);
  }

  return (
    <View style={[s.root, { backgroundColor: C.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 100 : 90 }}>

        {/* Hero */}
        <LinearGradient colors={["#059669", "#047857"]} style={[s.hero, { paddingTop: topInset + 20 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Animated.View entering={FadeInDown.delay(50).duration(400)} style={s.avatarWrap}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
            <TouchableOpacity style={s.cameraBtn}>
              <Feather name="camera" size={12} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={{ alignItems: "center" }}>
            <Text style={s.heroName}>{user?.name}</Text>
            <View style={s.rolePill}>
              <Text style={s.roleText}>{ROLE_LABEL[user?.role ?? "worker"]}</Text>
            </View>
            <Text style={s.heroLocation}>{user?.location}</Text>
            {user?.isVerified && (
              <View style={s.verifiedBadge}>
                <MaterialCommunityIcons name="check-decagram" size={13} color="#059669" />
                <Text style={s.verifiedText}>Verified Professional</Text>
              </View>
            )}
          </Animated.View>
        </LinearGradient>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={[s.statsCard, { backgroundColor: C.card, borderColor: C.border }]}>
          {[
            { v: user?.rating?.toFixed(1) ?? "—", l: "Rating",  icon: "star"      },
            { v: user?.reviewCount ?? 0,           l: "Reviews", icon: "message-square" },
            { v: user?.role === "poster" ? user?.jobsPosted ?? 0 : user?.jobsDone ?? 0, l: user?.role === "poster" ? "Posted" : "Done", icon: "briefcase" },
          ].map((st, i) => (
            <View key={i} style={[s.stat, i < 2 && { borderRightWidth: 1, borderRightColor: C.border }]}>
              <Text style={[s.statVal, { color: C.foreground }]}>{st.v}</Text>
              <Text style={[s.statLbl, { color: C.mutedForeground }]}>{st.l}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Menu */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={[s.sectionLabel, { color: C.mutedForeground }]}>Account</Text>
          <View style={[s.menuSection, { backgroundColor: C.card, borderColor: C.border }]}>
            <MenuItem icon="user" label="Edit Profile" onPress={() => {}} />
            <MenuItem icon="map-pin" label="Location" value={user?.location} onPress={() => {}} />
            <MenuItem icon="bell" label="Notifications" onPress={() => {}} />
            <MenuItem icon="shield" label="Privacy & Security" onPress={() => {}} />
          </View>

          <Text style={[s.sectionLabel, { color: C.mutedForeground }]}>Support</Text>
          <View style={[s.menuSection, { backgroundColor: C.card, borderColor: C.border }]}>
            <MenuItem icon="help-circle" label="Help Center" onPress={() => {}} />
            <MenuItem icon="star" label="Rate Waganyu" onPress={() => {}} />
            <MenuItem icon="info" label="About" value="v1.0.0" onPress={() => {}} />
          </View>

          <View style={[s.menuSection, { backgroundColor: C.card, borderColor: C.border, marginHorizontal: 20, marginTop: 8 }]}>
            <MenuItem icon="log-out" label="Logout" onPress={handleLogout} danger />
          </View>
        </Animated.View>

        <Text style={[s.footer, { color: C.mutedForeground }]}>Member since {user?.joinedDate ? formatDate(user.joinedDate) : "—"}</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  hero: { alignItems: "center", paddingBottom: 28, paddingHorizontal: 20 },
  avatarWrap: { position: "relative", marginBottom: 12 },
  avatar: { width: 84, height: 84, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center", borderWidth: 2.5, borderColor: "rgba(255,255,255,0.4)" },
  avatarText: { fontSize: 30, fontFamily: "Poppins_700Bold", color: "#fff" },
  cameraBtn: { position: "absolute", bottom: 0, right: 0, backgroundColor: "rgba(0,0,0,0.35)", width: 26, height: 26, borderRadius: 13, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#fff" },
  heroName: { fontSize: 20, fontFamily: "Poppins_700Bold", color: "#fff", marginBottom: 6 },
  rolePill: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 4 },
  roleText: { fontSize: 12, fontFamily: "Poppins_500Medium", color: "#fff" },
  heroLocation: { fontSize: 12, fontFamily: "Poppins_400Regular", color: "rgba(255,255,255,0.75)", marginBottom: 8 },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  verifiedText: { fontSize: 11, fontFamily: "Poppins_600SemiBold", color: "#059669" },
  statsCard: { flexDirection: "row", marginHorizontal: 20, marginTop: -1, borderRadius: 14, borderWidth: 1, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  stat: { flex: 1, alignItems: "center", paddingVertical: 16 },
  statVal: { fontSize: 20, fontFamily: "Poppins_700Bold" },
  statLbl: { fontSize: 11, fontFamily: "Poppins_400Regular", marginTop: 2 },
  sectionLabel: { fontSize: 11, fontFamily: "Poppins_600SemiBold", letterSpacing: 0.8, textTransform: "uppercase", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  menuSection: { borderRadius: 14, borderWidth: 1, marginHorizontal: 20, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 13, paddingHorizontal: 16, borderBottomWidth: 1 },
  menuIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 14, fontFamily: "Poppins_500Medium" },
  menuValue: { fontSize: 13, fontFamily: "Poppins_400Regular", marginRight: 6 },
  footer: { textAlign: "center", fontSize: 11, fontFamily: "Poppins_400Regular", marginTop: 20, paddingBottom: 4 },
});
