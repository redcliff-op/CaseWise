import { useFonts } from 'expo-font';
import { router, Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import "../global.css";
import * as NavigationBar from 'expo-navigation-bar';
import { View, StatusBar, AppState } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import TabButton from '../components/TabButton';
import { Tab } from '@/global';

SplashScreen.preventAutoHideAsync();

const tabs: Tab[] = [
  { name: 'Home', icon: require('../assets/icons/tabhome.png'), screenIndex: 0 },
  { name: 'Chat', icon: require('../assets/icons/tabchat.png'), screenIndex: 1 },
  { name: 'Documents', icon: require('../assets/icons/tabdocument.png'), screenIndex: 2 },
  { name: 'Prediction', icon: require('../assets/icons/tabprediction.png'), screenIndex: 3 },
  { name: 'Settings', icon: require('../assets/icons/tabsettings.png'), screenIndex: 4 },
];

const RootLayout: React.FC = () => {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [activeScreen, setActiveScreen] = useState<number>(0);
  const segments = useSegments() as string[];

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }


  NavigationBar.setBackgroundColorAsync("#F4EEE4");
  StatusBar.setBarStyle("dark-content");

  const screensWithoutNav = ['Profile', 'index', 'Summary','Chat','NewCase','CaseNavigator','Evidence','Research','Hearing'];
  const shouldShowNav = (segments.length>=1) ? !segments.some(segment => screensWithoutNav.includes(segment)):null

  return (
    <View className='flex-1'>
      {shouldShowNav && (
        <Animated.View
          entering={FadeInDown.duration(400)}
          exiting={FadeOutDown.duration(400)}
          className='p-1 bg-darkbg flex-row absolute z-10 gap-2 self-center bottom-0 rounded-full'
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab.name}
              onPress={()=>{
                setActiveScreen(tab.screenIndex)
                router.navigate(tab.name)
              }}
              isActive={activeScreen === tab.screenIndex}
              icon={tab.icon}
            />
          ))}
        </Animated.View>
      )}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="Home" options={{ animation: 'flip' }} />
        <Stack.Screen name="Documents" options={{ animation: 'flip' }} />
        <Stack.Screen name="Summary" options={{ animation: 'flip' }} />
        <Stack.Screen name="Chat" options={{ animation: 'flip' }} />
        <Stack.Screen name="Prediction" options={{ animation: 'flip' }} />
        <Stack.Screen name="NewCase" options={{ animation: 'flip' }} />
        <Stack.Screen name="CaseNavigator" options={{ animation: 'flip' }} />
        <Stack.Screen name="Evidence" options={{ animation: 'flip' }} />
        <Stack.Screen name="Research" options={{ animation: 'flip' }} />
        <Stack.Screen name="Hearing" options={{ animation: 'flip' }} />
        <Stack.Screen name="Profile" options={{ animation: 'ios' }} />
      </Stack>
    </View>
  );
};

export default RootLayout;
