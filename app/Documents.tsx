import { View, Text, Dimensions, ScrollView, Pressable, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useStore from '@/store/useStore'
import { useShallow } from 'zustand/shallow'
import * as DocumentPicker from 'expo-document-picker';
import LottieView from 'lottie-react-native';
import Ionicons from '@expo/vector-icons/Ionicons'
import Collapsible from 'react-native-collapsible'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { router } from 'expo-router'
import { ActionItem, Obligation, RiskEntry, ShadyClause } from '@/global'


const Documents = () => {

  const [getDocumentAnalysis, response, responseLoading] = useStore(
    useShallow((state) => [state.getDocumentAnalysis, state.documentAnalysis, state.responseLoading])
  )

  const [termsExpanded, setTermsExpanded] = useState<boolean>(false)
  const [obligationsExpanded, setObligationsExpanded] = useState<boolean>(false)
  const [risksExpanded, setRisksExpanded] = useState<boolean>(false)
  const [risk, setRisk] = useState<string>("")
  const [riskData, setRiskData] = useState<RiskEntry[] | null | undefined>(null)
  const [clausesExpanded, setClausesExpanded] = useState<boolean>(false)
  const [actionItemsExpanded, setActionItemsExpanded] = useState<boolean>(false)
  const [terminationExpanded, setTerminationExpanded] = useState<boolean>(false)

  const handleResponse = async () => {
    const docPickerElement = await DocumentPicker.getDocumentAsync()
    const doc = docPickerElement.assets!![0].uri
    if (doc) {
      await getDocumentAnalysis(doc)
    }
  }

  const animation = useRef<LottieView>(null);

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
            We are analyzing your document!
          </Text>
        </Animated.View>
      ) : (
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
                  <View className='flex-1 bg-tertiary rounded-xl p-5'>
                    <Text className='text-background text-semibold'>
                      Effective Date:{"\n"}{response.effective_date ? response.effective_date : "not specified"}
                    </Text>
                  </View>
                  <View className='flex-1 bg-tertiary rounded-xl p-5'>
                    <Text className='text-background text-semibold'>
                      Termination Date:{"\n"}{response.termination_date ? response.termination_date : "Not specified"}
                    </Text>
                  </View>
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
                  {response.parties_involved?.map((item: any, index: number) =>
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
                      {response.key_terms.terms?.map((item: any, index: number) =>
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
                      {response.obligations?.map((item: Obligation, index: number) =>
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
                      {(response.risks.general?.length !== 0) ? (
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

                      {(response.risks.legal?.length !== 0) ? (
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

                      {(response.risks.financial?.length !== 0) ? (
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

                      {(response.risks.reputational?.length !== 0) ? (
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
                    {riskData ? (
                      riskData.map((riskItem) =>
                        <View className='bg-background rounded-lg p-2 mx-5 mb-5'>
                          {riskItem.risk ? <Text className='font-semibold text-primary'>Risk: <Text className='font-normal'>{riskItem.risk}</Text></Text> : null}
                          {riskItem.impact ? <Text className='font-semibold text-primary'>Impact: <Text className='font-normal'>{riskItem.impact}</Text></Text> : null}
                          {riskItem.likelihood ? <Text className='font-semibold text-primary'>Likelyhood: <Text className='font-normal'>{riskItem.likelihood}</Text></Text> : null}
                          {riskItem.concerning ? <Text className='font-semibold text-primary'>Concerning: <Text className='font-normal'>{riskItem.concerning ? "yes" : "no"}</Text></Text> : null}
                        </View>
                      )
                    ) : (
                      <View className='bg-background rounded-lg p-5 mx-5 mb-5'>
                        <Text className='text-primary font-semibold'>
                          Click on the above categories to view the associated risks!
                        </Text>
                      </View>
                    )}
                  </Collapsible>
                </View>
              ) : null}
              {(response.shady_clauses?.length !== 0) ? (
                <Pressable className='rounded-xl bg-red-300' onPress={() => { setClausesExpanded(!clausesExpanded) }}>
                  <View className='p-5 flex-row items-center justify-between'>
                    <Text className='text-xl text-primary font-semibold'>
                      Shady Clauses
                    </Text>
                    <Ionicons
                      name={clausesExpanded ? 'arrow-up' : 'arrow-down'}
                      size={24}
                      color={'black'}
                    />
                  </View>
                  <Collapsible collapsed={!clausesExpanded} >
                    <View className='px-5 pb-5 gap-2'>
                      {response.shady_clauses?.map((item: ShadyClause) =>
                        <View className='bg-background mb-2 p-2 rounded-lg gap-2'>
                          {item.clause ? <Text className='font-semibold text-primary'>Clause: <Text className='font-normal text-black'>{item.clause}</Text></Text> : null}
                          {item.description ? <Text className='font-semibold text-primary'>Description: <Text className='font-normal text-black'>{item.description}</Text></Text> : null}
                          {item.reason ? <Text className='font-semibold text-primary'>Reason: <Text className='font-normal text-black'>{item.reason}</Text></Text> : null}
                          {item.potential_impact ? <Text className='font-semibold text-primary'>Potential Impact: <Text className='font-normal text-black'>{item.potential_impact}</Text></Text> : null}
                        </View>
                      )}
                    </View>
                  </Collapsible>
                </Pressable>
              ) : null}
              {(response.action_items?.length !== 0) ? (
                <Pressable className='rounded-xl bg-tertiary' onPress={() => { setActionItemsExpanded(!actionItemsExpanded) }}>
                  <View className='p-5 flex-row items-center justify-between'>
                    <Text className='text-xl text-background font-semibold'>
                      Action Items
                    </Text>
                    <Ionicons
                      name={actionItemsExpanded ? 'arrow-up' : 'arrow-down'}
                      size={24}
                      color={'white'}
                    />
                  </View>
                  <Collapsible collapsed={!actionItemsExpanded} >
                    <View className='px-5 pb-5 gap-2'>
                      {response.action_items?.map((item: ActionItem) =>
                        <View className='bg-background mb-2 p-2 rounded-lg gap-2'>
                          {item.action ? <Text className='font-semibold text-primary'>Action: <Text className='font-normal text-black'>{item.action}</Text></Text> : null}
                          {item.deadline ? <Text className='font-semibold text-primary'>Deadline: <Text className='font-normal text-black'>{item.deadline}</Text></Text> : null}
                        </View>
                      )}
                    </View>
                  </Collapsible>
                </Pressable>
              ) : null}
              {(response.termination_conditions?.length !== 0) ? (
                <Pressable className='rounded-xl bg-tertiary' onPress={() => { setTerminationExpanded(!terminationExpanded) }}>
                  <View className='p-5 flex-row items-center justify-between'>
                    <Text className='text-xl text-background font-semibold'>
                      Termination Conditions
                    </Text>
                    <Ionicons
                      name={terminationExpanded ? 'arrow-up' : 'arrow-down'}
                      size={24}
                      color={'white'}
                    />
                  </View>
                  <Collapsible collapsed={!terminationExpanded} >
                    <View className='px-5 pb-5 gap-2'>
                      {response.termination_conditions?.map((item: any) =>
                        <View className='bg-background mb-2 p-2 rounded-lg gap-2'>
                          <Text className='text-primary'>{item}</Text>
                        </View>
                      )}
                    </View>
                  </Collapsible>
                </Pressable>
              ) : null}
              {(response.dispute_resolution?.method || response.dispute_resolution?.jurisdiction) ? (
                <View className=' bg-secondary rounded-xl pb-1'>
                  <View className=' px-5 py-3 items-center flex-row justify-between'>
                    <Text className='text-darkbg text-xl font-semibold'>Dispute Resolution</Text>
                    <LottieView
                      source={require('../assets/raw/handshake.json')}
                      ref={animation}
                      autoPlay
                      loop
                      style={{
                        width: 50,
                        height: 50,
                      }}
                    />
                  </View>
                  <View className='bg-background mx-2 mb-1 p-4 gap-2 rounded-lg'>
                    {response.dispute_resolution.method ? <Text className='font-semibold text-primary'>Method: <Text className='font-normal'>{response.dispute_resolution.method}</Text></Text> : null}
                    {response.dispute_resolution.jurisdiction ? <Text className='font-semibold text-primary'>Jurisdiction: <Text className='font-normal'>{response.dispute_resolution.jurisdiction}</Text></Text> : null}
                  </View>
                </View>
              ) : null}
              {response.review_recommendations ? (
                <View className=' bg-secondary rounded-xl pb-1'>
                  <View className=' px-5 py-3 items-center flex-row justify-between'>
                    <Text className='text-darkbg text-xl font-semibold'>Review Recommendations</Text>
                    <LottieView
                      source={require('../assets/raw/review.json')}
                      ref={animation}
                      autoPlay
                      loop
                      style={{
                        width: 50,
                        height: 50,
                      }}
                    />
                  </View>
                  <View className='bg-background mx-2 mb-1 p-4 gap-2 rounded-lg'>
                    <Text className='text-primary'>
                      {response.review_recommendations}
                    </Text>
                  </View>
                </View>
              ) : null}
              {response.user_protection_tips ? (
                <View className=' bg-secondary rounded-xl pb-1'>
                  <View className=' px-5 py-3 items-center flex-row justify-between'>
                    <Text className='text-darkbg text-xl font-semibold'>User Protection Tips</Text>
                    <LottieView
                      source={require('../assets/raw/protection.json')}
                      ref={animation}
                      autoPlay
                      loop
                      style={{
                        width: 40,
                        height: 40,
                        margin: 5
                      }}
                    />
                  </View>
                  <View className='bg-background mx-2 mb-1 p-4 gap-2 rounded-lg'>
                    <Text className='text-primary'>
                      {response.user_protection_tips}
                    </Text>
                  </View>
                </View>
              ) : null}
              {response.overall_analysis ? (
                <View className=' bg-secondary rounded-xl pb-1'>
                  <View className=' px-5 py-3 items-center flex-row justify-between'>
                    <Text className='text-darkbg text-xl font-semibold'>Overall Analysis</Text>
                    <LottieView
                      source={require('../assets/raw/analysis.json')}
                      ref={animation}
                      autoPlay
                      loop
                      style={{
                        width: 50,
                        height: 50,
                      }}
                    />
                  </View>
                  <View className='bg-background mx-2 mb-1 p-4 gap-2 rounded-lg'>
                    <Text className='text-primary'>
                      {response.overall_analysis}
                    </Text>
                  </View>
                </View>
              ) : null}
              <Pressable
                onPress={() => {
                  router.navigate("/Summary")
                }}
                className='bg-tertiary rounded-xl p-5 items-center justify-center'
              >
                <LottieView
                  source={require('../assets/raw/support.json')}
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
                <Text className='text-background font-bold text-lg'>
                  Still Finding it difficult to understand? {"\n"}
                  Try out our Summariser that will explain it to you verbally in your native language!
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  useStore.setState({ documentAnalysis: null, documentSummaryLines: null })
                }}
                className='bg-primary rounded-xl p-5 items-center justify-center'
              >
                <Text className='text-background font-bold text-lg'>
                  Clear Analysis
                </Text>
              </Pressable>
            </View>
          ) : (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
            >
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
            </Animated.View>
          )}
          <View className='h-[80]'></View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default Documents