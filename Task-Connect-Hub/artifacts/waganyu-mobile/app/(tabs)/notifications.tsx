import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useData, type Notification } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";
import { formatTimeAgo } from "@/utils/format";

const NOTIF: Record<string, { icon: string; bg: string; color: string }> = {
  application: { icon: "account-check-outline", bg: "#D1FAE5", color: "#059669" },
  message:     { icon: "message-text-outline",  bg: "#DBEAFE", color: "#2563EB" },
  job_update:  { icon: "briefcase-outline",     bg: "#FEF3C7", color: "#D97706" },
  review:      { icon: "star-outline",          bg: "#FEF9C3", color: "#D97706" },
  system:      { icon: "bell-outline",          bg: "#F1F5F9", color: "#64748B" },
};

function NotifRow({ n, index }: { n: Notification; index: number }) {
  const C = useColors();
  const { markNotificationRead } = useData();
  const cfg = NOTIF[n.type] ?? NOTIF.system;

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).duration(350)}>
      <TouchableOpacity onPress={() => markNotificationRead(n.id)} activeOpacity={0.85}
        style={[s.row, { backgroundColor: n.read ? C.card : C.primaryLight, borderColor: n.read ? C.border : C.primaryMid }]}
      >
        <View style={[s.iconWrap, { backgroundColor: cfg.bg }]}>
          <MaterialCommunityIcons name={cfg.icon as any} size={20} color={cfg.color} />
        </View>
        <View style={s.content}>
          <Text style={[s.notifTitle, { color: C.foreground }]}>{n.title}</Text>
          <Text style={[s.notifBody, { color: C.mutedForeground }]}>{n.body}</Text>
          <Text style={[s.notifTime, { color: C.mutedForeground }]}>{formatTimeAgo(n.timestamp)}</Text>
        </View>
        {!n.read && <View style={[s.unreadDot, { backgroundColor: C.primary }]} />}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function NotificationsScreen() {
  const C = useColors();
  const insets = useSafeAreaInsets();
  const { notifications, markAllNotificationsRead, unreadNotificationCount } = useData();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[s.root, { backgroundColor: C.background }]}>
      <View style={[s.header, { paddingTop: topInset + 12, borderBottomColor: C.border }]}>
        <View>
          <Text style={[s.title, { color: C.foreground }]}>Notifications</Text>
          <Text style={[s.subtitle, { color: C.mutedForeground }]}>{unreadNotificationCount > 0 ? `${unreadNotificationCount} unread` : "All caught up"}</Text>
        </View>
        {unreadNotificationCount > 0 && (
          <TouchableOpacity onPress={markAllNotificationsRead} style={[s.markBtn, { backgroundColor: C.primaryLight }]}>
            <Text style={[s.markText, { color: C.primary }]}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0
        ? <View style={s.empty}>
            <View style={[s.emptyIcon, { backgroundColor: C.secondary }]}><Feather name="bell" size={28} color={C.mutedForeground} /></View>
            <Text style={[s.emptyTitle, { color: C.foreground }]}>No notifications</Text>
            <Text style={[s.emptyText, { color: C.mutedForeground }]}>You're all caught up!</Text>
          </View>
        : <FlatList data={notifications} keyExtractor={n => n.id}
            renderItem={({ item, index }) => <NotifRow n={item} index={index} />}
            contentContainerStyle={s.list}
          />
      }
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 1 },
  title: { fontSize: 24, fontFamily: "Poppins_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Poppins_400Regular", marginTop: 2 },
  markBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  markText: { fontSize: 12, fontFamily: "Poppins_600SemiBold" },
  list: { padding: 16, gap: 8, paddingBottom: Platform.OS === "web" ? 100 : 90 },
  row: { flexDirection: "row", alignItems: "flex-start", padding: 14, borderRadius: 14, borderWidth: 1 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 12 },
  content: { flex: 1 },
  notifTitle: { fontSize: 14, fontFamily: "Poppins_600SemiBold", marginBottom: 2 },
  notifBody: { fontSize: 13, fontFamily: "Poppins_400Regular", lineHeight: 18, marginBottom: 3 },
  notifTime: { fontSize: 11, fontFamily: "Poppins_400Regular" },
  unreadDot: { width: 7, height: 7, borderRadius: 4, marginTop: 5, marginLeft: 8 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40, gap: 10 },
  emptyIcon: { width: 64, height: 64, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 17, fontFamily: "Poppins_700Bold" },
  emptyText: { fontSize: 13, fontFamily: "Poppins_400Regular", textAlign: "center" },
});
