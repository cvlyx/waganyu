import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function LoginScreen() {
  const C = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const pwRef = useRef<TextInput>(null);

  async function handleLogin() {
    if (!email || !password) { Alert.alert("Required", "Please fill in all fields"); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    try { await login(email, password); router.replace("/(tabs)"); }
    catch { Alert.alert("Error", "Invalid credentials"); }
    finally { setLoading(false); }
  }

  return (
    <View style={[s.root, { backgroundColor: C.background }]}>
      {/* Subtle top accent */}
      <View style={[s.topAccent, { backgroundColor: C.primary }]} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={[s.inner, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}>

            {/* Brand */}
            <Animated.View entering={FadeIn.delay(100).duration(500)} style={s.brand}>
              <View style={[s.brandIcon, { backgroundColor: C.primary }]}>
                <Feather name="zap" size={20} color="#fff" />
              </View>
              <Text style={[s.brandName, { color: C.foreground }]}>Waganyu</Text>
            </Animated.View>

            {/* Heading */}
            <Animated.View entering={FadeInDown.delay(150).duration(500)} style={s.headingBlock}>
              <Text style={[s.heading, { color: C.foreground }]}>Sign in</Text>
              <Text style={[s.subheading, { color: C.mutedForeground }]}>Welcome back — find tasks or hire professionals near you.</Text>
            </Animated.View>

            {/* Form */}
            <Animated.View entering={FadeInDown.delay(220).duration(500)}>
              <Text style={[s.label, { color: C.mutedForeground }]}>Email</Text>
              <View style={[s.inputRow, { backgroundColor: C.surface, borderColor: focused === "email" ? C.primary : C.border }]}>
                <Feather name="mail" size={16} color={focused === "email" ? C.primary : C.mutedForeground} style={s.inputIcon} />
                <TextInput
                  style={[s.input, { color: C.foreground }]}
                  placeholder="you@example.com"
                  placeholderTextColor={C.mutedForeground}
                  value={email} onChangeText={setEmail}
                  keyboardType="email-address" autoCapitalize="none" returnKeyType="next"
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                  onSubmitEditing={() => pwRef.current?.focus()}
                />
              </View>

              <Text style={[s.label, { color: C.mutedForeground }]}>Password</Text>
              <View style={[s.inputRow, { backgroundColor: C.surface, borderColor: focused === "pw" ? C.primary : C.border }]}>
                <Feather name="lock" size={16} color={focused === "pw" ? C.primary : C.mutedForeground} style={s.inputIcon} />
                <TextInput
                  ref={pwRef}
                  style={[s.input, { color: C.foreground }]}
                  placeholder="••••••••"
                  placeholderTextColor={C.mutedForeground}
                  value={password} onChangeText={setPassword}
                  secureTextEntry={!showPw} returnKeyType="go"
                  onFocus={() => setFocused("pw")} onBlur={() => setFocused(null)}
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity onPress={() => setShowPw(!showPw)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Feather name={showPw ? "eye-off" : "eye"} size={16} color={C.mutedForeground} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={s.forgotRow}>
                <Text style={[s.forgotText, { color: C.primary }]}>Forgot password?</Text>
              </TouchableOpacity>

              {/* CTA */}
              <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.88} style={{ borderRadius: 12, overflow: "hidden", marginTop: 8 }}>
                <LinearGradient colors={["#059669", "#047857"]} style={s.cta} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={s.ctaText}>{loading ? "Signing in…" : "Sign In"}</Text>
                  {!loading && <Feather name="arrow-right" size={17} color="#fff" />}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <Animated.View entering={FadeInDown.delay(300).duration(400)} style={s.divider}>
              <View style={[s.divLine, { backgroundColor: C.border }]} />
              <Text style={[s.divText, { color: C.mutedForeground }]}>or</Text>
              <View style={[s.divLine, { backgroundColor: C.border }]} />
            </Animated.View>

            {/* Social */}
            <Animated.View entering={FadeInDown.delay(350).duration(400)} style={s.socialRow}>
              {["Google", "Apple"].map((p) => (
                <TouchableOpacity key={p} style={[s.socialBtn, { backgroundColor: C.surface, borderColor: C.border }]} activeOpacity={0.8}>
                  <Feather name={p === "Google" ? "globe" : "smartphone"} size={17} color={C.foreground} />
                  <Text style={[s.socialText, { color: C.foreground }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>

            {/* Register */}
            <Animated.View entering={FadeInUp.delay(400).duration(400)} style={s.registerRow}>
              <Text style={[s.registerText, { color: C.mutedForeground }]}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text style={[s.registerLink, { color: C.primary }]}> Register</Text>
              </TouchableOpacity>
            </Animated.View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  topAccent: { height: 3, width: "100%" },
  inner: { paddingHorizontal: 24 },
  brand: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 40 },
  brandIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  brandName: { fontSize: 20, fontFamily: "Poppins_700Bold" },
  headingBlock: { marginBottom: 32 },
  heading: { fontSize: 30, fontFamily: "Poppins_700Bold", marginBottom: 6 },
  subheading: { fontSize: 14, fontFamily: "Poppins_400Regular", lineHeight: 22 },
  label: { fontSize: 12, fontFamily: "Poppins_600SemiBold", letterSpacing: 0.4, marginBottom: 8 },
  inputRow: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, height: 50, marginBottom: 16 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: "Poppins_400Regular" },
  forgotRow: { alignSelf: "flex-end", marginBottom: 20 },
  forgotText: { fontSize: 13, fontFamily: "Poppins_500Medium" },
  cta: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12 },
  ctaText: { fontSize: 16, fontFamily: "Poppins_600SemiBold", color: "#fff" },
  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 24 },
  divLine: { flex: 1, height: 1 },
  divText: { fontSize: 13, fontFamily: "Poppins_400Regular" },
  socialRow: { flexDirection: "row", gap: 12, marginBottom: 28 },
  socialBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 1.5, height: 48, gap: 8 },
  socialText: { fontSize: 14, fontFamily: "Poppins_500Medium" },
  registerRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  registerText: { fontSize: 14, fontFamily: "Poppins_400Regular" },
  registerLink: { fontSize: 14, fontFamily: "Poppins_600SemiBold" },
});
