import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import useStore from '@/store/useStore'
import { useShallow } from 'zustand/shallow'
import { SafeAreaView } from 'react-native-safe-area-context'
import Collapsible from 'react-native-collapsible'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'

const Hearing = () => {

  const [currentCase, responseLoading, getHearingAdvice] = useStore(
    useShallow((state) => [state.currentCase, state.responseLoading, state.getHearingAdvice])
  )
  const [advice, setAdvice] = useState<string>("")
  const [adviceRecieved, setAdviceRecieved] = useState<boolean>(false)

  const handleGetAdvice = async () => {
    if (!adviceRecieved) {
      const advice = await getHearingAdvice(currentCase!!)
      setAdvice(advice)
      setAdviceRecieved(true)
    }
  }

  return (
    <SafeAreaView className='bg-background px-4 flex-1'>
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
              Hearing List
            </Text>
            <Text className='text-base text-darkbg'>
              View and manage hearings
            </Text>
          </View>
        </View>
        {currentCase?.hearingManagement?.map((item) =>
          <View className='bg-secondary my-1 rounded-xl p-5'>
            {item.hearingDate ?
              <Text className='font-semibold text-darkbg text-lg'>
                Hearing Date: <Text className='font-normal'>{item.hearingDate}</Text>
              </Text> : null}

            {item.courtName ?
              <Text className='font-semibold text-darkbg text-lg'>
                Court name: <Text className='font-normal'>{item.courtName}</Text>
              </Text> : null}

            {item.judgeName ?
              <Text className='font-semibold text-darkbg text-lg'>
                Judge Name: <Text className='font-normal'>{item.judgeName}</Text>
              </Text> : null}

            {item.agenda ?
              <Text className='font-semibold text-darkbg text-lg'>
                Agenda: <Text className='font-normal'>{item.agenda}</Text>
              </Text> : null}

            {item.outcome ?
              <Text className='font-semibold text-darkbg text-lg'>
                Outcome: <Text className='font-normal'>{item.outcome}</Text>
              </Text> : null}

            {item.rescheduleDetails?.rescheduledDate ?
              <Text className='font-semibold text-darkbg text-lg'>
                Rescheduled Date: <Text className='font-normal'>{item.rescheduleDetails.rescheduledDate}</Text>
              </Text> : null}

            {item.rescheduleDetails?.reason ?
              <Text className='font-semibold text-darkbg text-lg'>
                Reschedule Reason: <Text className='font-normal'>{item.rescheduleDetails.reason}</Text>
              </Text> : null}
          </View>
        )}
        <View className='h-[150]'></View>
      </ScrollView>
      <Pressable
        onPress={() => {
          handleGetAdvice()
        }}
        className='absolute bg-darkbg p-5 rounded-xl bottom-0 w-[100%] self-center max-h-[50%]'
      >
        <Collapsible collapsed={!advice}>
          <ScrollView>
            <Text className='text-background'>{advice}</Text>
          </ScrollView>
        </Collapsible>
        {responseLoading ?
          <ActivityIndicator color={'white'} size={25}/>
        :
          <Text className={`text-lg font-bold text-center text-background ${advice ? 'mt-5' : null}`}>
            {advice ? 'Future hearing advice' : 'Get Future hearing Assistance!'}
          </Text>
        }
      </Pressable>
    </SafeAreaView>
  )
}

export default Hearing