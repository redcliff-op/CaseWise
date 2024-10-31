import { View, Text, Button, Dimensions, ScrollView, Pressable } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useStore from '@/store/useStore'
import { useShallow } from 'zustand/shallow'
import * as DocumentPicker from 'expo-document-picker';
import LottieView from 'lottie-react-native';
import Ionicons from '@expo/vector-icons/Ionicons'

const Documents = () => {

  const [getGeminiResponse] = useStore(
    useShallow((state) => [state.getGeminiResponse])
  )

  const animation = useRef<LottieView>(null);

  return (
    <SafeAreaView className='flex-1 bg-background px-4'>
      <ScrollView >
        <Text className='text-primary text-xl font-bold'>
          Essential Legal Summary!
        </Text>
        <Text className='text-black text-base'>
          We read between the lines, so you don’t have to!
        </Text>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: '100%',
            height: Dimensions.get('screen').height * 0.3,
            alignSelf: 'center',
            marginRight: Dimensions.get('screen').width * 0.15
          }}
          source={require('../assets/raw/document.json')}
        />
        <View className='gap-2'>
          <View className='p-5 bg-secondary rounded-xl'>
            <Text className='text-lg text-black font-bold'>
              Upload your contract, agreement, or legal document, and let us transform it into a clear, easy-to-read summary. Find out what's important, identify potential risks, and see any hidden details—all in one place!
            </Text>
          </View>
          <View className='p-5 bg-secondary rounded-xl'>
            <Text className='text-lg text-primary font-semibold'>
              No more legal jargon—just a simple, informative breakdown of everything you need to know about your document.
            </Text>
          </View>
          <Pressable
            className='p-5 bg-tertiary rounded-xl flex-row items-center justify-between'
          >
            <Text className='text-lg text-background font-semibold'>
              Your Documents go here!
            </Text>
            <Ionicons
              name='cloud-upload'
              size={20}
              color={'#F4EEE4'}
            />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Documents