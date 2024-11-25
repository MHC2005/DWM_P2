import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen name="AddTeam"/>
      <Stack.Screen name="details"/>
      <Stack.Screen name="EditTeam" />
    </Stack>
  );
}
