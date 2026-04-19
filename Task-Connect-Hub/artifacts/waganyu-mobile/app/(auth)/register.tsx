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
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function RegisterScreen() {
  const C = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const emailRef = useRef<TextInput>(null);
  const pwRef = useRef<TextInput>(null);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Required", "Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      // Go straight to profile setup
      router.replace("/(auth)/setup");
    } catch {
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[s.root, { backgroundColor: C.background }]}>
      <View style={[s.topAccent, { backgroundColor: C.primary }]} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={[s.inner, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}>

            {/* Top row */}
            <Animated.View entering={FadeIn.delay(50).duration(400)} style={s.topRow}>
              <TouchableOpacity onPress={() => router.back()} style={[s.backBtn, { backgroundColor: C.surface, borderColor: C.border }]}>
                <Feather name="arrow-left" size={18} color={C.foreground} />
              </TouchableOpacity>
              <View style={s.brand}>
                <View style={[s.brandIcon, { backgroundColor: C.primary }]}>
                  <Feather name="zap" size={16} color="#fff" />
                </View>
                <Text style={[s.brandName, { color: C.foreground }]}>Waganyu</Text>
              </View>
            </Animated.View>

            {/* Heading */}
            <Animated.View entering={FadeInDown.delay(100).duration(400)} style={s.headingBlock}>
              <Text style={[s.heading, { color: C.foreground }]}>Create account</Text>
              <Text style={[s.subheading, { color: C.mutedForeground }]}>
                Join thousands of Malawians earning and getting work done.
              </Text>
            </Animated.View>

            {/* Progress indicator */}
            <Animated.View entering={FadeInDown.delay(150).duration(400)} style={s.progressRow}>
              {[1, 2, 3, 4, 5].map(step => (
                <View key={step} style={s.progressItem}>
                  <View style={[s.progressDot, { backgroundColor: step === 1 ? C.primary : C.border }]}>
                    {step === 1
                      ? <Feather name="check" size={10} color="#fff" />
                      : <Text style={[s.progressNum, { color: step === 1 ? "#fff" : C.mutedForeground }]}>{step}</Text>
                    }
                  </View>
                  <Text style={[s.progressLabel, { color: step === 1 ? C.primary : C.mutedForeground }]}>
                    {step === 1 ? "Account" : step === 2 ? "Profile" : step === 3 ? "Details" : step === 4 ? "Verify" : "Done"}
                  </Text>
                  {step < 5 && <View style={[s.progressLine, { backgroundColor: C.border }]} />}
                </View>
              ))}
            </Animated.View>

            {/* Form */}
            <Animated.View entering={FadeInDown.delay(200).duration(400)}>

              <Text style={[s.label, { color: C.mutedForeground }]}>Full Name</Text>
              <View style={[s.inputRow, { backgroundColor: C.surface, borderColor: focused === "name" ? C.primary : C.border }]}>
                <Feather name="user" size={16} color={focused === "name" ? C.primary : C.mutedForeground} style={s.inputIcon} />
                <TextInput
                  style={[s.input, { color: C.foreground }]}
                  placeholder="e.g. Chisomo Phiri"
                  placeholderTextColor={C.mutedForeground}
                  value={name} onChangeText={setName}
                  autoCapitalize="words" returnKeyType="next"
                  onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>

              <Text style={[s.label, { color: C.mutedForeground }]}>Email Address</Text>
              <View style={[s.inputRow, { backgroundColor: C.surface, borderColor: focused === "email" ? C.primary : C.border }]}>
                <Feather name="mail" size={16} color={focused === "email" ? C.primary : C.mutedForeground} style={s.inputIcon} />
                <TextInput
                  ref={emailRef}
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
                  placeholder="At least 6 characters"
                  placeholderTextColor={C.mutedForeground}
                  value={password} onChangeText={setPassword}
                  secureTextEntry={!showPw} returnKeyType="go"
                  onFocus={() => setFocused("pw")} onBlur={() => setFocused(null)}
                  onSubmitEditing={handleRegister}
                />
                <TouchableOpacity onPress={() => setShowPw(!showPw)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Feather name={showPw ? "eye-off" : "eye"} size={16} color={C.mutedForeground} />
                </TouchableOpacity>
              </View>

              <Text style={[s.hint, { color: C.mutedForeground }]}>
                By creating an account you agree to our Terms of Service and Privacy Policy.
              </Text>

              <TouchableOpacity onPress={handleRegister} disabled={loading} activeOpacity={0.88} style={{ borderRadius: 12, overflow: "hidden", marginTop: 8 }}>
                <LinearGradient colors={["#059669", "#047857"]} style={s.cta} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={s.ctaText}>{loading ? "Creating account…" : "Continue"}</Text>
                  {!loading && <Feather name="arrow-right" size={17} color="#fff" />}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <View style={s.loginRow}>
              <Text style={[s.loginText, { color: C.mutedForeground }]}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
                <Text style={[s.loginLink, { color: C.primary }]}> Sign In</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  topAccent: { height: 3 },
  inner: { paddingHorizontal: 24 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 28 },
  backBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", borderWidth: 1 },
  brand: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandIcon: { width: 30, height: 30, borderRadius: 9, justifyContent: "center", alignItems: "center" },
  brandName: { fontSize: 18, fontFamily: "Poppins_700Bold" },
  headingBlock: { marginBottom: 24 },
  heading: { fontSize: 28, fontFamily: "Poppins_700Bold", marginBottom: 6 },
  subheading: { fontSize: 14, fontFamily: "Poppins_400Regular", lineHeight: 22 },
  progressRow: { flexDirection: "row", alignItems: "center", marginBottom: 28 },
  progressItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  progressDot: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  progressNum: { fontSize: 11, fontFamily: "Poppins_700Bold" },
  progressLabel: { fontSize: 11, fontFamily: "Poppins_500Medium" },
  progressLine: { width: 28, height: 1.5, marginHorizontal: 4 },
  label: { fontSize: 12, fontFamily: "Poppins_600SemiBold", letterSpacing: 0.4, marginBottom: 8 },
  inputRow: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, height: 50, marginBottom: 16 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: "Poppins_400Regular" },
  hint: { fontSize: 11, fontFamily: "Poppins_400Regular", lineHeight: 17, marginBottom: 16, textAlign: "center" },
  cta: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12 },
  ctaText: { fontSize: 16, fontFamily: "Poppins_600SemiBold", color: "#fff" },
  loginRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 24 },
  loginText: { fontSize: 14, fontFamily: "Poppins_400Regular" },
  loginLink: { fontSize: 14, fontFamily: "Poppins_600SemiBold" },
});
