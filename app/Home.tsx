import { View, Text, Pressable, Dimensions } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useStore from '@/store/useStore'
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown } from 'react-native-reanimated'

import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { useShallow } from 'zustand/shallow'
import { getGreeting } from '@/utils/utils'
import LottieView from 'lottie-react-native'

const Home = () => {

  const [user, loadInitialPromopt, caseList] = useStore(
    useShallow((state) => [state.user, state.loadInitialPrompt, state.caseList])
  )

  useEffect(() => {
    //loadInitialPromopt()
  }, [])

  const animation = useRef(null)

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
      <View className='flex-1 '>
        {caseList.length === 0 ?
          <View className='justify-center flex-1 pb-40 px-5'>
            <Text className='text-darkbg text-2xl font-semibold'>
              No Ongoing Cases!
            </Text>
            <Text className='text-gray-600 text-lg font'>
              Click on the add button to get assistance for any of your legal cases!
            </Text>
          </View>
          :
          <>
            {caseList.map((item) =>
              <Pressable
                onPress={() => {
                  useStore.setState({ currentCase: item })
                  router.navigate("/CaseNavigator")
                }}
              >
                <Text>
                  {item.caseFiling.caseTitle}
                </Text>
              </Pressable>
            )}
          </>
        }
      </View>
      <Pressable
        onPress={() => {
          router.navigate("/NewCase")
        }}
        className='absolute p-4 bg-primary bottom-24 right-10 rounded-full'
      >
        <Ionicons name='add' color={'white'} size={30} />
      </Pressable>
    </SafeAreaView>
  )
}

export default Home