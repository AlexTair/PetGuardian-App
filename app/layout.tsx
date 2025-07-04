import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useUserStore } from "@/hooks/useUserStore";
import { usePetStore } from "@/hooks/usePetStore";
import { useTaskStore } from "@/hooks/useTaskStore";
import { mockPets } from "@/mocks/petData";
import { createMockTasks } from "@/mocks/taskData";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  const { pets, addPet } = usePetStore();
  const { tasks, addTask } = useTaskStore();

  // Initialize with mock data if empty
  useEffect(() => {
    if (loaded && pets.length === 0) {
      // Add mock pets
      mockPets.forEach(pet => {
        addPet(pet);
      });
    }
  }, [loaded, pets.length, addPet]);

  // Initialize tasks after pets are loaded
  useEffect(() => {
    if (loaded && pets.length > 0 && tasks.length === 0) {
      const petIds = pets.map(pet => pet.id);
      const mockTasks = createMockTasks(petIds);
      mockTasks.forEach(task => {
        addTask(task);
      });
    }
  }, [loaded, pets, tasks.length, addTask]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="pet/[id]" 
          options={{ 
            title: "Pet Details",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="pet/add" 
          options={{ 
            title: "Add Pet",
            headerBackTitle: "Back",
            presentation: "modal",
          }} 
        />
        <Stack.Screen 
          name="task/add" 
          options={{ 
            title: "Add Task",
            headerBackTitle: "Back",
            presentation: "modal",
          }} 
        />
        <Stack.Screen 
          name="task/[id]" 
          options={{ 
            title: "Task Details",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="ai/scanner" 
          options={{ 
            title: "AI Health Scanner",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="ai/results" 
          options={{ 
            title: "Scan Results",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="premium" 
          options={{ 
            title: "Premium Features",
            headerBackTitle: "Back",
          }} 
        />
      </Stack>
    </>
  );
}
