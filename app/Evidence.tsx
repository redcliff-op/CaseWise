import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useStore from '@/store/useStore'
import { useShallow } from 'zustand/shallow'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'

const Evidence = () => {

  const [currentCase] = useStore(
    useShallow((state)=>[state.currentCase])
  )

  return (
    <SafeAreaView className='flex-1 bg-background px-4'>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            <Text className='text-xl text-darkbg font-bold'>
              Evidence List
            </Text>
            <Text className='text-base text-darkbg'>
              View and manage your evidences
            </Text>
          </View>
       </View>
        {currentCase?.evidenceCollection?.map((item) =>
          <View className='bg-secondary my-1 rounded-xl p-5'>
            {item.title ?
              <Text className='font-semibold text-darkbg text-lg'>
                Title: {item.title}
              </Text> : null}

            {item.description ?
              <Text className='text-darkbg font-semibold'>
                Description: <Text className='font-normal'>{item.description}</Text>
              </Text> : null}

            {item.uploadDate ?
              <Text className='text-darkbg font-semibold'>
                Upload Date: <Text className='font-normal'>{item.uploadDate}</Text>
              </Text> : null}

            {item.evidenceType ?
              <Text className='text-darkbg font-semibold'>
                Type: <Text className='font-normal'>{item.evidenceType}</Text>
              </Text> : null}
          </View>

        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Evidence