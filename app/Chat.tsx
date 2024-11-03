import { View, Text, TextInput, Pressable, FlatList } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useStore from '@/store/useStore'
import { useShallow } from 'zustand/shallow'
import Animated, { FadeIn, FadeInDown, FadeInRight, FadeOut, FadeOutDown, FadeOutRight, LinearTransition } from 'react-native-reanimated'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import ChatCard from '@/components/ChatCard'
import { ChatItem } from '@/global'
import LottieView from 'lottie-react-native'

const Chat = () => {

  const [getChatResponse, messageList, responseLoading] = useStore(
    useShallow((state) => [state.getChatResponse, state.messageList, state.responseLoading])
  )
  const [message, setMessage] = useState<string>("")

  const handleSendMessage = async () => {
    const newMessage: ChatItem = {
      ai: false,
      message: message.trimEnd(),
      time: new Date().toLocaleTimeString().slice(0, -3)
    }
    useStore.setState({
      messageList: [...messageList, newMessage]
    })
    setMessage("")
    await getChatResponse(newMessage)
  }

  const animation = useRef(null)

  return (
    <SafeAreaView className='flex-1 bg-background px-4 justify-between'>
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
            CaseWise Lawbot!
          </Text>
          <Text className='text-black'>
            Your go-to legal assistant for answers anytime!
          </Text>
        </View>
      </View>
      <Animated.FlatList
        layout={LinearTransition}
        data={messageList.toReversed()}
        inverted
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) =>
          <ChatCard chatItem={item} />
        }
      />
      {responseLoading ? (
        <Animated.View
          entering={FadeInDown}
          exiting={FadeOutDown}
          className='self-center'
        >
          <LottieView
            ref={animation}
            autoPlay
            loop
            source={require('../assets/raw/thinking.json')}
            style={{
              width: 100,
              height: 100
            }}
          />
        </Animated.View>
      ) : null}
      <Animated.View
        entering={FadeInDown}
        exiting={FadeOutDown}
        className=' mb-2 flex-row items-center gap-2 justify-between'
      >
        <Animated.View layout={LinearTransition} className='rounded-full bg-darkbg flex-auto flex-row items-center justify-between'>
          <TextInput
            className=' flex-initial mr-3 m-5'
            value={message}
            onChangeText={setMessage}
            placeholder='Chat with Your Virtual Legal Assistant!'
            placeholderTextColor={'#CBD5E0'}
            style={{ color: 'white' }}
            onFocus={() => {

            }}
          />
          <Animated.View
            layout={LinearTransition}
            className='rounded-full bg-background p-4 m-1'
          >
            <Pressable
              onPress={() => { }}
            >
              <Ionicons name='image-outline' size={30} />
            </Pressable>
          </Animated.View>
        </Animated.View>
        {(message && !responseLoading) ? (
          <Animated.View entering={FadeInRight} exiting={FadeOutRight} className='p-5 bg-darkbg rounded-full'>
            <Pressable
              onPress={handleSendMessage}
            >
              <Ionicons name='send' color={'#F4EEE4'} size={25} />
            </Pressable>
          </Animated.View>
        ) : null}
      </Animated.View>
    </SafeAreaView>
  )
}

export default Chat;