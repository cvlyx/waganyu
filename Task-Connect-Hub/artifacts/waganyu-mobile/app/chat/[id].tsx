import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useData, type Message } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";
import { formatTimeAgo } from "@/utils/format";

function DateSeparator({ timestamp }: { timestamp: string }) {
  const colors = useColors();
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
  const label = isToday ? "Today" : isYesterday ? "Yesterday" : date.toLocaleDateString("en-MW", { day: "numeric", month: "short" });
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 12, paddingHorizontal: 16 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
      <Text style={{ fontSize: 11, fontFamily: "Poppins_500Medium", color: colors.mutedForeground, marginHorizontal: 10 }}>{label}</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
    </View>
  );
}

function MessageBubble({ message, isMe }: { message: Message; isMe: boolean }) {
  const colors = useColors();
  const styles = StyleSheet.create({
    container: {
      flexDirection: isMe ? "row-reverse" : "row",
      alignItems: "flex-end",
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    bubble: {
      maxWidth: "75%",
      borderRadius: 18,
      padding: 12,
      backgroundColor: isMe ? colors.primary : colors.card,
      borderWidth: isMe ? 0 : 1,
      borderColor: colors.border,
      borderBottomRightRadius: isMe ? 4 : 18,
      borderBottomLeftRadius: isMe ? 18 : 4,
    },
    text: {
      fontSize: 14,
      color: isMe ? "#FFFFFF" : colors.foreground,
      fontFamily: "Poppins_400Regular",
      lineHeight: 20,
    },
    time: {
      fontSize: 10,
      color: isMe ? "rgba(255,255,255,0.7)" : colors.mutedForeground,
      fontFamily: "Poppins_400Regular",
      marginTop: 4,
      textAlign: isMe ? "right" : "left",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{message.content}</Text>
        <Text style={styles.time}>{formatTimeAgo(message.timestamp)}</Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { chats, getMessages, sendMessage } = useData();
  const { user } = useAuth();
  const chat = chats.find((c) => c.id === id);
  const messages = getMessages(id ?? "");
  const [text, setText] = useState("");
  const flatRef = useRef<FlatList>(null);

  const SAMPLE_MESSAGES: Message[] = [
    {
      id: "m0",
      chatId: id ?? "",
      senderId: chat?.participants.find((p) => p !== user?.id) ?? "",
      content: "Hello! I saw your job posting and I'm interested.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "m1",
      chatId: id ?? "",
      senderId: user?.id ?? "1",
      content: "Great! Can you tell me more about your experience?",
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "m2",
      chatId: id ?? "",
      senderId: chat?.participants.find((p) => p !== user?.id) ?? "",
      content: chat?.lastMessage ?? "I can come tomorrow morning at 9am",
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      read: false,
    },
  ];

  const allMessages = [...SAMPLE_MESSAGES, ...messages];

  // Group messages with date separators
  type ChatItem = { type: "message"; data: Message } | { type: "date"; key: string; timestamp: string };
  const chatItems: ChatItem[] = [];
  let lastDate = "";
  for (const msg of allMessages) {
    const d = new Date(msg.timestamp).toDateString();
    if (d !== lastDate) {
      chatItems.push({ type: "date", key: `date-${d}`, timestamp: msg.timestamp });
      lastDate = d;
    }
    chatItems.push({ type: "message", data: msg });
  }

  function handleSend() {
    if (!text.trim() || !user) return;
    sendMessage(id ?? "", text.trim(), user.id);
    setText("");
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: Platform.OS === "web" ? 67 : insets.top + 8,
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 12,
    },
    backBtn: {
      width: 36, height: 36, borderRadius: 10,
      backgroundColor: colors.secondary,
      justifyContent: "center", alignItems: "center",
    },
    avatar: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: colors.primary + "20",
      justifyContent: "center", alignItems: "center",
    },
    avatarText: {
      fontSize: 16, fontWeight: "700" as const, color: colors.primary, fontFamily: "Poppins_700Bold",
    },
    headerInfo: { flex: 1 },
    headerName: {
      fontSize: 16, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Poppins_700Bold",
    },
    headerSub: {
      fontSize: 12, color: colors.mutedForeground, fontFamily: "Poppins_400Regular",
    },
    messages: { flex: 1, paddingTop: 16 },
    inputRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 10,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 10,
    },
    input: {
      flex: 1,
      minHeight: 44,
      maxHeight: 120,
      backgroundColor: colors.secondary,
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Poppins_400Regular",
      borderWidth: 1,
      borderColor: colors.border,
    },
    sendBtn: {
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: colors.primary,
      justifyContent: "center", alignItems: "center",
    },
    sendBtnDisabled: {
      backgroundColor: colors.muted,
    },
  });

  const initials = chat?.participantName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2) ?? "??";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chat?.participantName ?? "Chat"}</Text>
          {chat?.jobTitle && (
            <Text style={styles.headerSub} numberOfLines={1}>{chat.jobTitle}</Text>
          )}
        </View>
        <TouchableOpacity>
          <Feather name="more-vertical" size={20} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatRef}
          data={chatItems}
          keyExtractor={(item) => item.type === "date" ? item.key : item.data.id}
          style={styles.messages}
          renderItem={({ item }) =>
            item.type === "date"
              ? <DateSeparator timestamp={item.timestamp} />
              : <MessageBubble message={item.data} isMe={item.data.senderId === user?.id} />
          }
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.mutedForeground}
            value={text}
            onChangeText={setText}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim()}
            activeOpacity={0.8}
          >
            <Feather name="send" size={18} color={text.trim() ? "#FFFFFF" : colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
