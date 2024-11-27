import { View, Text, Pressable, ScrollView, Dimensions, TextInput, Alert, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import LottieView from 'lottie-react-native'
import useStore from '@/store/useStore'
import { useShallow } from 'zustand/shallow'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { navigatorInfo } from '@/utils/utils'

const NewCase = () => {

  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [initNewCase, responseLoading] = useStore(
    useShallow((state) => [state.initNewCase, state.responseLoading])
  )
  const animation = useRef(null)

  const handleInitNewCase = async () => {
    if (!(title && description)) {
      Alert.alert("Insufficient information", "Kindly fill all the details given below")
      return;
    }
    await initNewCase(title, description)
    router.navigate("/CaseNavigator")
    Alert.alert("Welcome to your Case Navigator!", navigatorInfo)
  }

  return (
    <SafeAreaView className='flex-1 bg-background px-4'>
      <View className='flex-row items-center gap-3'>
        <Pressable
          onPress={() => {
            router.dismiss()
          }}
          className='rounded-full p-3 bg-secondary'
        >
          <Ionicons name='arrow-back' size={25} />
        </Pressable>
        <View>
          <Text className='text-primary text-xl font-bold'>
            New Case
          </Text>
          <Text className='text-black'>
            Add case details below!
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        <LottieView
          source={require('../assets/raw/lawyers.json')}
          ref={animation}
          autoPlay
          loop
          style={{
            width: '80%',
            height: Dimensions.get('screen').height * 0.25,
            alignSelf: 'center',
            marginBottom: 20
          }}
        />
        <Text className='text-darkbg text-lg font-bold'>
          Case Title
        </Text>
        <View className='border-2 rounded-2xl p-3 border-darkbg'>
          <TextInput
            value={description}
            onChangeText={setDescription}
            numberOfLines={1}
            multiline={false}
            placeholder='Enter case title'
          />
        </View>
        <Text className='text-darkbg text-lg font-bold mt-5'>
          Case Descriotion
        </Text>
        <View className='border-2 rounded-2xl p-3 border-darkbg'>
          <TextInput
            value={title}
            onChangeText={setTitle}
            multiline={true}
            numberOfLines={10}
            placeholder='give a brief description of your case!'
          />
        </View>
        <Pressable
          onPress={() => {
            handleInitNewCase()
          }}
          className={`bg-primary rounded-2xl mt-5 flex-row items-center ${responseLoading ? 'justify-between' : 'justify-center'}`}
        >
          <Animated.Text layout={LinearTransition} className='text-background m-5 text-lg font-bold text-center transition-all'>
            {responseLoading ? "Initiating new case" : "Get Started"}
          </Animated.Text>
          {responseLoading ?
            <>
              <ActivityIndicator color={'white'} size={35} className='mr-5' />
            </>
            : null}
        </Pressable>
        <View className='h-[60]'></View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default NewCase