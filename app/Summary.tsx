import { View, Text, ScrollView, Pressable, Dimensions, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useStore from '@/store/useStore'
import { useShallow } from 'zustand/shallow'
import * as Speech from "expo-speech"
import Markdown from 'react-native-markdown-display';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown } from 'react-native-reanimated'
import Collapsible from 'react-native-collapsible'
import Ionicons from '@expo/vector-icons/Ionicons'
import LottieView from 'lottie-react-native'
import { Picker } from '@react-native-picker/picker';
import { languageMapping, languages } from '@/utils/constants/languages'
import Slider from '@react-native-community/slider';

const Summary = () => {

  const [documentSummary, getDocumentSummary, responseLoading, lines, userData, syncUserData] = useStore(
    useShallow((state) => [state.documentSummary, state.getDocumentSummary, state.responseLoading, state.documentSummaryLines, state.userData, state.syncUserData])
  );

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playerExpanded, setPlayerExpanded] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>(userData.preferences.summaryLang);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [speechPitch, setSpeechPitch] = useState<number>(1);
  const [currentLine, setCurrentLine] = useState<number>(0);

  useEffect(() => {

    if (isPlaying && lines) {
      const playLine = async (index: number) => {
        if (index < lines.length) {
          setCurrentLine(index);
          Speech.speak(lines[index], {
            language: languageMapping[language],
            rate: speechRate,
            pitch: speechPitch,
            onDone: () => {
              playLine(index + 1);
            },
            onStopped: () => {
              setIsPlaying(false);
            }
          });
        } else {
          setIsPlaying(false);
        }
      };

      playLine(0);
    }
  }, [isPlaying, lines, speechRate, speechPitch]);

  const handleSummarise = async () => {
    await getDocumentSummary(language);
    setCurrentLine(0);
  };

  const handleSpeakStop = async (override: boolean) => {
    if (await Speech.isSpeakingAsync() || override) {
      Speech.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleLanguageChange = async(lang: string) => {
    useStore.setState((state) => ({
      userData: {
        ...state.userData,
        preferences: {
          ...state.userData.preferences,
          summaryLang: lang 
        }
      }
    }));
    setLanguage(lang)
    await syncUserData()
  }

  const animation = useRef(null);

  return (
    <SafeAreaView className='flex-1 bg-background px-4'>
      {responseLoading ? (
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
            We are summarising your document!
          </Text>
        </Animated.View>
      ) : (
        <>
          {documentSummary ? (
            <>
              <Animated.View
                entering={FadeInDown.duration(400)}
                exiting={FadeOutDown.duration(400)}
                className=' z-10 rounded-3xl absolute bg-darkbg bottom-0 self-center w-full'
              >
                <Collapsible collapsed={!playerExpanded}>
                  <View className='p-5'>
                    <Text className='text-background text-lg'>Speech Rate: {speechRate.toFixed(2)}</Text>
                    <Slider
                      style={{ width: '100%', height: 40 }}
                      minimumValue={0.1}
                      maximumValue={2.0}
                      value={speechRate}
                      step={0.1}
                      onValueChange={setSpeechRate}
                      minimumTrackTintColor="#EBD9CD"
                      maximumTrackTintColor="#000000"
                    />
                    <Text className='text-background text-lg'>Pitch: {speechPitch.toFixed(2)}</Text>
                    <Slider
                      style={{ width: '100%', height: 40 }}
                      minimumValue={0.5}
                      maximumValue={2.0}
                      value={speechPitch}
                      step={0.1}
                      onValueChange={setSpeechPitch}
                      minimumTrackTintColor="#EBD9CD"
                      maximumTrackTintColor="#000000"
                    />
                  </View>
                </Collapsible>
                <View className='flex-row items-center justify-between'>
                  <View className='flex-row items-center p-5 gap-5'>
                    <Pressable
                      onPress={() => {
                        if (isPlaying) {
                          Alert.alert("Playback Detected!", "Kindly stop the recitation to access playback controls!")
                        } else {
                          setPlayerExpanded(!playerExpanded)
                        }
                      }}
                    >
                      <Ionicons name={playerExpanded ? 'arrow-down' : 'arrow-up'} color={'white'} size={22} />
                    </Pressable>
                    {isPlaying ? (
                      <View className='-my-5'>
                        <LottieView
                          source={require('../assets/raw/audio.json')}
                          ref={animation}
                          autoPlay
                          loop
                          style={{
                            width: 70,
                            height: 58,
                            alignSelf: 'center',
                          }}
                        />
                      </View>
                    ) : (
                      <Text className='text-background text-lg font-bold'>Start Oral Recitation!</Text>
                    )}
                  </View>
                  <Pressable
                    onPress={() => { handleSpeakStop(false) }}
                    className='p-2 m-2 rounded-2xl bg-background'
                  >
                    <Ionicons name={!isPlaying ? 'play' : 'ban'} color={'black'} size={30} />
                  </Pressable>
                </View>
              </Animated.View>
              <ScrollView showsVerticalScrollIndicator={false} className='-mx-2'>
                {lines?.map((line, index) => (
                  <Animated.View
                    key={index}
                    className='rounded-xl px-4'
                    style={{
                      backgroundColor: (index === currentLine) ? "#507680" : '#F4EEE4'
                    }}
                  >
                    <Markdown style={{
                      text: {
                        color: (index === currentLine) ? '#F4EEE4' : '#452B01',
                        fontSize: 17
                      }
                    }}
                    >{line}</Markdown>
                  </Animated.View>
                ))}
                <Pressable
                  onPress={() => {
                    useStore.setState({ documentSummary: null, documentSummaryLines: null })
                    handleSpeakStop(true)
                  }}
                  className='rounded-full bg-primary items-center justify-center p-5'
                >
                  <Text className='text-background text-lg font-semibold'>
                    Clear Summary
                  </Text>
                </Pressable>
                <View className='h-[80]'></View>
              </ScrollView>
            </>
          ) : (
            <View className='justify-between flex-1'>
              <View >
                <Text className='text-primary text-xl font-bold'>
                  Multilingual Document Summary!
                </Text>
                <Text className='text-black'>
                  Concise insights delivered in local languages for clear understanding
                </Text>
              </View>
              <LottieView
                source={require('../assets/raw/support.json')}
                ref={animation}
                autoPlay
                loop
                style={{
                  width: '100%',
                  height: Dimensions.get('screen').height * 0.4,
                  alignSelf: 'center',
                  marginBottom: 10,
                }}
              />
              <View className='mt-5 gap-2'>
                <Text className='text-primary text-lg font-semibold'>Choose a language</Text>
                <View className='rounded-full bg-secondary p-3'>
                  <Picker
                    selectedValue={language}
                    onValueChange={(lang)=>handleLanguageChange(lang)}
                    selectionColor={'#EBD9CD'}
                    dropdownIconColor={'#241C1A'}
                    dropdownIconRippleColor={'#EBD9CD'}
                    mode='dropdown'
                  >
                    {languages.map((lang) => (
                      <Picker.Item
                        key={lang}
                        label={lang}
                        value={lang}
                        style={{ backgroundColor: '#EBD9CD' }}
                      />
                    ))}
                  </Picker>
                </View>
                <Pressable
                  onPress={handleSummarise}
                  className='rounded-full bg-primary items-center justify-center p-5'
                >
                  <Text className='text-background text-lg font-semibold'>
                    Summarise!
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  )
}

export default Summary