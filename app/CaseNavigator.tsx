import { View, Text, ScrollView, TextInput, Pressable, ToastAndroid, Alert, Dimensions, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/shallow'
import useStore from '@/store/useStore'
import Ionicons from '@expo/vector-icons/Ionicons'
import Collapsible from 'react-native-collapsible'
import { CaseFiling, CaseResolution, EvidenceCollection, HearingManagement, LegalResearch } from '@/global'
import { router } from 'expo-router'
import LottieView from 'lottie-react-native'
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated'
import Markdown from 'react-native-markdown-display'
import { navigatorInfo } from '@/utils/utils'

const CaseNavigator = () => {

  const [currentCase, getLegalResearch, responseLoading] = useStore(
    useShallow((state) => [state.currentCase, state.getLegalResearch, state.responseLoading])
  )

  const [filingExpanded, setFilingExpanded] = useState<boolean>(false)
  const [evidenceExpanded, setEvidenceExpanded] = useState<boolean>(false)
  const [researchExpanded, setResearchExpanded] = useState<boolean>(false)
  const [hearingExpanded, setHearingExpanded] = useState<boolean>(false)
  const [researchGenerated, setResearchGenerated] = useState<boolean>(false)
  const [formExpanded, setFormExpanded] = useState<boolean>(false)

  const [navigateStatus, setNavigateStatus] = useState<number>(currentCase?.navigateStatus || 0)
  const [title, setTitle] = useState<string>(currentCase?.caseFiling.caseTitle || "")
  const [userName, setUserName] = useState<string>(currentCase?.caseFiling.clientDetails.name || "")
  const [contact, setContact] = useState<string>(currentCase?.caseFiling.clientDetails.contact || "")
  const [email, setEmail] = useState<string>(currentCase?.caseFiling.clientDetails.email || "")
  const [address, setAddress] = useState<string>(currentCase?.caseFiling.clientDetails.address || "")
  const [caseCategory, setCaseCategory] = useState<string>(currentCase?.caseFiling.caseType || "")
  const [filingDate, setFilingDate] = useState<string>(currentCase?.caseFiling.filingDate || "")
  const [jurisdiction, setJurisdiction] = useState<string>(currentCase?.caseFiling.jurisdiction || "")
  const [caseStatus, setCaseStatus] = useState<string>(currentCase?.caseFiling.status || "Draft")
  const [evidenceType, setEvidenceType] = useState<string>("")
  const [evidenceTitle, setEvidenceTitle] = useState<string>("")
  const [evidenceDescription, setEvidenceDescription] = useState<string>("")
  const [evidenceUploadDate, setEvidenceUploadDate] = useState<string>("")
  const [researchTopic, setResearchTopic] = useState<string>("")
  const [researchNotes, setResearchNotes] = useState<string>("")
  const [preCaseTitle, setPreCaseTitle] = useState<string>("")
  const [preCaseSummary, setPreCaseSummary] = useState<string>("")
  const [preRulingDate, setPreRulingDate] = useState<string>("")
  const [preCourt, setPreCourt] = useState<string>("")
  const [hearingDate, setHearingDate] = useState<string>("")
  const [hearingCourt, setHearingCourt] = useState<string>("")
  const [hearingJudge, setHearingJudge] = useState<string>("")
  const [hearingAgenda, setHearingAgenda] = useState<string>("")
  const [hearingOutcome, setHearingOutcome] = useState<string>("")
  const [hearingReDate, setHearingReDate] = useState<string>("")
  const [hearingReReason, setHearingReReason] = useState<string>("")
  const [resDate, setResDate] = useState<string>(currentCase?.caseResolution?.resolutionDate || "")
  const [resOutcome, setResOutcome] = useState<string>(currentCase?.caseResolution?.outcome || "")
  const [resNotes, setResNotes] = useState<string>(currentCase?.caseResolution?.notes || "")

  const categoryList = ["Civil", "Criminal", "Corporate", "Family", "Other"]
  const caseStatusList = ["Draft", "Submitted", "Rejected"]
  const evidenceTypeList = ["Physical", "Digital", "Witness Statement", "Other"]
  const outcomeList = ["Won", "Lost", "Settled", "Withdrawn"]
  const animation = useRef(null)

  const handleUpdateCaseFiling = async () => {
    const updatedCaseFiling: CaseFiling = {
      caseTitle: title.trim(),
      clientDetails: {
        name: userName.trim(),
        contact: contact.trim(),
        email: email.trim(),
        address: address.trim() || undefined,
      },
      caseType: caseCategory as CaseFiling['caseType'],
      filingDate: filingDate.trim(),
      jurisdiction: jurisdiction.trim(),
      documentsRequired: currentCase?.caseFiling?.documentsRequired || [],
      status: caseStatus as CaseFiling['status'],
    };

    const caseIndex = useStore.getState().caseList.findIndex(
      (p) => p.caseFiling.caseTitle === currentCase?.caseFiling?.caseTitle
    );
    if (caseIndex !== -1) {
      useStore.setState((state) => {
        const updatedCaseList = [...state.caseList];
        updatedCaseList[caseIndex] = {
          ...updatedCaseList[caseIndex],
          caseFiling: updatedCaseFiling,
        };
        return {
          ...state,
          currentCase: {
            ...state.currentCase,
            navigateStatus: state.currentCase?.navigateStatus ?? 0,
            caseFiling: updatedCaseFiling,
            evidenceCollection: state.currentCase?.evidenceCollection ?? null,
            legalResearch: state.currentCase?.legalResearch ?? null,
            hearingManagement: state.currentCase?.hearingManagement ?? null,
            caseResolution: state.currentCase?.caseResolution ?? null,
          },
          caseList: updatedCaseList,
        };
      });
    }
    ToastAndroid.show('CaseFiling updated successfully!', ToastAndroid.SHORT);
    setFilingExpanded(false)
  }

  const handleAddEvidence = async () => {
    const newEvidence: EvidenceCollection = {
      evidenceType: evidenceType as EvidenceCollection['evidenceType'],
      title: evidenceTitle.trim(),
      description: evidenceDescription.trim(),
      uploadDate: evidenceUploadDate.trim(),
    };

    const caseIndex = useStore.getState().caseList.findIndex(
      (p) => p.caseFiling.caseTitle === useStore.getState().currentCase?.caseFiling?.caseTitle
    );

    if (caseIndex !== -1) {
      useStore.setState((state) => {
        const updatedEvidenceCollection = [
          ...(state.currentCase?.evidenceCollection || []),
          newEvidence,
        ];

        const updatedCaseList = [...state.caseList];
        updatedCaseList[caseIndex] = {
          ...updatedCaseList[caseIndex],
          evidenceCollection: updatedEvidenceCollection,
        };

        return {
          ...state,
          currentCase: {
            ...state.currentCase,
            navigateStatus: state.currentCase?.navigateStatus ?? 0,
            evidenceCollection: updatedEvidenceCollection,
            caseFiling: state.currentCase?.caseFiling!!,
            legalResearch: state.currentCase?.legalResearch ?? null,
            hearingManagement: state.currentCase?.hearingManagement ?? null,
            caseResolution: state.currentCase?.caseResolution ?? null,
          },
          caseList: updatedCaseList,
        };
      });
      ToastAndroid.show('Evidence added successfully!', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Error: Case not found!', ToastAndroid.SHORT);
    }
    setEvidenceTitle("")
    setEvidenceDescription("")
    setEvidenceUploadDate("")
    setEvidenceType("")
  };

  const handleAddResearch = async () => {
    const researchFinding: LegalResearch = {
      topic: researchTopic.trim(),
      notes: researchNotes.trim(),
      precedentCase: {
        caseTitle: preCaseTitle.trim(),
        caseSummary: preCaseSummary.trim(),
        rulingDate: preRulingDate.trim(),
        court: preCourt.trim(),
      },
    };

    const caseIndex = useStore.getState().caseList.findIndex(
      (p) => p.caseFiling.caseTitle === useStore.getState().currentCase?.caseFiling?.caseTitle
    );

    if (caseIndex !== -1) {
      useStore.setState((state) => {
        const updatedLegalResearch = [
          ...(state.currentCase?.legalResearch || []),
          researchFinding,
        ];

        const updatedCaseList = [...state.caseList];
        updatedCaseList[caseIndex] = {
          ...updatedCaseList[caseIndex],
          legalResearch: updatedLegalResearch,
        };

        return {
          ...state,
          currentCase: {
            ...state.currentCase,
            navigateStatus: state.currentCase?.navigateStatus ?? 0,
            legalResearch: updatedLegalResearch,
            caseFiling: state.currentCase?.caseFiling!!,
            evidenceCollection: state.currentCase?.evidenceCollection ?? null,
            hearingManagement: state.currentCase?.hearingManagement ?? null,
            caseResolution: state.currentCase?.caseResolution ?? null,
          },
          caseList: updatedCaseList,
        };
      });
      ToastAndroid.show('Research added successfully!', ToastAndroid.SHORT);
      setResearchTopic('');
      setResearchNotes('');
      setPreCaseTitle('');
      setPreCaseSummary('');
      setPreRulingDate('');
      setPreCourt('');
    } else {
      ToastAndroid.show('Error: Case not found!', ToastAndroid.SHORT);
    }
  };

  const handleAddHearing = async () => {
    const hearing: HearingManagement = {
      hearingDate: hearingDate,
      courtName: hearingCourt,
      judgeName: hearingJudge,
      agenda: hearingAgenda,
      outcome: hearingOutcome,
      rescheduleDetails: {
        rescheduledDate: hearingReDate,
        reason: hearingReReason,
      },
    };

    const caseIndex = useStore.getState().caseList.findIndex(
      (p) => p.caseFiling.caseTitle === useStore.getState().currentCase?.caseFiling?.caseTitle
    );

    if (caseIndex !== -1) {
      useStore.setState((state) => {
        const updatedHearingManagement = [
          ...(state.currentCase?.hearingManagement || []),
          hearing,
        ];

        const updatedCaseList = [...state.caseList];
        updatedCaseList[caseIndex] = {
          ...updatedCaseList[caseIndex],
          hearingManagement: updatedHearingManagement,
        };

        return {
          ...state,
          currentCase: {
            ...state.currentCase,
            navigateStatus: state.currentCase?.navigateStatus ?? 0,
            hearingManagement: updatedHearingManagement,
            caseFiling: state.currentCase?.caseFiling!!,
            legalResearch: state.currentCase?.legalResearch ?? null,
            evidenceCollection: state.currentCase?.evidenceCollection ?? null,
            caseResolution: state.currentCase?.caseResolution ?? null,
          },
          caseList: updatedCaseList,
        };
      });
      ToastAndroid.show('Hearing added successfully!', ToastAndroid.SHORT);

      setHearingDate('');
      setHearingCourt('');
      setHearingJudge('');
      setHearingAgenda('');
      setHearingOutcome('');
      setHearingReDate('');
      setHearingReReason('');
    } else {
      ToastAndroid.show('Error: Case not found!', ToastAndroid.SHORT);
    }
  };


  const handleResearchFindings = async () => {
    if (researchGenerated) {
      router.navigate("/Research")
    } else {
      currentCase ? await getLegalResearch(currentCase) : null
      setResearchGenerated(true)
    }
  }

  const handleAddResolution = async () => {
    const resolution: CaseResolution = {
      resolutionDate: resDate.trim(),
      outcome: resOutcome.trim() as CaseResolution["outcome"],
      notes: resNotes.trim(),
    };

    const caseIndex = useStore.getState().caseList.findIndex(
      (p) => p.caseFiling.caseTitle === useStore.getState().currentCase?.caseFiling?.caseTitle
    );

    if (caseIndex !== -1) {
      useStore.setState((state) => {
        const updatedCaseList = [...state.caseList];
        updatedCaseList[caseIndex] = {
          ...updatedCaseList[caseIndex],
          caseResolution: resolution,
        };

        return {
          ...state,
          currentCase: {
            ...state.currentCase,
            navigateStatus: state.currentCase?.navigateStatus ?? 0,
            caseResolution: resolution,
            caseFiling: state.currentCase?.caseFiling!!,
            legalResearch: state.currentCase?.legalResearch ?? null,
            evidenceCollection: state.currentCase?.evidenceCollection ?? null,
            hearingManagement: state.currentCase?.hearingManagement ?? null,
          },
          caseList: updatedCaseList,
        };
      });

      ToastAndroid.show("Resolution added successfully!", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show("Error: Case not found!", ToastAndroid.SHORT);
    }
  };



  const handleProceedToNewSection = async () => {
    let status = navigateStatus;
    if (status === 1) {
      if (!currentCase?.evidenceCollection || currentCase.evidenceCollection.length === 0) {
        Alert.alert("No Evidence", "Cannot proceed further without Evidences!");
        return;
      }
    } else if (status === 2) {
      if (!currentCase?.legalResearch || currentCase.legalResearch.length === 0) {
        Alert.alert("No Research found", "Cannot proceed further without Legal Research!");
        return;
      }
    } else if (status === 3) {
      if (!currentCase?.hearingManagement || currentCase.hearingManagement.length === 0) {
        Alert.alert("No Hearings found", "Cannot proceed further without Legal Hearings!");
        return;
      }
    } else if (status === 4) {
      return;
    }
    status++;
    useStore.setState((state) => {
      const caseIndex = state.caseList.findIndex(
        (p) => p.caseFiling.caseTitle === state.currentCase?.caseFiling?.caseTitle
      );
      if (caseIndex !== -1) {
        const updatedCaseList = [...state.caseList];
        updatedCaseList[caseIndex] = {
          ...updatedCaseList[caseIndex],
          navigateStatus: status,
        };

        return {
          ...state,
          currentCase: {
            ...state.currentCase!!,
            navigateStatus: status,
          },
          caseList: updatedCaseList,
        };
      }
      return state;
    });
    setNavigateStatus(status);
  };



  return (
    <SafeAreaView className='bg-background flex-1 px-4'>
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
            <Text className='text-darkbg text-2xl font-bold'>
              Case Navigator!
            </Text>
            <Text className='text-darkbg text-base'>
              Your personalized case manager!
            </Text>
          </View>
        </View>
        <View className='bg-darkbg rounded-xl p-5 mt-5'>
          <Text className='text-background text-xl'>
            {currentCase?.caseFiling.caseTitle}
          </Text>
        </View>
        <View className='mt-2 bg-secondary p-5 rounded-xl'>
          <Pressable
            onPress={() => { setFilingExpanded(!filingExpanded) }}
            className='flex-row items-center justify-between'
          >
            <Text className='text-xl text-darkbg font-semibold'>
              Case Filing
            </Text>
            <Ionicons name={filingExpanded ? 'arrow-up' : 'arrow-down'} size={23} />
          </Pressable>
          <Collapsible collapsed={!filingExpanded}>
            <Text className='text-darkbg text-lg font-bold mt-5'>
              Case Title
            </Text>
            <View className='border-2 rounded-2xl p-3 border-darkbg'>
              <TextInput
                value={title}
                onChangeText={setTitle}
                numberOfLines={1}
                multiline={false}
                placeholder='Enter case title'
              />
            </View>
            <View className='h-[3] bg-tertiary mt-5'></View>
            <Text className='text-darkbg text-lg font-bold mt-4'>
              Client Details
            </Text>
            <Text className='text-darkbg text-lg mt-2'>
              Name
            </Text>
            <View className='border-2 rounded-2xl p-3 border-darkbg'>
              <TextInput
                value={userName}
                onChangeText={setUserName}
                multiline={false}
                placeholder='Enter your name'
              />
            </View>
            <Text className='text-darkbg text-lg mt-2'>
              Contact
            </Text>
            <View className='border-2 rounded-2xl p-3 border-darkbg'>
              <TextInput
                value={contact}
                onChangeText={setContact}
                multiline={false}
                placeholder='Enter your Contact number'
              />
            </View>
            <Text className='text-darkbg text-lg mt-2'>
              Email
            </Text>
            <View className='border-2 rounded-2xl p-3 border-darkbg'>
              <TextInput
                value={email}
                onChangeText={setEmail}
                multiline={false}
                placeholder='Enter your mail id'
              />
            </View>
            <Text className='text-darkbg text-lg mt-2'>
              Address
            </Text>
            <View className='border-2 rounded-2xl p-3 border-darkbg'>
              <TextInput
                value={address}
                onChangeText={setAddress}
                multiline={false}
                placeholder='Enter your Address'
              />
            </View>
            <View className='h-[3] bg-tertiary mt-5'></View>
            <Text className='text-darkbg text-lg font-bold mt-4'>
              Case Type
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categoryList.map((item) =>
                <Pressable
                  onPress={() => {
                    setCaseCategory(item)
                  }}
                  className={`p-3 rounded-xl m-1 ${caseCategory === item ? 'bg-tertiary' : 'bg-background'}`}
                >
                  <Text className={`font-semibold text-base ${caseCategory === item ? 'text-white' : 'text-darkbg'}`}>
                    {item}
                  </Text>
                </Pressable>
              )}
            </ScrollView>
            <View className='h-[3] bg-tertiary mt-5'></View>
            <Text className='text-darkbg text-lg mt-4'>
              Filing Date
            </Text>
            <View className='border-2 rounded-2xl p-3 border-darkbg'>
              <TextInput
                value={filingDate}
                onChangeText={setFilingDate}
                multiline={false}
                placeholder='Enter the filing date if case is filed'
              />
            </View>
            <Text className='text-darkbg text-lg mt-2'>
              Jurisdiction
            </Text>
            <View className='border-2 rounded-2xl p-3 border-darkbg'>
              <TextInput
                value={jurisdiction}
                onChangeText={setJurisdiction}
                multiline={false}
                placeholder='Enter the filing date if case is filed'
              />
            </View>
            <View className='h-[3] bg-tertiary mt-5'></View>
            <Text className='text-darkbg text-lg font-bold mt-4'>
              Case Type
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {caseStatusList.map((item) =>
                <Pressable
                  onPress={() => {
                    setCaseStatus(item)
                  }}
                  className={`p-3 rounded-xl m-1 ${caseStatus === item ? 'bg-tertiary' : 'bg-background'}`}
                >
                  <Text className={`font-semibold text-base ${caseStatus === item ? 'text-white' : 'text-darkbg'}`}>
                    {item}
                  </Text>
                </Pressable>
              )}
            </ScrollView>
            <Pressable
              onPress={() => {
                handleUpdateCaseFiling()
              }}
              className='p-5 items-center justify-center bg-primary rounded-xl mt-5'
            >
              <Text className='text-white text-lg font-bold'>
                Update Case Filing Details
              </Text>
            </Pressable>
          </Collapsible>
        </View>
        {navigateStatus > 0 ?
          <View className='p-5 rounded-xl bg-secondary mt-2'>
            <Pressable
              onPress={() => { setEvidenceExpanded(!evidenceExpanded) }}
              className='flex-row items-center justify-between'
            >
              <Text className='text-xl text-darkbg font-semibold'>
                Evidence Collection
              </Text>
              <Ionicons name={evidenceExpanded ? 'arrow-up' : 'arrow-down'} size={23} />
            </Pressable>
            <Collapsible collapsed={!evidenceExpanded}>
              <Text className='text-darkbg text-lg font-bold mt-2'>
                Evidence Title
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={evidenceTitle}
                  onChangeText={setEvidenceTitle}
                  multiline={false}
                  placeholder='Enter Evidence Title'
                />
              </View>
              <Text className='text-darkbg text-lg font-bold mt-2'>
                Evidence Description
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={evidenceDescription}
                  onChangeText={setEvidenceDescription}
                  multiline={false}
                  placeholder='Enter Evidence Description'
                />
              </View>
              <Text className='text-darkbg text-lg font-bold mt-2'>
                Evidence Date
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={evidenceUploadDate}
                  onChangeText={setEvidenceUploadDate}
                  multiline={false}
                  placeholder='Enter Evidence Date'
                />
              </View>
              <Text className='text-darkbg text-lg mt-2 font-bold'>
                Evidence Type
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {evidenceTypeList.map((item) =>
                  <Pressable
                    onPress={() => {
                      setEvidenceType(item)
                    }}
                    className={`p-3 rounded-xl m-1 ${evidenceType === item ? 'bg-tertiary' : 'bg-background'}`}
                  >
                    <Text className={`font-semibold text-base ${evidenceType === item ? 'text-white' : 'text-darkbg'}`}>
                      {item}
                    </Text>
                  </Pressable>
                )}
              </ScrollView>
              {currentCase?.evidenceCollection?.length !== 0 ?
                <Text
                  onPress={() => {
                    router.navigate("/Evidence")
                  }}
                  className='text-tertiary text-lg font-bold mt-5'
                >
                  View All Evidences
                </Text>
                : null}
              <Pressable
                onPress={() => {
                  handleAddEvidence()
                }}
                className='p-5 items-center justify-center bg-primary rounded-xl mt-5'
              >
                <Text className='text-white text-lg font-bold'>
                  Add new evidence
                </Text>
              </Pressable>
            </Collapsible>
          </View>
          : null}
        {navigateStatus > 1 ?
          <View className='bg-secondary p-5 rounded-xl mt-2'>
            <Pressable
              onPress={() => { setResearchExpanded(!researchExpanded) }}
              className='flex-row items-center justify-between'
            >
              <Text className='text-xl text-darkbg font-semibold'>
                Legal Research
              </Text>
              <Ionicons name={researchExpanded ? 'arrow-up' : 'arrow-down'} size={23} />
            </Pressable>
            <Collapsible collapsed={!researchExpanded}>
              <LottieView
                source={require('../assets/raw/research.json')}
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
              <Pressable
                onPress={() => {
                  handleResearchFindings()
                }}
                className='p-5 rounded-xl bg-primary'
              >
                {responseLoading ?
                  <ActivityIndicator color={'white'} size={30} />
                  :
                  researchGenerated ?
                    <Text className='text-lg font-semibold text-background text-center'>
                      Go to Research Findings!
                    </Text>
                    :
                    <Text className='text-lg font-semibold text-background text-center'>
                      Let CaseWise do the research!
                    </Text>
                }
              </Pressable>
              <View className='flex-row justify-between items-center mt-5'>
                <View className='h-[3] bg-tertiary w-[45%]'></View>
                <Text className='font-bold text-lg'>or</Text>
                <View className='h-[3] bg-tertiary w-[45%]'></View>
              </View>
              <Text className='text-darkbg text-lg font-bold mt-2'>
                Enter Research Findings
              </Text>
              <Text className='text-darkbg text-lg font-bold mt-2'>
                Topic
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={researchTopic}
                  onChangeText={setResearchTopic}
                  multiline={false}
                  placeholder='Enter Research Topic'
                />
              </View>
              <Text className='text-darkbg text-lg font-bold mt-2'>
                Notes
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={researchNotes}
                  onChangeText={setResearchNotes}
                  multiline={false}
                  placeholder='Enter Research Notes'
                />
              </View>
              <View className='h-[3] bg-tertiary mt-5'></View>
              <Text className='text-darkbg text-lg font-bold mt-4'>
                Precedent Cases
              </Text>
              <Text className='text-darkbg text-lg'>
                Case Title
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={preCaseTitle}
                  onChangeText={setPreCaseTitle}
                  multiline={false}
                  placeholder='Enter Case Title'
                />
              </View>
              <Text className='text-darkbg text-lg mt-2'>
                Case Summary
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={preCaseSummary}
                  onChangeText={setPreCaseSummary}
                  multiline={false}
                  placeholder='Enter Case Summary'
                />
              </View>
              <Text className='text-darkbg text-lg mt-2'>
                Ruling Date
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={preRulingDate}
                  onChangeText={setPreRulingDate}
                  multiline={false}
                  placeholder='Enter Ruling Date'
                />
              </View>
              <Text className='text-darkbg text-lg mt-2'>
                Court
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={preCourt}
                  onChangeText={setPreCourt}
                  multiline={false}
                  placeholder='Enter Court'
                />
              </View>
              {currentCase?.legalResearch?.length !== 0 ?
                <Text
                  onPress={() => {
                    router.navigate("/Research")
                  }}
                  className='text-tertiary text-lg font-bold mt-5'
                >
                  View Research Findigs
                </Text>
                : null}
              <Pressable
                onPress={() => {
                  handleAddResearch()
                }}
                className='p-5 rounded-xl bg-primary mt-5'
              >
                <Text className='text-lg font-semibold text-background text-center'>
                  Add research Findings
                </Text>
              </Pressable>
            </Collapsible>
          </View>
          : null}
        {navigateStatus > 2 ?
          <View className='p-5 rounded-xl bg-secondary mt-2'>
            <Pressable
              onPress={() => { setHearingExpanded(!hearingExpanded) }}
              className='flex-row items-center justify-between'
            >
              <Text className='text-xl text-darkbg font-semibold'>
                Hearing Management
              </Text>
              <Ionicons name={hearingExpanded ? 'arrow-up' : 'arrow-down'} size={23} />
            </Pressable>
            <Collapsible collapsed={!hearingExpanded}>
              <Text className='text-darkbg text-lg font-bold mt-5'>
                Add Hearing Details!
              </Text>
              <Text className='text-darkbg text-lg font-bold mt-2'>
                Hearing Date
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={hearingDate}
                  onChangeText={setHearingDate}
                  multiline={false}
                  placeholder='Enter hearing date'
                />
              </View>
              <Text className='text-darkbg text-lg font-bold mt-2'>
                Court
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={hearingCourt}
                  onChangeText={setHearingCourt}
                  multiline={false}
                  placeholder='Enter court name'
                />
              </View>
              <Text className='text-darkbg text-lg font-bold mt-2'>
                Judge
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={hearingJudge}
                  onChangeText={setHearingJudge}
                  multiline={false}
                  placeholder='Enter judge name'
                />
              </View>
              <Text className='text-darkbg text-lg font-bold mt-2'>
                Agenda
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={hearingAgenda}
                  onChangeText={setHearingAgenda}
                  multiline={false}
                  placeholder='Enter agenda'
                />
              </View>
              <Text className='text-darkbg text-lg font-bold mt-2'>
                Outcome
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={hearingOutcome}
                  onChangeText={setHearingOutcome}
                  multiline={false}
                  placeholder='Enter outcome'
                />
              </View>
              <View className='h-[3] bg-tertiary mt-5'></View>
              <Text className='text-darkbg text-lg font-bold mt-4'>
                Rescheduling Details
              </Text>
              <Text className='text-darkbg text-lg font-bold'>
                Date
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={hearingReDate}
                  onChangeText={setHearingReDate}
                  multiline={false}
                  placeholder='Enter rescheduling date'
                />
              </View>
              <Text className='text-darkbg text-lg font-bold mt-2'>
                Reason
              </Text>
              <View className='border-2 rounded-2xl p-3 border-darkbg'>
                <TextInput
                  value={hearingReReason}
                  onChangeText={setHearingReReason}
                  multiline={false}
                  placeholder='Enter rescheduling reason'
                />
              </View>
              {currentCase?.hearingManagement?.length !== 0 ?
                <Text
                  onPress={() => {
                    router.navigate("/Hearing")
                  }}
                  className='text-tertiary text-lg font-bold mt-5'
                >
                  View hearing record
                </Text>
                : null}
              <Pressable
                onPress={() => {
                  handleAddHearing()
                }}
                className='p-5 rounded-xl bg-primary mt-5'
              >
                <Text className='text-lg font-semibold text-background text-center'>
                  Add Hearing Details
                </Text>
              </Pressable>
            </Collapsible>
          </View>
          : null}
        {navigateStatus > 3 ?
          <View className='rounded-xl p-5 bg-secondary mt-2'>
            <Text className='text-xl text-darkbg font-semibold'>
              Case Resolution
            </Text>
            <Text className='text-darkbg text-lg font-bold mt-2'>
              Resolution date
            </Text>
            <View className='border-2 rounded-2xl p-3 border-darkbg'>
              <TextInput
                value={resDate}
                onChangeText={setResDate}
                multiline={false}
                placeholder='Enter resolution date'
              />
            </View>
            <Text className='text-darkbg text-lg font-bold mt-2'>
              Notes
            </Text>
            <View className='border-2 rounded-2xl p-3 border-darkbg'>
              <TextInput
                value={resNotes}
                onChangeText={setResNotes}
                multiline={false}
                placeholder='Add a note'
              />
            </View>
            <Text className='text-darkbg text-lg font-bold mt-2'>
              Outcome
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {outcomeList.map((item) =>
                <Pressable
                  onPress={() => {
                    setResOutcome(item)
                  }}
                  className={`p-3 rounded-xl m-1 ${resOutcome === item ? 'bg-tertiary' : 'bg-background'}`}
                >
                  <Text className={`font-semibold text-base ${resOutcome === item ? 'text-white' : 'text-darkbg'}`}>
                    {item}
                  </Text>
                </Pressable>
              )}
            </ScrollView>
            <Pressable
              onPress={() => {
                handleAddResolution()
              }}
              className='p-5 rounded-xl bg-primary mt-5'
            >
              <Text className='text-lg font-semibold text-background text-center'>
                Update Case Resolution
              </Text>
            </Pressable>
          </View>
          : null}
        {navigateStatus < 4 ?
          <Pressable
            onPress={() => {
              handleProceedToNewSection()
            }}
            className='bg-tertiary p-5 rounded-xl mt-2 items-center justify-center'
          >
            <Text className='text-lg text-background font-bold'>Proceed Further!</Text>
          </Pressable>
          : null}
        <View className='h-[80]'></View>
      </ScrollView>
      <Animated.View
        layout={LinearTransition}
        className={`absolute p-5 ${formExpanded ? 'rounded-xl' : 'rounded-3xl right-5'} bg-darkbg self-center bottom-1`}
      >
        <Pressable
          onPress={() => {
            setFormExpanded(!formExpanded)
          }}
          className=''
        >
          {!formExpanded ?
            <Animated.View entering={FadeIn} exiting={FadeOut}><Ionicons name='help' size={25} color={'white'} /></Animated.View>
            :
            <Animated.View entering={FadeIn} exiting={FadeOut} >
              <Text className='text-white text-xl font-bold'>
                What is this?
              </Text>
              <Markdown
                style={{
                  text: {
                    color: 'white',
                    fontWeight: 'semibold',
                  }
                }}
              >
                {navigatorInfo}
              </Markdown>
            </Animated.View>
          }
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  )
}

export default CaseNavigator