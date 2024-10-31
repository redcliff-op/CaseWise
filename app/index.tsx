import { View, Text, Pressable, Dimensions } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useStore from '@/store/useStore'
import { useShallow } from 'zustand/shallow'
import LottieView from 'lottie-react-native'

const index = () => {

  const [signIn, signInSilent] = useStore(
    useShallow((state) => [state.signIn, state.signInSilent])
  )

  useEffect(() => {
    signInSilent()
  }, [])

  const animation = useRef(null)

  return (
    <SafeAreaView className='flex-1 justify-between bg-background items-center px-4'>
      <View className='items-center flex-1 justify-center'>
        <Text className='text-black font-thin text-6xl'>
          CaseWise!
        </Text>
        <Text className='text-black text-lg'>
          Redefining Legal Clarity with AI!
        </Text>
        <LottieView
          autoPlay
          loop
          source={require('../assets/raw/hammer.json')}
          ref={animation}
          style={{
            width: Dimensions.get('screen').width *0.7,
            height: Dimensions.get('screen').height * 0.3,
          }}
        />
      </View>
      <Pressable
        onPress={signIn}
        className='bg-primary flex-row self-stretch items-center p-5 justify-center rounded-full'
      >
        <Text className='text-white text-2xl'>
          Sign In
        </Text>
      </Pressable>
    </SafeAreaView >
  )
}

export default index