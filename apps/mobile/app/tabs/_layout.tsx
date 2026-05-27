import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Add Meal' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
    </Tabs>
  )
}