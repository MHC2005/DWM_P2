import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen name="AddPlanet"/>
      <Stack.Screen name="details"/>
    </Stack>
  );
}
