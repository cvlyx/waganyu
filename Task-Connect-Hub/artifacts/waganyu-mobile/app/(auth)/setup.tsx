/**
 * Profile Setup — multi-step onboarding after registration.
 * Step 1: What do you want to do? (intent)
 * Step 2: Your skills / interests
 * Step 3: Your city + how you heard about us
 * Step 4: Email OTP verification
 * Step 5: Short bio (optional) — done!
 */
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import Animated, {
  FadeIn, FadeInDown, FadeInRight, FadeOutLeft,
  useAnimatedStyle, useSharedValue, withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth, type UserIntent } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

// ── Data ──────────────────────────────────────────────────────────────────────

const INTENTS: { value: UserIntent; label: string; desc: string; icon: keyof typeof Feather.glyphMap; emoji: string }[] = [
  { value: "hire",      label: "Hire Professionals", desc: "Post jobs and find skilled workers for tasks",    icon: "briefcase", emoji: "📋" },
  { value: "find_work", label: "Find Work",           desc: "Browse jobs and earn money with your skills",    icon: "tool",      emoji: "🔧" },
  { value: "both",      label: "Both",                desc: "Post jobs and also take on work — full access",  icon: "zap",       emoji: "⚡" },
];

const ALL_SKILLS = [
  "Plumbing", "Electrical", "Cleaning", "Carpentry", "Painting",
  "Moving", "Tutoring", "Cooking", "Gardening", "IT Support",
  "Driving", "Security", "Photography", "Tailoring", "Masonry",
];

// Service categories for hirers (same skills but labeled as services they need)
const SERVICE_CATEGORIES = ALL_SKILLS;

const CITIES = [
  "Lilongwe", "Blantyre", "Mzuzu", "Zomba", "Kasungu",
  "Mangochi", "Salima", "Dedza", "Ntcheu", "Karonga",
];

const HEARD_FROM = [
  { label: "Friend / Family",  icon: "users"       },
  { label: "Facebook",         icon: "facebook"    },
  { label: "WhatsApp",         icon: "message-circle" },
  { label: "Radio / TV",       icon: "radio"       },
  { label: "Google Search",    icon: "search"      },
  { label: "Poster / Flyer",   icon: "file-text"   },
  { label: "Other",            icon: "more-horizontal" },
];

const TOTAL_STEPS = 5;

