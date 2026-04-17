import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Dimensions, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from "react-native";
import Animated, {
  Easing, FadeIn, FadeInDown, FadeInUp,
  useAnimatedStyle, useSharedValue,
  withDelay, withRepeat, withSequence, withSpring, withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const { width, height } = Dimensions.get("window");

// ── Floating blob (light, subtle) ──────────────────────────────────────────
function Blob({ size, color, top, left, delay }: { size: number; color: string; top: number; left: number; delay: number }) {
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 900 }));
    y.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(-14, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0,   { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      ), -1, true
    ));
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }], opacity: opacity.value }));
  return <Animated.View style={[{ position: "absolute", top, left, width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]} />;
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, delay }: { icon: string; value: string; label: string; delay: number }) {
  const C = useColors();
  const scale = useSharedValue(0.85);
  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 14 }));
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[s.statCard, style, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={[s.statIcon, { backgroundColor: C.primaryLight }]}>
        <Feather name={icon as any} size={15} color={C.primary} />
      </View>
      <Text style={[s.statValue, { color: C.foreground }]}>{value}</Text>
      <Text style={[s.statLabel, { color: C.mutedForeground }]}>{label}</Text>
    </Animated.View>
  );
}

// ── Feature row ────────────────────────────────────────────────────────────
function Feature({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: number }) {
  const C = useColors();
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(500).springify()}
      style={[s.feature, { backgroundColor: C.card, borderColor: C.border }]}
    >
      <LinearGradient colors={[C.primary, "#047857"]} style={s.featureIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Feather name={icon as any} size={18} color="#fff" />
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={[s.featureTitle, { color: C.foreground }]}>{title}</Text>
        <Text style={[s.featureDesc, { color: C.mutedForeground }]}>{desc}</Text>
      </View>
    </Animated.View>
  );
}

