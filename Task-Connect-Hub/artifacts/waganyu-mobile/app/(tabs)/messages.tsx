import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useData, type Chat } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";
import { formatTimeAgo } from "@/utils/format";

function ChatRow({ chat, index }: { chat: Chat; index: number }) {
  const C = useColors();
  const initials = chat.participantName.split(" ").map(n => n[0]).join("").slice(0, 2);
  const hasUnread = chat.unreadCount > 0;

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(350)}>
      <TouchableOpacity onPress={() => router.push(`/chat/${chat.id}` as any)} activeOpacity={0.85}
        style={[s.row, { backgroundColor: C.card, borderColor: C.border }]}
      >
        <View style={[s.avatar, { backgroundColor: C.primaryLight }]}>
          <Text style={[s.avatarText, { color: C.primary }]}>{initials}</Text>
        </View>
        <View style={s.content}>
          {chat.jobTitle && <Text style={[s.jobTag, { color: C.primary }]} numberOfLines={1}>{chat.jobTitle}</Text>}
          <View style={s.nameRow}>
            <Text style={[s.name, { color: C.foreground }]}>{chat.participantName}</Text>
            <Text style={[s.time, { color: C.mutedForeground }]}>{formatTimeAgo(chat.lastMessageTime)}</Text>
          </View>
          <View style={s.msgRow}>
            <Text style={[s.lastMsg, { color: C.mutedForeground, fontFamily: hasUnread ? "Poppins_600SemiBold" : "Poppins_400Regular" }]} numberOfLines={1}>{chat.lastMessage}</Text>
            {hasUnread && <View style={[s.badge, { backgroundColor: C.primary }]}><Text style={s.badgeText}>{chat.unreadCount}</Text></View>}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function MessagesScreen() {
  const C = useColors();
  const insets = useSafeAreaInsets();
  const { chats } = useData();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[s.root, { backgroundColor: C.background }]}>
      <View style={[s.header, { paddingTop: topInset + 12, borderBottomColor: C.border }]}>
        <Text style={[s.title, { color: C.foreground }]}>Messages</Text>
        <Text style={[s.subtitle, { color: C.mutedForeground }]}>{chats.length} conversation{chats.length !== 1 ? "s" : ""}</Text>
      </View>

      {chats.length === 0
        ? <View style={s.empty}>
            <View style={[s.emptyIcon, { backgroundColor: C.secondary }]}><Feather name="message-circle" size={28} color={C.mutedForeground} /></View>
            <Text style={[s.emptyTitle, { color: C.foreground }]}>No messages yet</Text>
            <Text style={[s.emptyText, { color: C.mutedForeground }]}>Apply to jobs or connect with workers to start chatting</Text>
          </View>
        : <FlatList data={chats} keyExtractor={c => c.id}
            renderItem={({ item, index }) => <ChatRow chat={item} index={index} />}
            contentContainerStyle={s.list}
          />
      }
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  title: { fontSize: 24, fontFamily: "Poppins_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Poppins_400Regular", marginTop: 2 },
  list: { padding: 16, gap: 8, paddingBottom: Platform.OS === "web" ? 100 : 90 },
  row: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 14, borderWidth: 1 },
  avatar: { width: 46, height: 46, borderRadius: 13, justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarText: { fontSize: 16, fontFamily: "Poppins_700Bold" },
  content: { flex: 1 },
  jobTag: { fontSize: 11, fontFamily: "Poppins_500Medium", marginBottom: 2 },
  nameRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
  name: { fontSize: 14, fontFamily: "Poppins_600SemiBold" },
  time: { fontSize: 11, fontFamily: "Poppins_400Regular" },
  msgRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  lastMsg: { fontSize: 13, flex: 1 },
  badge: { minWidth: 18, height: 18, borderRadius: 9, justifyContent: "center", alignItems: "center", paddingHorizontal: 4, marginLeft: 8 },
  badgeText: { fontSize: 10, fontFamily: "Poppins_700Bold", color: "#fff" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40, gap: 10 },
  emptyIcon: { width: 64, height: 64, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 17, fontFamily: "Poppins_700Bold" },
  emptyText: { fontSize: 13, fontFamily: "Poppins_400Regular", textAlign: "center", lineHeight: 20 },
});