// ── Step indicator ────────────────────────────────────────────────────────────
function StepBar({ step }: { step: number }) {
  const C = useColors();
  return (
    <View style={sb.row}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View key={i} style={[sb.seg, { backgroundColor: i < step ? C.primary : C.border }]} />
      ))}
    </View>
  );
}
const sb = StyleSheet.create({
  row: { flexDirection: "row", gap: 6, marginBottom: 28 },
  seg: { flex: 1, height: 4, borderRadius: 2 },
});

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SetupScreen() {
  const C = useColors();
  const insets = useSafeAreaInsets();
  const { user, completeProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState<UserIntent>("both");
  const [skills, setSkills] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [heardFrom, setHeardFrom] = useState("");
  const [bio, setBio] = useState("");
  const [focused, setFocused] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // OTP verification states
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  function toggleSkill(s: string) {
    Haptics.selectionAsync();
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  function next() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(s => s + 1);
  }

  function back() {
    if (step === 1) { router.back(); return; }
    setStep(s => s - 1);
  }

  async function sendOTP() {
    setVerifying(true);
    // Simulate sending OTP
    setTimeout(() => {
      setOtpSent(true);
      setVerifying(false);
      setResendTimer(60);
      // Start countdown timer
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);
  }

  async function verifyOTP() {
    if (otpCode.length !== 6) {
      Alert.alert("Invalid Code", "Please enter a 6-digit verification code");
      return;
    }
    setVerifying(true);
    // Simulate OTP verification
    setTimeout(() => {
      setVerifying(false);
      next(); // Move to next step after successful verification
    }, 1500);
  }

  function resendOTP() {
    if (resendTimer > 0) return;
    sendOTP();
  }

  async function finish() {
    setSaving(true);
    await completeProfile({
      intent,
      skills,
      city,
      location: city ? `${city}, Malawi` : "Malawi",
      heardFrom,
      bio: bio.trim() || undefined,
    });
    router.replace("/(tabs)");
  }

  const canNext = step === 1 ? true
    : step === 2 ? true          // skills optional
    : step === 3 ? city !== ""   // city required
    : step === 4 ? otpSent && otpCode.length === 6  // OTP verification
    : true;

  return (
    <View style={[s.root, { backgroundColor: C.background }]}>
      <View style={[s.topAccent, { backgroundColor: C.primary }]} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={[s.inner, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}>

            {/* Header */}
            <Animated.View entering={FadeIn.duration(400)} style={s.header}>
              <TouchableOpacity onPress={back} style={[s.backBtn, { backgroundColor: C.surface, borderColor: C.border }]}>
                <Feather name="arrow-left" size={18} color={C.foreground} />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={[s.stepLabel, { color: C.mutedForeground }]}>Step {step} of {TOTAL_STEPS}</Text>
                <Text style={[s.greeting, { color: C.foreground }]}>
                  {step === 1 ? `Hi ${user?.name?.split(" ")[0]} 👋` : step === 5 ? "Almost done!" : "Set up your profile"}
                </Text>
              </View>
            </Animated.View>

            {/* Progress bar */}
            <StepBar step={step} />

            {/* ── Step 1: Intent ── */}
            {step === 1 && (
              <Animated.View entering={FadeInDown.duration(400)}>
                <Text style={[s.stepTitle, { color: C.foreground }]}>What brings you to Waganyu?</Text>
                <Text style={[s.stepSub, { color: C.mutedForeground }]}>You can always change this later. Everyone sees all jobs and workers regardless.</Text>
                <View style={s.intentList}>
                  {INTENTS.map(opt => {
                    const active = intent === opt.value;
                    return (
                      <TouchableOpacity key={opt.value} onPress={() => { setIntent(opt.value); Haptics.selectionAsync(); }} activeOpacity={0.85}
                        style={[s.intentCard, { backgroundColor: active ? C.primaryLight : C.card, borderColor: active ? C.primary : C.border }]}
                      >
                        <View style={[s.intentIconWrap, { backgroundColor: active ? C.primary : C.secondary }]}>
                          <Feather name={opt.icon} size={20} color={active ? "#fff" : C.mutedForeground} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[s.intentLabel, { color: active ? C.primary : C.foreground }]}>{opt.label}</Text>
                          <Text style={[s.intentDesc, { color: C.mutedForeground }]}>{opt.desc}</Text>
                        </View>
                        <View style={[s.radio, { borderColor: active ? C.primary : C.border }]}>
                          {active && <View style={[s.radioDot, { backgroundColor: C.primary }]} />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>
            )}

            {/* ── Step 2: Skills ── */}
            {step === 2 && (
              <Animated.View entering={FadeInDown.duration(400)}>
                <Text style={[s.stepTitle, { color: C.foreground }]}>{intent === "hire" ? "What services do you need?" : "What are your skills?"}</Text>
                <Text style={[s.stepSub, { color: C.mutedForeground }]}>{intent === "hire" ? "Pick the categories you're likely to post jobs in. This helps us show you relevant workers." : "Select all that apply - this helps match you with the right jobs."} {" "}You can skip this for now.</Text>
                
                {/* Role-specific information */}
                {intent === "hire" && (
                  <View style={[s.roleNote, { backgroundColor: "#3B82F620", borderColor: "#3B82F650" }]}>
                    <Feather name="info" size={14} color="#3B82F6" />
                    <Text style={[s.roleNoteText, { color: "#3B82F6" }]}>As a hirer, you'll be able to post jobs in these categories but won't be able to apply for work yourself.</Text>
                  </View>
                )}
                
                {intent === "find_work" && (
                  <View style={[s.roleNote, { backgroundColor: "#10B98120", borderColor: "#10B98150" }]}>
                    <Feather name="info" size={14} color="#10B981" />
                    <Text style={[s.roleNoteText, { color: "#10B981" }]}>As a job seeker, you'll be able to apply for jobs in these areas but won't be able to post jobs yourself.</Text>
                  </View>
                )}
                
                {intent === "both" && (
                  <View style={[s.roleNote, { backgroundColor: "#8B5CF620", borderColor: "#8B5CF650" }]}>
                    <Feather name="info" size={14} color="#8B5CF6" />
                    <Text style={[s.roleNoteText, { color: "#8B5CF6" }]}>With both roles, you can post jobs and apply for work in all selected categories.</Text>
                  </View>
                )}
                
                <View style={s.skillsGrid}>
                  {(intent === "hire" ? SERVICE_CATEGORIES : ALL_SKILLS).map(sk => {
                    const active = skills.includes(sk);
                    return (
                      <TouchableOpacity key={sk} onPress={() => toggleSkill(sk)} activeOpacity={0.8}
                        style={[s.skillChip, { backgroundColor: active ? C.primary : C.surface, borderColor: active ? C.primary : C.border }]}>
                        {active && <Feather name="check" size={11} color="#fff" />}
                        <Text style={[s.skillText, { color: active ? "#fff" : C.foreground }]}>{sk}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {skills.length > 0 && (
                  <View style={[s.selectedBadge, { backgroundColor: C.primaryLight }]}>
                    <Feather name="check-circle" size={13} color={C.primary} />
                    <Text style={[s.selectedText, { color: C.primary }]}>{skills.length} {intent === "hire" ? "service categories" : "skills"} selected</Text>
                  </View>
                )}
              </Animated.View>
            )}

            {/* ── Step 3: City + Heard from ── */}
            {step === 3 && (
              <Animated.View entering={FadeInDown.duration(400)}>
                <Text style={[s.stepTitle, { color: C.foreground }]}>Where are you based?</Text>
                <Text style={[s.stepSub, { color: C.mutedForeground }]}>This helps us show you nearby jobs and workers.</Text>

                <Text style={[s.label, { color: C.mutedForeground }]}>Your City *</Text>
                <View style={s.cityGrid}>
                  {CITIES.map(c => {
                    const active = city === c;
                    return (
                      <TouchableOpacity key={c} onPress={() => { setCity(c); Haptics.selectionAsync(); }} activeOpacity={0.8}
                        style={[s.cityBtn, { backgroundColor: active ? C.primary : C.surface, borderColor: active ? C.primary : C.border }]}
                      >
                        <Text style={[s.cityText, { color: active ? "#fff" : C.foreground }]}>{c}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={[s.label, { color: C.mutedForeground, marginTop: 20 }]}>How did you hear about us?</Text>
                <View style={s.heardGrid}>
                  {HEARD_FROM.map(h => {
                    const active = heardFrom === h.label;
                    return (
                      <TouchableOpacity key={h.label} onPress={() => { setHeardFrom(h.label); Haptics.selectionAsync(); }} activeOpacity={0.8}
                        style={[s.heardBtn, { backgroundColor: active ? C.primaryLight : C.surface, borderColor: active ? C.primary : C.border }]}
                      >
                        <Feather name={h.icon as any} size={14} color={active ? C.primary : C.mutedForeground} />
                        <Text style={[s.heardText, { color: active ? C.primary : C.foreground }]}>{h.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>
            )}

            {/* ── Step 4: Email OTP verification */}

            {step === 4 && (
              <Animated.View entering={FadeInDown.duration(400)}>
                <Text style={[s.stepTitle, { color: C.foreground }]}>Verify your email</Text>
                <Text style={[s.stepSub, { color: C.mutedForeground }]}>We sent a 6-digit code to {user?.email}. Enter it below to verify your account.</Text>

                {/* Send OTP button if not sent */}
                {!otpSent && (
                  <TouchableOpacity onPress={sendOTP} disabled={verifying} activeOpacity={0.88} style={{ borderRadius: 12, overflow: "hidden", marginTop: 8 }}>
                    <LinearGradient colors={["#059669", "#047857"]} style={s.nextBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                      <Text style={s.nextBtnText}>{verifying ? "Sending..." : "Send Verification Code"}</Text>
                      <Feather name="mail" size={17} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                {/* OTP input fields */}
                {otpSent && (
                  <>
                    <View style={s.otpContainer}>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <TextInput
                          key={index}
                          style={[s.otpInput, { borderColor: focused === `otp_${index}` ? C.primary : C.border }]}
                          value={otpCode[index] || ""}
                          onChangeText={(text) => {
                            const newOtp = otpCode.split('');
                            newOtp[index] = text.slice(-1); // Only take last character
                            setOtpCode(newOtp.join(''));
                            // Auto-focus next input
                            if (text && index < 5) {
                              // Focus next input
                            }
                          }}
                          keyboardType="number-pad"
                          maxLength={1}
                          textAlign="center"
                          secureTextEntry={false}
                          onFocus={() => setFocused(`otp_${index}`)}
                          onBlur={() => setFocused(null)}
                        />
                      ))}
                    </View>

                    <Text style={[s.otpHint, { color: C.mutedForeground }]}>
                      Enter the 6-digit code sent to your email
                    </Text>

                    {/* Resend option */}
                    <View style={s.resendContainer}>
                      <Text style={[s.resendText, { color: C.mutedForeground }]}>
                        Didn't receive the code?
                      </Text>
                      <TouchableOpacity onPress={resendOTP} disabled={resendTimer > 0 || verifying} activeOpacity={0.7}>
                        <Text style={[s.resendLink, { color: resendTimer > 0 ? C.mutedForeground : C.primary }]}>
                          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Verify button */}
                    <TouchableOpacity onPress={verifyOTP} disabled={verifying || otpCode.length !== 6} activeOpacity={0.88} style={{ borderRadius: 12, overflow: "hidden", marginTop: 8 }}>
                      <LinearGradient colors={["#059669", "#047857"]} style={s.nextBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                        <Text style={s.nextBtnText}>{verifying ? "Verifying..." : "Verify Email"}</Text>
                        <Feather name="check-circle" size={17} color="#fff" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}
              </Animated.View>
            )}

            {/* Step 5: Bio + finish */}
            {step === 5 && (
              <Animated.View entering={FadeInDown.duration(400)}>
                <Text style={[s.stepTitle, { color: C.foreground }]}>Tell people about yourself</Text>
                <Text style={[s.stepSub, { color: C.mutedForeground }]}>A short bio helps build trust. You can skip this and add it later from your profile.</Text>

                <View style={[s.bioWrap, { backgroundColor: C.surface, borderColor: focused ? C.primary : C.border }]}>
                  <TextInput
                    style={[s.bioInput, { color: C.foreground }]}
                    placeholder={intent === "hire"
                      ? "e.g. I'm a business owner in Lilongwe looking for reliable professionals…"
                      : "e.g. I'm an experienced electrician based in Blantyre with 5+ years…"}
                    placeholderTextColor={C.mutedForeground}
                    value={bio} onChangeText={setBio}
                    multiline numberOfLines={5}
                    textAlignVertical="top"
                    maxLength={200}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                  />
                  <Text style={[s.charCount, { color: C.mutedForeground }]}>{bio.length}/200</Text>
                </View>

                {/* Summary card */}
                <View style={[s.summaryCard, { backgroundColor: C.primaryLight, borderColor: C.primaryMid }]}>
                  <Text style={[s.summaryTitle, { color: C.primary }]}>Your profile summary</Text>
                  <View style={s.summaryRow}>
                    <Feather name="zap" size={13} color={C.primary} />
                    <Text style={[s.summaryText, { color: C.foreground }]}>{INTENTS.find(i => i.value === intent)?.label}</Text>
                  </View>
                  {skills.length > 0 && (
                    <View style={s.summaryRow}>
                      <Feather name="tool" size={13} color={C.primary} />
                      <Text style={[s.summaryText, { color: C.foreground }]}>{skills.slice(0, 3).join(", ")}{skills.length > 3 ? ` +${skills.length - 3}` : ""}</Text>
                    </View>
                  )}
                  {city !== "" && (
                    <View style={s.summaryRow}>
                      <Feather name="map-pin" size={13} color={C.primary} />
                      <Text style={[s.summaryText, { color: C.foreground }]}>{city}, Malawi</Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            )}

            {/* ── Navigation buttons ── */}
            <View style={s.btnRow}>
              {step < TOTAL_STEPS ? (
                <>
                  {step > 1 && (
                    <TouchableOpacity onPress={() => { setStep(s => s - 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                      style={[s.skipBtn, { borderColor: C.border }]} activeOpacity={0.8}
                    >
                      <Text style={[s.skipText, { color: C.mutedForeground }]}>Back</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={next} disabled={!canNext} activeOpacity={0.88}
                    style={[s.nextBtnWrap, { opacity: canNext ? 1 : 0.5 }]}
                  >
                    <LinearGradient colors={["#059669", "#047857"]} style={s.nextBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                      <Text style={s.nextBtnText}>Continue</Text>
                      <Feather name="arrow-right" size={17} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={{ width: "100%", gap: 10 }}>
                  <TouchableOpacity onPress={finish} disabled={saving} activeOpacity={0.88} style={{ borderRadius: 12, overflow: "hidden" }}>
                    <LinearGradient colors={["#059669", "#047857"]} style={s.nextBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                      <Text style={s.nextBtnText}>{saving ? "Setting up…" : "Finish Setup 🎉"}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={finish} activeOpacity={0.7} style={s.skipFull}>
                    <Text style={[s.skipText, { color: C.mutedForeground }]}>Skip for now — I'll complete later</Text>
                  </TouchableOpacity>
                </View>
              )}
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

  header: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 20 },
  backBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", borderWidth: 1 },
  stepLabel: { fontSize: 11, fontFamily: "Poppins_500Medium", letterSpacing: 0.4 },
  greeting: { fontSize: 18, fontFamily: "Poppins_700Bold" },

  stepTitle: { fontSize: 22, fontFamily: "Poppins_700Bold", marginBottom: 8, lineHeight: 30 },
  stepSub: { fontSize: 13, fontFamily: "Poppins_400Regular", lineHeight: 20, marginBottom: 24 },

  // Intent
  intentList: { gap: 12 },
  intentCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 14, borderWidth: 1.5 },
  intentIconWrap: { width: 44, height: 44, borderRadius: 13, justifyContent: "center", alignItems: "center" },
  intentLabel: { fontSize: 15, fontFamily: "Poppins_600SemiBold", marginBottom: 2 },
  intentDesc: { fontSize: 12, fontFamily: "Poppins_400Regular", lineHeight: 17 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, justifyContent: "center", alignItems: "center" },
  radioDot: { width: 10, height: 10, borderRadius: 5 },

  // Skills
  skillsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  skillChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  skillText: { fontSize: 13, fontFamily: "Poppins_500Medium" },
  selectedBadge: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  selectedText: { fontSize: 12, fontFamily: "Poppins_600SemiBold" },

  // Role notes
  roleNote: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  roleNoteText: { fontSize: 12, fontFamily: "Poppins_400Regular", lineHeight: 16, flex: 1 },

  // City
  label: { fontSize: 12, fontFamily: "Poppins_600SemiBold", letterSpacing: 0.4, marginBottom: 10 },
  cityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  cityBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  cityText: { fontSize: 13, fontFamily: "Poppins_500Medium" },

  // Heard from
  heardGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  heardBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  heardText: { fontSize: 12, fontFamily: "Poppins_500Medium" },

  // Bio
  bioWrap: { borderRadius: 14, borderWidth: 1.5, padding: 14, marginBottom: 20 },
  bioInput: { fontSize: 14, fontFamily: "Poppins_400Regular", lineHeight: 22, minHeight: 110 },
  charCount: { fontSize: 11, fontFamily: "Poppins_400Regular", textAlign: "right", marginTop: 6 },

  // Summary
  summaryCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 8, marginBottom: 8 },
  summaryTitle: { fontSize: 12, fontFamily: "Poppins_700Bold", letterSpacing: 0.5, marginBottom: 4 },
  summaryRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  summaryText: { fontSize: 13, fontFamily: "Poppins_400Regular" },

  // OTP Verification
  otpContainer: { flexDirection: "row", justifyContent: "center", gap: 12, marginBottom: 20 },
  otpInput: { 
    width: 45, 
    height: 55, 
    borderRadius: 12, 
    borderWidth: 2, 
    fontSize: 20, 
    fontFamily: "Poppins_700Bold", 
    textAlign: "center",
    backgroundColor: "transparent"
  },
  otpHint: { fontSize: 13, fontFamily: "Poppins_400Regular", textAlign: "center", marginBottom: 20 },
  resendContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4, marginBottom: 20 },
  resendText: { fontSize: 13, fontFamily: "Poppins_400Regular" },
  resendLink: { fontSize: 13, fontFamily: "Poppins_600SemiBold", textDecorationLine: "underline" },

  // Buttons
  btnRow: { flexDirection: "row", gap: 10, marginTop: 28 },
  skipBtn: { paddingHorizontal: 18, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, justifyContent: "center" },
  skipText: { fontSize: 14, fontFamily: "Poppins_500Medium" },
  nextBtnWrap: { flex: 1, borderRadius: 12, overflow: "hidden" },
  nextBtn: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12 },
  nextBtnText: { fontSize: 16, fontFamily: "Poppins_600SemiBold", color: "#fff" },
  skipFull: { alignItems: "center", paddingVertical: 10 },
});
