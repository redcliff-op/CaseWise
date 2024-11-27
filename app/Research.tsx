import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useStore from '@/store/useStore'
import { useShallow } from 'zustand/shallow'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'

const Research = () => {

  const [currentCase] = useStore(
    useShallow((state) => [state.currentCase])
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
              Research Findings
            </Text>
            <Text className='text-base text-darkbg'>
              View and manage research
            </Text>
          </View>
       </View>
        {currentCase?.legalResearch?.map((item) =>
          <View className='bg-secondary my-1 rounded-xl p-5'>
            {item.topic ?
              <Text className='font-semibold text-darkbg text-lg'>
                Topic: {item.topic}
              </Text> : null}
            {item.notes ?
              <Text className='text-darkbg font-semibold'>
                Notes: <Text className='font-normal'>{item.notes}</Text>
              </Text> : null}
            {item.precedentCase.caseTitle ?
              <Text className='text-darkbg font-semibold'>
                Title: <Text className='font-normal'>{item.precedentCase.caseTitle}</Text>
              </Text> : null}
            {item.precedentCase.caseSummary ?
              <Text className='text-darkbg font-semibold'>
                Summary: <Text className='font-normal'>{item.precedentCase.caseSummary}</Text>
              </Text> : null}
            {item.precedentCase.rulingDate ?
              <Text className='text-darkbg font-semibold'>
                Ruling Date: <Text className='font-normal'>{item.precedentCase.rulingDate}</Text>
              </Text> : null}
            {item.precedentCase.court ?
              <Text className='text-darkbg font-semibold'>
                Court: <Text className='font-normal'>{item.precedentCase.court}</Text>
              </Text> : null}
          </View>

        )}
        <View className='h-[60]'></View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Research