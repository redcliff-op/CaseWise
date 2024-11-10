import { View, Text, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useStore from '@/store/useStore'
import Animated, { SharedTransition } from 'react-native-reanimated'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { useShallow } from 'zustand/shallow'
import { getGreeting } from '@/utils/utils'

const Home = () => {

  const [user, loadInitialPromopt] = useStore(
    useShallow((state) => [state.user, state.loadInitialPrompt])
  )

  useEffect(()=>{
    loadInitialPromopt()
  },[])

  return (
    <SafeAreaView className='flex-1 px-4 bg-background'>
      <View className=' items-center flex-row justify-between'>
        <View className='flex-row gap-2 items-center'>
          <Animated.Image
            //sharedTransitionTag={user?.user.email + "-image"}
            source={{ uri: user?.user.photo?.toString() }}
            className='w-[50] h-[50] rounded-full'
          />
          <View>
            <Text className='text-black text-base'>{getGreeting()}</Text>
            <Text className='text-primary font-bold text-xl'>{user?.user.name}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => {
            router.navigate("/Profile")
          }}
          className='bg-secondary rounded-full p-3'
        >
          <Ionicons name='person' size={25} />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default Home