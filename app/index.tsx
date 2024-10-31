import { View, Text, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useStore from '@/store/useStore'
import { useShallow } from 'zustand/shallow'

const index = () => {

  const [signIn, signInSilent] = useStore(
    useShallow((state)=>[state.signIn, state.signInSilent])
  )

  useEffect(() => {
    signInSilent()
  }, [])

  return (
    <SafeAreaView className='flex-1 justify-between bg-background items-center px-4'>
      <View className='justify-center items-center flex-1'>
        <Text className='text-black font-thin text-6xl'>
          CaseWise!
        </Text>
        <Text className='text-black text-lg'>
          Redefining Legal Clarity with AI!
        </Text>
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