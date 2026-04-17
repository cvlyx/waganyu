import { Redirect } from "expo-router";
import React from "react";

import { useAuth } from "@/context/AuthContext";

export default function IndexScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) return <Redirect href="/landing" />;

  // New user — send to profile setup
  if (!user.profileComplete) return <Redirect href="/(auth)/setup" />;

  return <Redirect href="/(tabs)" />;
}
