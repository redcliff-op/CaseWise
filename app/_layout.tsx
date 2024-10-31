import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../global.css";
import * as NavigationBar from 'expo-navigation-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  NavigationBar.setBackgroundColorAsync("#F4EEE4")

  return (
    <Stack screenOptions={{ headerShown: false, statusBarStyle: 'dark', statusBarColor:'#F4EEE4'}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Home" options={{animation:'fade_from_bottom'}} />
    </Stack>
  );
}