// ── Category pill ──────────────────────────────────────────────────────────
function Pill({ emoji, label, delay }: { emoji: string; label: string; delay: number }) {
  const C = useColors();
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 12 }));
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[s.pill, style, { backgroundColor: C.surface, borderColor: C.border }]}>
      <Text style={s.pillEmoji}>{emoji}</Text>
      <Text style={[s.pillLabel, { color: C.foreground }]}>{label}</Text>
    </Animated.View>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function LandingScreen() {
  const C = useColors();
  const insets = useSafeAreaInsets();
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1,    { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ), -1, true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulseScale.value }] }));

  function go(path: any) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(path);
  }

  return (
    <View style={[s.root, { backgroundColor: C.background }]}>
      {/* Decorative blobs */}
      <Blob size={260} color={C.primaryLight}  top={-80}          left={-80}        delay={0}   />
      <Blob size={180} color={C.accentLight}   top={height * 0.3} left={width - 80} delay={300} />
      <Blob size={140} color={C.secondary}     top={height * 0.6} left={-40}        delay={600} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>

        {/* ── Navbar ── */}
        <Animated.View entering={FadeIn.delay(80).duration(500)} style={[s.navbar, { paddingTop: insets.top + 14 }]}>
          <View style={s.brand}>
            <View style={[s.brandIcon, { backgroundColor: C.primary }]}>
              <Feather name="zap" size={16} color="#fff" />
            </View>
            <Text style={[s.brandName, { color: C.foreground }]}>Waganyu</Text>
          </View>
          <TouchableOpacity onPress={() => go("/(auth)/login")} style={[s.navBtn, { borderColor: C.primary }]} activeOpacity={0.8}>
            <Text style={[s.navBtnText, { color: C.primary }]}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Hero ── */}
        <View style={s.hero}>
          {/* Badge */}
          <Animated.View entering={FadeInDown.delay(150).duration(500)} style={[s.badge, { backgroundColor: C.primaryLight, borderColor: C.primaryMid }]}>
            <View style={[s.badgeDot, { backgroundColor: C.primary }]} />
            <Text style={[s.badgeText, { color: C.primary }]}>🇲🇼  Malawi's #1 Task Marketplace</Text>
          </Animated.View>

          {/* Headline */}
          <Animated.Text entering={FadeInDown.delay(250).duration(600)} style={[s.headline, { color: C.foreground }]}>
            Get Any Task{"\n"}<Text style={{ color: C.primary }}>Done Fast.</Text>
          </Animated.Text>

          <Animated.Text entering={FadeInDown.delay(380).duration(500)} style={[s.heroSub, { color: C.mutedForeground }]}>
            Connect with verified professionals for plumbing, electrical, cleaning, tutoring and more — right in your neighbourhood.
          </Animated.Text>

          {/* Stats */}
          <Animated.View entering={FadeInDown.delay(480).duration(500)} style={s.statsRow}>
            <StatCard icon="users"     value="12K+" label="Workers"  delay={520} />
            <StatCard icon="briefcase" value="50K+" label="Jobs Done" delay={620} />
            <StatCard icon="star"      value="4.9★" label="Rating"   delay={720} />
          </Animated.View>

          {/* CTAs */}
          <Animated.View entering={FadeInUp.delay(600).duration(500)} style={s.ctaCol}>
            <Animated.View style={pulseStyle}>
              <TouchableOpacity onPress={() => go("/(auth)/register")} activeOpacity={0.9} style={{ borderRadius: 12, overflow: "hidden" }}>
                <LinearGradient colors={[C.primary, "#047857"]} style={s.ctaPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={s.ctaPrimaryText}>Get Started Free</Text>
                  <Feather name="arrow-right" size={17} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={() => go("/(auth)/login")} activeOpacity={0.8}
              style={[s.ctaSecondary, { backgroundColor: C.surface, borderColor: C.border }]}
            >
              <Text style={[s.ctaSecondaryText, { color: C.mutedForeground }]}>I already have an account</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* ── Categories ── */}
        <Animated.View entering={FadeInDown.delay(700).duration(500)} style={s.section}>
          <Text style={[s.sectionLabel, { color: C.primary }]}>POPULAR CATEGORIES</Text>
          <View style={s.pillsGrid}>
            {[
              { emoji: "🔧", label: "Plumbing"   }, { emoji: "⚡", label: "Electrical" },
              { emoji: "🧹", label: "Cleaning"   }, { emoji: "🪵", label: "Carpentry"  },
              { emoji: "📚", label: "Tutoring"   }, { emoji: "🍳", label: "Cooking"    },
              { emoji: "🚚", label: "Moving"     }, { emoji: "💻", label: "IT Support" },
            ].map((p, i) => <Pill key={p.label} emoji={p.emoji} label={p.label} delay={750 + i * 50} />)}
          </View>
        </Animated.View>

        {/* ── Features ── */}
        <View style={s.section}>
          <Animated.Text entering={FadeInDown.delay(800).duration(500)} style={[s.sectionLabel, { color: C.primary }]}>
            WHY WAGANYU
          </Animated.Text>
          <Feature icon="shield"         title="Verified Professionals" desc="Every worker is background-checked and skill-verified before joining."       delay={840}  />
          <Feature icon="zap"            title="Instant Matching"       desc="Post a job and get applications from nearby pros within minutes."             delay={920}  />
          <Feature icon="lock"           title="Secure Payments"        desc="Money held safely until the job is done to your satisfaction."                delay={1000} />
          <Feature icon="message-circle" title="In-App Messaging"       desc="Chat directly with workers, share photos, and coordinate easily."             delay={1080} />
        </View>

        {/* ── Bottom CTA ── */}
        <Animated.View entering={FadeInUp.delay(1100).duration(600)} style={[s.bottomCta, { backgroundColor: C.card, borderColor: C.border }]}>
          <LinearGradient colors={[C.primaryLight, C.surface]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
          <View style={s.bottomCtaInner}>
            <Text style={[s.bottomCtaTitle, { color: C.foreground }]}>Ready to get started?</Text>
            <Text style={[s.bottomCtaSub, { color: C.mutedForeground }]}>Join thousands of Malawians already using Waganyu</Text>
            <TouchableOpacity onPress={() => go("/(auth)/register")} activeOpacity={0.9} style={{ borderRadius: 12, overflow: "hidden", width: "100%" }}>
              <LinearGradient colors={[C.primary, "#047857"]} style={s.ctaPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={s.ctaPrimaryText}>Create Free Account</Text>
                <Feather name="arrow-right" size={17} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── Footer ── */}
        <Animated.Text entering={FadeIn.delay(1200).duration(500)} style={[s.footer, { color: C.mutedForeground }]}>
          WAGANYU DIGITAL EXCELLENCE © 2025
        </Animated.Text>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  // Nav
  navbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingBottom: 8 },
  brand: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandIcon: { width: 32, height: 32, borderRadius: 9, justifyContent: "center", alignItems: "center" },
  brandName: { fontSize: 20, fontFamily: "Poppins_700Bold" },
  navBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5 },
  navBtnText: { fontSize: 13, fontFamily: "Poppins_600SemiBold" },

  // Hero
  hero: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 8 },
  badge: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 7, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, marginBottom: 20 },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 12, fontFamily: "Poppins_500Medium" },
  headline: { fontSize: 44, fontFamily: "Poppins_700Bold", lineHeight: 52, letterSpacing: -0.5, marginBottom: 14 },
  heroSub: { fontSize: 15, fontFamily: "Poppins_400Regular", lineHeight: 24, marginBottom: 28 },

  // Stats
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 28 },
  statCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: "center", gap: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center", marginBottom: 2 },
  statValue: { fontSize: 17, fontFamily: "Poppins_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Poppins_400Regular" },

  // CTAs
  ctaCol: { gap: 10 },
  ctaPrimary: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12 },
  ctaPrimaryText: { fontSize: 16, fontFamily: "Poppins_600SemiBold", color: "#fff" },
  ctaSecondary: { height: 48, borderRadius: 12, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  ctaSecondaryText: { fontSize: 14, fontFamily: "Poppins_500Medium" },

  // Sections
  section: { paddingHorizontal: 24, paddingTop: 36 },
  sectionLabel: { fontSize: 11, fontFamily: "Poppins_700Bold", letterSpacing: 1.5, marginBottom: 16 },

  // Pills
  pillsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  pillEmoji: { fontSize: 14 },
  pillLabel: { fontSize: 13, fontFamily: "Poppins_500Medium" },

  // Features
  feature: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  featureIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  featureTitle: { fontSize: 14, fontFamily: "Poppins_600SemiBold", marginBottom: 2 },
  featureDesc: { fontSize: 12, fontFamily: "Poppins_400Regular", lineHeight: 18 },

  // Bottom CTA
  bottomCta: { marginHorizontal: 24, marginTop: 36, borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  bottomCtaInner: { padding: 24, alignItems: "center", gap: 8 },
  bottomCtaTitle: { fontSize: 20, fontFamily: "Poppins_700Bold", textAlign: "center" },
  bottomCtaSub: { fontSize: 13, fontFamily: "Poppins_400Regular", textAlign: "center", lineHeight: 20, marginBottom: 16 },

  // Footer
  footer: { textAlign: "center", fontSize: 10, fontFamily: "Poppins_400Regular", letterSpacing: 1.2, marginTop: 28, paddingHorizontal: 24, paddingBottom: 8 },
});
