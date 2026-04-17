import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { WorkerCard } from "@/components/WorkerCard";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const SKILLS = ["All","Electrical","Plumbing","Cleaning","Tutoring","Carpentry","Cooking","Painting","IT Support"];

export default function WorkersScreen() {
  const C = useColors();
  const insets = useSafeAreaInsets();
  const { workers } = useData();
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("All");
  const [verified, setVerified] = useState(false);
  const [online, setOnline] = useState(false);
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const filtered = workers.filter(w =>
    (!search || w.name.toLowerCase().includes(search.toLowerCase()) || w.skills.some(s => s.toLowerCase().includes(search.toLowerCase())))
    && (skill === "All" || w.skills.includes(skill))
    && (!verified || w.isVerified)
    && (!online || w.isOnline)
  );

  return (
    <View style={[s.root, { backgroundColor: C.background }]}>
      <View style={[s.header, { paddingTop: topInset + 12, backgroundColor: C.background, borderBottomColor: C.border }]}>
        <Text style={[s.title, { color: C.foreground }]}>Professionals</Text>
        <Text style={[s.subtitle, { color: C.mutedForeground }]}>Hire verified experts near you</Text>

        <View style={[s.searchBar, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Feather name="search" size={16} color={C.mutedForeground} />
          <TextInput style={[s.searchInput, { color: C.foreground }]} placeholder="Search by name or skill…" placeholderTextColor={C.mutedForeground} value={search} onChangeText={setSearch} />
          {search ? <TouchableOpacity onPress={() => setSearch("")}><Feather name="x" size={16} color={C.mutedForeground} /></TouchableOpacity> : null}
        </View>

        <View style={s.filterRow}>
          {[
            { label: "Verified", active: verified, onPress: () => setVerified(!verified), icon: "check-circle" },
            { label: "Online",   active: online,   onPress: () => setOnline(!online),     icon: "wifi"         },
          ].map(f => (
            <TouchableOpacity key={f.label} onPress={f.onPress}
              style={[s.filterChip, f.active ? { backgroundColor: C.primaryLight, borderColor: C.primary } : { backgroundColor: C.surface, borderColor: C.border }]}
            >
              <Feather name={f.icon as any} size={12} color={f.active ? C.primary : C.mutedForeground} />
              <Text style={[s.filterText, { color: f.active ? C.primary : C.mutedForeground }]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
          <View style={[s.countChip, { backgroundColor: C.secondary }]}>
            <Text style={[s.countText, { color: C.mutedForeground }]}>{filtered.length} found</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 100 : 90 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.skillList}>
          {SKILLS.map(sk => {
            const active = skill === sk;
            return (
              <TouchableOpacity key={sk} onPress={() => setSkill(sk)} activeOpacity={0.8}
                style={[s.skillBtn, active ? { backgroundColor: C.primary, borderColor: C.primary } : { backgroundColor: C.surface, borderColor: C.border }]}
              >
                <Text style={[s.skillText, { color: active ? "#fff" : C.mutedForeground }]}>{sk}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={s.list}>
          {filtered.length === 0
            ? <View style={s.empty}><Feather name="users" size={32} color={C.mutedForeground} /><Text style={[s.emptyText, { color: C.mutedForeground }]}>No professionals match your filters.</Text></View>
            : filtered.map((w, i) => (
              <Animated.View key={w.id} entering={FadeInDown.delay(i * 50).duration(350)}>
                <WorkerCard worker={w} />
              </Animated.View>
            ))
          }
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1 },
  title: { fontSize: 24, fontFamily: "Poppins_700Bold", marginBottom: 2 },
  subtitle: { fontSize: 13, fontFamily: "Poppins_400Regular", marginBottom: 14 },
  searchBar: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 12, height: 46, gap: 8, marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Poppins_400Regular" },
  filterRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  filterChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 8, borderWidth: 1.5 },
  filterText: { fontSize: 12, fontFamily: "Poppins_500Medium" },
  countChip: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 8 },
  countText: { fontSize: 12, fontFamily: "Poppins_400Regular" },
  skillList: { paddingHorizontal: 20, paddingVertical: 14, gap: 7 },
  skillBtn: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 8, borderWidth: 1.5 },
  skillText: { fontSize: 12, fontFamily: "Poppins_500Medium" },
  list: { paddingHorizontal: 20 },
  empty: { alignItems: "center", paddingVertical: 60, gap: 10 },
  emptyText: { fontSize: 14, fontFamily: "Poppins_400Regular", textAlign: "center" },
});
