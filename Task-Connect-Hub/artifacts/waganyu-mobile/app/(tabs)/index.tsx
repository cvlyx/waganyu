import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { JobCard } from "@/components/JobCard";
import { WorkerCard } from "@/components/WorkerCard";
import { JobCardSkeleton, WorkerCardSkeleton } from "@/components/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { useData, type JobCategory } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const CATS: { label: string; value: JobCategory | "All" }[] = [
  { label: "All", value: "All" }, { label: "Plumbing", value: "Plumbing" },
  { label: "Electrical", value: "Electrical" }, { label: "Cleaning", value: "Cleaning" },
  { label: "Tutoring", value: "Tutoring" }, { label: "Moving", value: "Moving" },
  { label: "Carpentry", value: "Carpentry" }, { label: "Painting", value: "Painting" },
  { label: "Cooking", value: "Cooking" },
];

export default function HomeScreen() {
  const C = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { jobs, workers, unreadNotificationCount, unreadMessageCount } = useData();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<JobCategory | "All">("All");
  const [loading, setLoading] = useState(true);
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  // Simulate initial load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase();
    return (!search || j.title.toLowerCase().includes(q) || j.category.toLowerCase().includes(q) || j.location.toLowerCase().includes(q))
      && (cat === "All" || j.category === cat);
  });

  return (
    <View style={[s.root, { backgroundColor: C.background }]}>

      {/* ── Header ── */}
      <View style={[s.header, { paddingTop: topInset + 12, backgroundColor: C.background, borderBottomColor: C.border }]}>
        <View style={s.headerTop}>
          <View>
            <Text style={[s.greeting, { color: C.mutedForeground }]}>Good morning</Text>
            <Text style={[s.userName, { color: C.foreground }]}>{user?.name?.split(" ")[0] ?? "there"} 👋</Text>
          </View>
          <View style={s.actions}>
            <TouchableOpacity style={[s.iconBtn, { backgroundColor: C.surface, borderColor: C.border }]} onPress={() => router.push("/(tabs)/messages")}>
              <Feather name="message-circle" size={19} color={C.foreground} />
              {unreadMessageCount > 0 && <View style={[s.dot, { borderColor: C.background }]} />}
            </TouchableOpacity>
            <TouchableOpacity style={[s.iconBtn, { backgroundColor: C.surface, borderColor: C.border }]} onPress={() => router.push("/(tabs)/notifications")}>
              <Feather name="bell" size={19} color={C.foreground} />
              {unreadNotificationCount > 0 && <View style={[s.dot, { borderColor: C.background }]} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={[s.searchBar, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Feather name="search" size={16} color={C.mutedForeground} />
          <TextInput
            style={[s.searchInput, { color: C.foreground }]}
            placeholder="Search jobs, skills, location…"
            placeholderTextColor={C.mutedForeground}
            value={search} onChangeText={setSearch}
          />
          {search
            ? <TouchableOpacity onPress={() => setSearch("")}><Feather name="x" size={16} color={C.mutedForeground} /></TouchableOpacity>
            : <View style={[s.filterBtn, { backgroundColor: C.primaryLight }]}><Feather name="sliders" size={13} color={C.primary} /></View>
          }
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 100 : 90 }}>

        {/* Banner */}
        {!search && cat === "All" && (
          <Animated.View entering={FadeInDown.delay(50).duration(400)} style={s.bannerWrap}>
            <LinearGradient colors={["#059669", "#047857"]} style={s.banner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={{ flex: 1 }}>
                <Text style={s.bannerTitle}>Find skilled pros{"\n"}near you</Text>
                <TouchableOpacity onPress={() => router.push("/post-job" as any)} style={s.bannerBtn} activeOpacity={0.85}>
                  <Text style={[s.bannerBtnText, { color: C.primary }]}>Post a Job</Text>
                  <Feather name="arrow-right" size={13} color={C.primary} />
                </TouchableOpacity>
              </View>
              <Text style={s.bannerEmoji}>🏗️</Text>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Stats */}
        <View style={s.statsRow}>
          {[
            { v: jobs.length,    l: "Open Jobs",    icon: "briefcase" },
            { v: workers.length, l: "Pros Nearby",  icon: "users"     },
            { v: "4.8★",         l: "Avg Rating",   icon: "star"      },
          ].map((st, i) => (
            <Animated.View key={i} entering={FadeInDown.delay(80 + i * 50).duration(400)}
              style={[s.statCard, { backgroundColor: C.card, borderColor: C.border }]}
            >
              <View style={[s.statIcon, { backgroundColor: C.primaryLight }]}>
                <Feather name={st.icon as any} size={13} color={C.primary} />
              </View>
              <Text style={[s.statVal, { color: C.foreground }]}>{st.v}</Text>
              <Text style={[s.statLbl, { color: C.mutedForeground }]}>{st.l}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Category pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catList}>
          {CATS.map((c) => {
            const active = cat === c.value;
            return (
              <TouchableOpacity key={c.value} onPress={() => setCat(c.value)} activeOpacity={0.8}
                style={[s.catBtn, active ? { backgroundColor: C.primary, borderColor: C.primary } : { backgroundColor: C.surface, borderColor: C.border }]}
              >
                <Text style={[s.catText, { color: active ? "#fff" : C.mutedForeground }]}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Urgent */}
        {jobs.filter(j => j.urgent).length > 0 && cat === "All" && !search && (
          <View style={s.section}>
            <View style={s.sectionHead}>
              <View style={s.urgentRow}>
                <View style={[s.urgentDot, { backgroundColor: "#DC2626" }]} />
                <Text style={[s.sectionTitle, { color: C.foreground }]}>Urgent Jobs</Text>
              </View>
            </View>
            {jobs.filter(j => j.urgent).map(j => <JobCard key={j.id} job={j} />)}
          </View>
        )}

        {/* Jobs */}
        <View style={s.section}>
          <View style={s.sectionHead}>
            <Text style={[s.sectionTitle, { color: C.foreground }]}>{cat === "All" ? "Recent Jobs" : cat}</Text>
            <Text style={[s.sectionCount, { color: C.mutedForeground }]}>{filtered.length} found</Text>
          </View>
          {loading
            ? [1,2,3].map(i => <JobCardSkeleton key={i} />)
            : filtered.length === 0
              ? <View style={s.empty}><Feather name="search" size={32} color={C.mutedForeground} /><Text style={[s.emptyText, { color: C.mutedForeground }]}>No jobs found.</Text></View>
              : filtered.map(j => <JobCard key={j.id} job={j} />)
          }
        </View>

        {/* Top pros */}
        <View style={[s.section, { paddingHorizontal: 0 }]}>
          <View style={[s.sectionHead, { paddingHorizontal: 20 }]}>
            <Text style={[s.sectionTitle, { color: C.foreground }]}>Top Professionals</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/workers" as any)}>
              <Text style={[s.seeAll, { color: C.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          {loading
            ? <FlatList
                data={[1,2,3]}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                keyExtractor={i => String(i)}
                renderItem={() => <WorkerCardSkeleton />}
              />
            : <FlatList
                data={workers.slice(0, 6)} horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                keyExtractor={w => w.id}
                renderItem={({ item }) => <WorkerCard worker={item} horizontal />}
              />
          }
        </View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  greeting: { fontSize: 12, fontFamily: "Poppins_400Regular" },
  userName: { fontSize: 20, fontFamily: "Poppins_700Bold" },
  actions: { flexDirection: "row", gap: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 11, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  dot: { position: "absolute", top: 7, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: "#DC2626", borderWidth: 1.5 },
  searchBar: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 12, height: 46, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Poppins_400Regular" },
  filterBtn: { padding: 6, borderRadius: 8 },
  bannerWrap: { marginHorizontal: 20, marginTop: 16, marginBottom: 4, borderRadius: 14, overflow: "hidden" },
  banner: { flexDirection: "row", alignItems: "center", padding: 20, minHeight: 100 },
  bannerTitle: { fontSize: 18, fontFamily: "Poppins_700Bold", color: "#fff", lineHeight: 26, marginBottom: 12 },
  bannerBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#fff", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  bannerBtnText: { fontSize: 12, fontFamily: "Poppins_600SemiBold" },
  bannerEmoji: { fontSize: 48, marginLeft: 8 },
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginTop: 16, marginBottom: 14 },
  statCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, alignItems: "center", gap: 3 },
  statIcon: { width: 28, height: 28, borderRadius: 8, justifyContent: "center", alignItems: "center", marginBottom: 2 },
  statVal: { fontSize: 17, fontFamily: "Poppins_700Bold" },
  statLbl: { fontSize: 10, fontFamily: "Poppins_400Regular", textAlign: "center" },
  catList: { paddingHorizontal: 20, paddingBottom: 2, gap: 7 },
  catBtn: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 8, borderWidth: 1.5 },
  catText: { fontSize: 12, fontFamily: "Poppins_500Medium" },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontFamily: "Poppins_700Bold" },
  sectionCount: { fontSize: 12, fontFamily: "Poppins_400Regular" },
  seeAll: { fontSize: 13, fontFamily: "Poppins_600SemiBold" },
  urgentRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  urgentDot: { width: 7, height: 7, borderRadius: 4 },
  empty: { alignItems: "center", paddingVertical: 32, gap: 10 },
  emptyText: { fontSize: 14, fontFamily: "Poppins_400Regular" },
});
