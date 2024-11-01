import { View, Text,  Dimensions, ScrollView, Pressable,Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useStore from '@/store/useStore'
import { useShallow } from 'zustand/shallow'
import * as DocumentPicker from 'expo-document-picker';
import LottieView from 'lottie-react-native';
import Ionicons from '@expo/vector-icons/Ionicons'
import Collapsible from 'react-native-collapsible'


const Documents = () => {

  const [getGeminiResponse] = useStore(
    useShallow((state) => [state.getGeminiResponse])
  )

  const [termsExpanded, setTermsExpanded] = useState<boolean>(false)
  const [obligationsExpanded, setObligationsExpanded] = useState<boolean>(false)
  const [risksExpanded, setRisksExpanded] = useState<boolean>(false)
  const [risk, setRisk] = useState<string>("")
  const [riskData, setRiskData] = useState<RiskEntry[] | null | undefined>(null)

  const [response, setResponse] = useState<DocumentAnalysis | null>(null)

  const handleResponse = async () => {
    const docPickerElement = await DocumentPicker.getDocumentAsync()
    const doc = docPickerElement.assets!![0].uri
    const response = await getGeminiResponse("", "file", doc, true)
    console.log(response)
    setResponse(JSON.parse(response))
  }

  const animation = useRef<LottieView>(null);

  return (
    <SafeAreaView className='flex-1 bg-background px-4'>
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        {response ? (
          <View className='gap-2'>
            <LottieView
              source={require('../assets/raw/documentanalysis.json')}
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
            {(response.document_name || response.document_type) ? (
              <View>
                <View className='bg-darkbg p-5 rounded-xl'>
                  {response.document_name ? <Text className='text-xl text-background'>{response.document_name}</Text> : null}
                  {response.document_type ? <Text className='text-lg text-gray-300'>{response.document_type}</Text> : null}
                </View>
              </View>
            ) : null}
            {(response.effective_date || response.termination_date) ? (
              <View className='flex-row gap-2 items-center'>
                {response.effective_date ? (
                  <View className='flex-1 bg-tertiary rounded-xl p-5'>
                    <Text className='text-background text-semibold'>
                      Effective Date:{"\n"}{response.effective_date}
                    </Text>
                  </View>
                ) : null}
                {response.termination_date ? (
                  <View className='flex-1 bg-tertiary rounded-xl p-5'>
                    <Text className='text-background text-semibold'>
                      Termination Date:{"\n"}{response.termination_date}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
            {(response.parties_involved?.length !== 0) ? (
              <View className=' bg-secondary rounded-xl pb-1'>
                <View className=' px-5 py-3 items-center flex-row justify-between'>
                  <Text className='text-darkbg text-xl font-semibold'>Parties Involved</Text>
                  <LottieView
                    source={require('../assets/raw/partiesinvolved.json')}
                    ref={animation}
                    autoPlay
                    loop
                    style={{
                      width: 50,
                      height: 50,
                    }}
                  />
                </View>
                {response.parties_involved?.map((item, index) =>
                  <View className='bg-background mx-2 my-1 p-4 rounded-lg'>
                    <Text className='font-semibold'>{index + 1}: {item}</Text>
                  </View>
                )}
              </View>
            ) : null}
            {response.key_terms ? (
              <Pressable className='rounded-xl bg-tertiary' onPress={() => { setTermsExpanded(!termsExpanded) }}>
                <View className='p-5 flex-row items-center justify-between'>
                  <Text className='text-xl text-background font-semibold'>
                    Key Terms
                  </Text>
                  <Ionicons
                    name={termsExpanded ? 'arrow-up' : 'arrow-down'}
                    size={24}
                    color={'white'}
                  />
                </View>
                <Collapsible collapsed={!termsExpanded} >
                  <View className='px-5 pb-5 gap-2'>
                    {response.key_terms.description ? <Text className='text-background font-semibold'>{response.key_terms.description}</Text> : null}
                    {response.key_terms.terms?.map((item, index) =>
                      <View className='bg-background mb-2 p-2 rounded-lg gap-2'>
                        {item.term ? <Text className='font-semibold text-primary'>Term: <Text className='font-normal text-black'>{item.term}</Text></Text> : null}
                        {item.importance ? <Text className='font-semibold text-primary'>Importance: <Text className='font-normal text-black'>{item.importance}</Text></Text> : null}
                      </View>
                    )}
                  </View>
                </Collapsible>
              </Pressable>
            ) : null}
            {(response.obligations?.length !== 0) ? (
              <Pressable className='rounded-xl bg-tertiary' onPress={() => { setObligationsExpanded(!obligationsExpanded) }}>
                <View className='p-5 flex-row items-center justify-between'>
                  <Text className='text-xl text-background font-semibold'>
                    Obligations
                  </Text>
                  <Ionicons
                    name={termsExpanded ? 'arrow-up' : 'arrow-down'}
                    size={24}
                    color={'white'}
                  />
                </View>
                <Collapsible collapsed={!obligationsExpanded} >
                  <View className='px-5 pb-5 gap-2'>
                    {response.obligations?.map((item, index) =>
                      <View className='bg-background mb-2 p-2 rounded-lg gap-2'>
                        {item.obligation ? <Text className='font-semibold text-primary'>Obligation: <Text className='font-normal text-black'>{item.obligation}</Text></Text> : null}
                        {item.description ? <Text className='font-semibold text-primary'>Description: <Text className='font-normal text-black'>{item.description}</Text></Text> : null}
                        {item.due_date ? <Text className='font-semibold text-primary'>Due Date: <Text className='font-normal text-black'>{item.due_date}</Text></Text> : null}
                      </View>
                    )}
                  </View>
                </Collapsible>
              </Pressable>
            ) : null}
            {response.risks ? (
              <View
                className='rounded-xl bg-red-300'
              >
                <Pressable onPress={() => { setRisksExpanded(!risksExpanded) }} className='p-5 flex-row items-center justify-between'>
                  <Text className='text-xl text-darkbg font-semibold'>
                    Risks
                  </Text>
                  <Ionicons
                    name={risksExpanded ? 'arrow-up' : 'arrow-down'}
                    size={24}
                    color={'black'}
                  />
                </Pressable>
                <Collapsible collapsed={!risksExpanded} >
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mx-5 mb-5'>
                    {response.risks.general ? (
                      <Pressable
                        className='p-5 bg-background rounded-lg gap-2 items-center mr-2'
                        style={{
                          borderWidth: (risk === 'general') ? 3 : 0
                        }}
                        onPress={() => {
                          setRisk('general');
                          setRiskData(response.risks?.general)
                        }}
                      >
                        <Image
                          source={require('../assets/icons/generalrisk.png')}
                          tintColor={"#452B01"}
                          style={{
                            width: Dimensions.get('screen').width * 0.15,
                            height: Dimensions.get('screen').width * 0.15,
                          }}
                        />
                        <Text className='text-primary font-semibold'>General</Text>
                      </Pressable>
                    ) : null}

                    {response.risks.legal ? (
                      <Pressable
                        className='p-5 bg-background rounded-lg gap-2 items-center mr-2'
                        style={{
                          borderWidth: (risk === 'legal') ? 3 : 0
                        }}
                        onPress={() => {
                          setRisk('legal');
                          setRiskData(response.risks?.legal)
                        }}
                      >
                        <Image
                          source={require('../assets/icons/legalrisk.png')}
                          tintColor={"#452B01"}
                          style={{
                            width: Dimensions.get('screen').width * 0.15,
                            height: Dimensions.get('screen').width * 0.15,
                          }}
                        />
                        <Text className='text-primary font-semibold'>Legal</Text>
                      </Pressable>
                    ) : null}

                    {response.risks.financial ? (
                      <Pressable
                        className='p-5 bg-background rounded-lg gap-2 items-center mr-2'
                        style={{
                          borderWidth: (risk === 'financial') ? 3 : 0
                        }}
                        onPress={() => {
                          setRisk('financial');
                          setRiskData(response.risks?.financial)
                        }}
                      >
                        <Image
                          source={require('../assets/icons/financialrisk.png')}
                          tintColor={"#452B01"}
                          style={{
                            width: Dimensions.get('screen').width * 0.15,
                            height: Dimensions.get('screen').width * 0.15,
                          }}
                        />
                        <Text className='text-primary font-semibold'>Financial</Text>
                      </Pressable>
                    ) : null}

                    {response.risks.reputational ? (
                      <Pressable
                        className='p-5 bg-background rounded-lg gap-2 items-center mr-2'
                        style={{
                          borderWidth: (risk === 'reputational') ? 3 : 0
                        }}
                        onPress={() => {
                          setRisk('reputational');
                          setRiskData(response.risks?.reputational)
                        }}
                      >
                        <Image
                          source={require('../assets/icons/reputationalrisk.png')}
                          tintColor={"#452B01"}
                          style={{
                            width: Dimensions.get('screen').width * 0.15,
                            height: Dimensions.get('screen').width * 0.15,
                          }}
                        />
                        <Text className='text-primary font-semibold'>Reputational</Text>
                      </Pressable>
                    ) : null}
                  </ScrollView>
                  {riskData?(
                    riskData.map((riskItem)=>
                      <View className='bg-background rounded-lg p-2 mx-5 mb-5'>
                        {riskItem.risk ? <Text className='font-semibold text-primary'>Risk: <Text className='font-normal'>{riskItem.risk}</Text></Text> : null}
                        {riskItem.impact ? <Text className='font-semibold text-primary'>Impact: <Text className='font-normal'>{riskItem.impact}</Text></Text> : null}
                        {riskItem.likelihood ? <Text className='font-semibold text-primary'>Likelyhood: <Text className='font-normal'>{riskItem.likelihood}</Text></Text> : null}
                        {riskItem.concerning ? <Text className='font-semibold text-primary'>Concerning: <Text className='font-normal'>{riskItem.concerning ? "yes" : "no"}</Text></Text> : null}
                      </View>
                    )                                          
                  ):(
                    <View className='bg-background rounded-lg p-5 mx-5 mb-5'>
                      <Text className='text-primary font-semibold'>
                        Click on the above categories to view the associated risks!
                      </Text>
                    </View>
                  )}
                </Collapsible>
              </View>
            ) : null}
          </View>
        ) : (
          <View>
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
                onPress={handleResponse}
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
          </View>
        )}
        <View className='h-[80]'></View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Documents