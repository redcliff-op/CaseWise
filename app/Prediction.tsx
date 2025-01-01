import { View, Text, Dimensions, Image, Pressable, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import * as DocumentPicker from 'expo-document-picker';
import useStore from '@/store/useStore';
import { useShallow } from 'zustand/shallow';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';


const Prediction = () => {

  const [responseLoading, getCasePrediction, casePrediction] = useStore(
    useShallow((state) => [state.responseLoading, state.getCasePrediction, state.casePrediction])
  )

  const animation = useRef(null)
  const [keyFactorsExpanded, setKeyFactorsExpanded] = useState<boolean>(false)
  const [improvementsExpanded, setImprovementsExpanded] = useState<boolean>(false)
  const [uncertainityExpanded, setUncertainityExpanded] = useState<boolean>(false)

  const handlePredict = async () => {
    const docPickerElement = await DocumentPicker.getDocumentAsync()
    const doc = docPickerElement.assets!![0].uri
    if (doc) {
      getCasePrediction(doc)
    }
  }

  const intensityBackgroundColor = (outcome: string): string => {
    switch (outcome) {
      case "Low":
        return "bg-red-300"
      case "Medium":
        return "bg-yellow-300"
      case "High":
        return "bg-green-300"
      default:
        return "bg-yellow-300"
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-background px-4 pb-20'>
      {responseLoading ?
        <Animated.View className='flex-1 bg-background items-center justify-center' entering={FadeIn} exiting={FadeOut}>
          <LottieView
            source={require('../assets/raw/docprocessing.json')}
            ref={animation}
            autoPlay
            loop
            style={{
              width: '100%',
              height: Dimensions.get('screen').height * 0.3,
              alignSelf: 'center',
              marginBottom: 10
            }}
          />
          <Text className='text-primary text-2xl font-bold'>
            Hang Tight!
          </Text>
          <Text className='text-primary text-lg font-bold'>
            Predicting the ongoing Case!
          </Text>
        </Animated.View>
        :
        <>
          {casePrediction ?
            <ScrollView showsVerticalScrollIndicator={false}>
              <LottieView
                autoPlay
                loop
                ref={animation}
                source={require('../assets/raw/hammer.json')}
                style={{
                  width: '90%',
                  height: Dimensions.get('screen').height * 0.3,
                  alignSelf: 'center',
                  marginBottom: 10
                }}
              />
              {casePrediction.predictedOutcome ?
                <>
                  <View className='bg-darkbg rounded-xl p-5 gap-5 mb-2'>
                    <View className='flex-row justify-between items-center text-center'>
                      <Text className='text-background text-xl font-semibold'>Predicted Outcome</Text>
                      <Image className='w-[25] h-[25]' source={require('../assets/icons/outcome.png')} tintColor={'white'} />
                    </View>
                    <Text className='text-background'>{casePrediction.predictedOutcome}</Text>
                    <Text className='text-background font-bold'>Success Rate: <Text className='font-normal'>{casePrediction.successRate}</Text></Text>
                  </View>
                </>
                : null}
              {casePrediction.predictionConfidence ?
                <>
                  <View className={`rounded-xl p-5 mb-2 ${intensityBackgroundColor(casePrediction.predictionConfidence)}`}>
                    <Text className='text-darkbg text-xl font-semibold'>Predicted Confidence</Text>
                    <Text className='text-darkbg'>{casePrediction.predictionConfidence}</Text>
                  </View>
                </>
                : null}
              {casePrediction.riskLevel ?
                <>
                  <View className={`rounded-xl p-5 mb-2 ${intensityBackgroundColor(casePrediction.riskLevel)}`}>
                    <Text className='text-darkbg text-xl font-semibold'>Risk Level</Text>
                    <Text className='text-darkbg'>{casePrediction.riskLevel}</Text>
                  </View>
                </>
                : null}
              {casePrediction.keyFactors?.length !== 0 ?
                <>
                  <Pressable onPress={() => { setKeyFactorsExpanded(!keyFactorsExpanded) }} className='rounded-xl mb-2 bg-secondary'>
                    <View className='p-5 flex-row items-center justify-between'>
                      <Text className=' text-darkbg font-semibold text-xl'>
                        Key Factors
                      </Text>
                      <Ionicons
                        name={keyFactorsExpanded ? 'arrow-up' : 'arrow-down'}
                        size={24}
                        color={'black'}
                      />
                    </View>
                    <Collapsible collapsed={!keyFactorsExpanded}>
                      <View className='p-2'>
                        {casePrediction.keyFactors?.map((item) =>
                          <View className='rounded-lg p-2 my-1 bg-background'>
                            <Text className='font-semibold'>{item}</Text>
                          </View>
                        )}
                      </View>
                    </Collapsible>
                  </Pressable>
                </>
                : null}
              {casePrediction.improvementStrategies?.length !== 0 ?
                <>
                  <Pressable onPress={() => { setImprovementsExpanded(!improvementsExpanded) }} className='rounded-xl mb-2 bg-secondary'>
                    <View className='p-5 flex-row items-center justify-between'>
                      <Text className=' text-darkbg font-semibold text-xl'>
                        Improvement Stratergies
                      </Text>
                      <Ionicons
                        name={improvementsExpanded ? 'arrow-up' : 'arrow-down'}
                        size={24}
                        color={'black'}
                      />
                    </View>
                    <Collapsible collapsed={!improvementsExpanded}>
                      <View className='p-2'>
                        {casePrediction.improvementStrategies?.map((item) =>
                          <View className='rounded-lg p-2 my-1 bg-background'>
                            <Text className='font-semibold'>{item}</Text>
                          </View>
                        )}
                      </View>
                    </Collapsible>
                  </Pressable>
                </>
                : null}
              {casePrediction.uncertaintyFactors?.length !== 0 ?
                <>
                  <Pressable onPress={() => { setUncertainityExpanded(!uncertainityExpanded) }} className='rounded-xl mb-2 bg-tertiary'>
                    <View className='p-5 flex-row items-center justify-between'>
                      <Text className=' text-background font-semibold text-xl'>
                        Uncertainity Factors
                      </Text>
                      <Ionicons
                        name={uncertainityExpanded ? 'arrow-up' : 'arrow-down'}
                        size={24}
                        color={'white'}
                      />
                    </View>
                    <Collapsible collapsed={!uncertainityExpanded}>
                      <View className='p-2'>
                        {casePrediction.uncertaintyFactors?.map((item) =>
                          <View className='rounded-lg p-2 my-1 bg-background'>
                            <Text className='font-semibold'>{item}</Text>
                          </View>
                        )}
                      </View>
                    </Collapsible>
                  </Pressable>
                </>
                : null}
              {casePrediction.potentialRewards ?
                <>
                  <View className='bg-tertiary rounded-xl p-5 gap-5 mb-2'>
                    <View className='flex-row justify-between items-center'>
                      <Text className='text-background text-xl font-semibold text-center'>Potential Rewards</Text>
                      <Image className='w-[25] h-[25]' source={require('../assets/icons/rewards.png')} tintColor={'white'} />
                    </View>
                    <Text className='text-background'>{casePrediction.potentialRewards}</Text>
                  </View>
                </>
                : null}
              <Pressable
                onPress={() => {
                  useStore.setState({ casePrediction: null })
                }}
                className='bg-primary rounded-xl p-5 items-center justify-center'
              >
                <Text className='text-background font-bold text-lg'>
                  Clear Prediction
                </Text>
              </Pressable>
              <View className='h-[80]'></View>
            </ScrollView>
            :
            <>
              <View>
                <Text className='text-primary text-xl font-bold'>
                  CaseWise Case Predictor!
                </Text>
                <Text className='text-black'>
                  Predict the outcome of any Case!
                </Text>
              </View>
              <View className='flex-1 justify-center gap-2'>
                <LottieView
                  autoPlay
                  loop
                  ref={animation}
                  source={require('../assets/raw/predictionscreen.json')}
                  style={{
                    width: '100%',
                    height: Dimensions.get('screen').height * 0.3,
                    alignSelf: 'center',
                    marginBottom: 10
                  }}
                />
                <View className='bg-secondary rounded-xl p-5'>
                  <Text className='text-darkbg text-lg font-bold'>
                    CaseWise can predict and analyze ongoing cases for you, Designed for legal professionals, it helps in evaluating case strengths and planning strategies.!
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    handlePredict()
                  }}
                  className='rounded-xl p-5 bg-tertiary flex-row items-center justify-between'
                >
                  <Text className='text-background text-base font-bold'>Upload Case Document</Text>
                  <Image source={require('../assets/icons/document.png')} className='w-[30] h-[30]' tintColor={'white'} />
                </Pressable>
              </View>
            </>
          }
        </>
      }
    </SafeAreaView>
  )
}

export default Prediction