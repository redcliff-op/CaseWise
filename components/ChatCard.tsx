import { View, Text } from 'react-native'
import React, { memo } from 'react'
import { ChatItem } from '@/global'
import Markdown from 'react-native-markdown-display'

interface ChatCardProps {
  chatItem: ChatItem
}

const ChatCard = ({ chatItem }: ChatCardProps) => {

  return (
    <View
      className='justify-between flex-row flex-wrap items-end gap-1 rounded-3xl my-1 px-5 py-3'
      style={{
        backgroundColor: (chatItem.ai) ? "#507680" : "#EBD9CD",
        marginRight: (chatItem.ai) ? 40 : 0,
        marginLeft: (chatItem.ai) ? 0 : 40,
        alignSelf: (chatItem.ai) ? 'flex-start' : 'flex-end'
      }}
    >
      <Markdown
        style={{
          text: {
            color: (chatItem.ai) ? 'white' : 'black',
            fontWeight: 'semibold',
          }
        }}
      >
        {chatItem.message}
      </Markdown>
      <Text
        className='text-xs'
        style={{
          color: (chatItem.ai) ? 'white':'black'
        }}
      >
      {chatItem.time}</Text>
    </View >
  )
}

export default memo(ChatCard)