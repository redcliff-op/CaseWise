import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated'
import useStore from '@/store/useStore'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {

  const { user, signOut } = useStore()

  return (
    <SafeAreaView className='flex-1 bg-background px-4 justify-between'>
      <View className=' gap-2 -mx-4'>
        <Animated.Image
          sharedTransitionTag={user?.user.email + "-image"}
          source={{ uri: user?.user?.photo?.toString() }}
          className='w-[50%] aspect-square self-center rounded-full border-primary'
        />
        <View>
          <Text className='text-2xl font-bold text-primary self-center'>
            {user?.user.name}
          </Text>
          <Text className='text-base font-semibold text-black self-center'>
            {user?.user.email}
          </Text>
        </View>
      </View>
      <Animated.View entering={FadeInDown}>
        <Pressable
          onPress={signOut}
          className='p-5 bg-primary rounded-full'
        >
          <Text className='text-center text-xl text-white font-semibold'>
            Sign Out
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  )
}

export default Profile