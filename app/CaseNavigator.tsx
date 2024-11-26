import { View, Text, ScrollView, TextInput, Pressable, ToastAndroid, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/shallow'
import useStore from '@/store/useStore'
import Ionicons from '@expo/vector-icons/Ionicons'
import Collapsible from 'react-native-collapsible'
import { CaseFiling } from '@/global'

const CaseNavigator = () => {

  const [currentCase, caseList] = useStore(
    useShallow((state) => [state.currentCase, state.caseList])
  )

  const [filingExpanded, setFilingExpanded] = useState<boolean>(false)
  const [evidenceExpanded, setEvidenceExpanded] = useState<boolean>(false)

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

  const categoryList = ["Civil", "Criminal", "Corporate", "Family", "Other"]
  const caseStatusList = ["Draft", "Submitted", "Rejected"]
  const evidenceTypeList = ["Physical","Digital","Witness Statement", "Other"]

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

  const handleAddEvidence = async() => {

  }

  const handleProceedToNewSection = async () => {
    let status = navigateStatus
    if(status===1){
      if(currentCase?.evidenceCollection?.length===0){
        Alert.alert("No Evidence","Cannot proceed further without Evidences!")
        return;
      }
    }
    status++;
    setNavigateStatus(status)
  }

  return (
    <SafeAreaView className='bg-background flex-1 px-4'>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className='text-darkbg text-2xl font-bold'>
          Case Navigator!
        </Text>
        <Text className='text-darkbg text-base'>
          Your personalized case manager!
        </Text>
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
            <Text className='text-darkbg text-lg font-bold mt-5'>
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
            <Text className='text-darkbg text-lg font-bold mt-5'>
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
            <Text className='text-darkbg text-lg mt-5'>
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
            <Text className='text-darkbg text-lg font-bold mt-5'>
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
        {navigateStatus>0?
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
                  placeholder='Enter Evidence Description'
                />
              </View>
              <Text className='text-darkbg text-lg mt-2 font-bold'>
                Evidence Type
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {evidenceTypeList.map((item) =>
                  <Pressable
                    onPress={() => {
                      setEvidenceType (item)
                    }}
                    className={`p-3 rounded-xl m-1 ${evidenceType === item ? 'bg-tertiary' : 'bg-background'}`}
                  >
                    <Text className={`font-semibold text-base ${evidenceType === item ? 'text-white' : 'text-darkbg'}`}>
                      {item}
                    </Text>
                  </Pressable>
                )}
              </ScrollView>
            </Collapsible>
          </View>
        :null}
        <Pressable
          onPress={() => {
            handleProceedToNewSection()
          }}
          className='bg-tertiary p-5 rounded-xl mt-2 items-center justify-center'
        >
          <Text className='text-lg text-background font-bold'>Proceed to Evidence Collection!</Text>
        </Pressable>
        <View className='h-[80]'></View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CaseNavigator