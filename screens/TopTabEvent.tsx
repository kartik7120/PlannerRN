import { View, Text } from 'react-native';
import React from 'react';
import { Image } from '@rneui/themed';
import { FAB } from '@rneui/themed';
import { AntDesign } from '@expo/vector-icons';

export default function TopTabEvent() {

  const [visible, setVisible] = React.useState(true);

  return (
    <View className='flex flex-col justify-center h-full items-center'>
      <Image source={require("../assets/not_found.png")} alt="Not Found" style={{
        width: 100,
        height: 100,
        resizeMode: "contain"
      }} />
      <Text className='text-black text-lg'>There are no cost</Text>
      <Text className='text-gray-500'>Click + to add a new item</Text>
      <FAB className='mt-4' placement='right' color="orange" icon={<AntDesign name="plus" size={24} color="black" />} />
    </View>
  )
}