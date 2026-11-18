import { Tabs } from "expo-router";

import { Text } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarStyle: {
          height: 68 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 8),
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 23 }}>
              {focused ? "\u{1F3E1}" : "\u{1F3E0}"}
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Tambah",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 23 }}>
              {focused ? "\u{1F58B}\u{FE0F}" : "\u{270D}\u{FE0F}"}
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorite",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 23 }}>
              {focused ? "\u{1F496}" : "\u{1F497}"}
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
