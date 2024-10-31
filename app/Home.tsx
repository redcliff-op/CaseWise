import { View, Text, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useStore from '@/store/useStore'
import Animated from 'react-native-reanimated'

const Home = () => {

  const {user} = useStore()

  return (
    <SafeAreaView className='flex-1 px-4 bg-background'>
      <View className=' items-center gap-2 flex-row'>
        <Animated.Image source={{ uri: user?.user.photo?.toString() }} className='w-[50] h-[50] rounded-full' />
        <View>
          <Text className='text-primary font-bold text-xl'>Welcome {user?.user.givenName}!</Text>
          <Text className='text-gray-700 text-base'>Lead the Way in Intelligent Legal Transformation!</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Home