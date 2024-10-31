import React from 'react';
import { Image, Pressable } from 'react-native';

interface TabButtonProps {
  onPress: () => void;
  isActive: boolean;
  icon: any;
}

const TabButton = ({ onPress, isActive, icon }: TabButtonProps) => (
  <Pressable
    onPress={onPress}
    className='m-1 rounded-full p-3'
    style={{ backgroundColor: isActive ? '#EBD9CD' : '#241C1A' }}
  >
    <Image
      source={icon}
      className='w-[30] h-[30]'
      tintColor={isActive ? 'black' : '#F4EEE4'}
    />
  </Pressable>
);

export default TabButton;
