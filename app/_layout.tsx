import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import "../global.css";
import * as NavigationBar from 'expo-navigation-bar';
import { View } from 'react-native';
import useUtilStore from '@/store/useUtilStore';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import TabButton from '../components/TabButton';

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

  const { isTabScreen } = useUtilStore();
  const [activeScreen, setActiveScreen] = useState<number>(0);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  NavigationBar.setBackgroundColorAsync("#F4EEE4");

  return (
    <View className='flex-1'>
      {isTabScreen && (
        <Animated.View
          entering={FadeInDown}
          exiting={FadeOutDown}
          className='p-1 bg-darkbg flex-row absolute z-10 gap-2 self-center bottom-0 rounded-full'
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab.name}
              onPress={() => setActiveScreen(tab.screenIndex)}
              isActive={activeScreen === tab.screenIndex}
              icon={tab.icon}
            />
          ))}
        </Animated.View>
      )}
      <Stack screenOptions={{ headerShown: false, statusBarStyle: 'dark', statusBarColor: '#F4EEE4' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="Home" options={{ animation: 'fade' }} />
        <Stack.Screen name="Profile" options={{ animation: 'ios' }} />
      </Stack>
    </View>
  );
};

export default RootLayout;
