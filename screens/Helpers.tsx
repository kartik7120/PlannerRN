import { View, Text, Share } from 'react-native'
import React, { useState } from 'react'
import { Button, FAB } from '@rneui/themed'
import { AntDesign } from '@expo/vector-icons'
import { Dialog } from '@rneui/themed';
import * as Clipboard from 'expo-clipboard';
import { useQueryClient } from '@tanstack/react-query';

export default function Helpers() {

  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const id = queryClient.getQueryData(['currentEventId'], {
    exact: true
  })

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(id as string);
  };

  const onShare = async () => {
    const result = await Share.share({
      message: id as string || 'React Native | A framework for building native apps using React',
      title: id as string || "Code"
    })

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
        console.log(result.activityType)
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  }

  return (
    <>
      <Dialog isVisible={visible} onDismiss={() => setVisible(false)} onBackdropPress={() => setVisible(false)}>
        <View className='flex flex-col gap-y-3 items-center'>
          <Text className='text-xl text-center'>Invite helpers</Text>
          <Text className='text-center text-sm'>Share this code with friends and prepare for the event together</Text>
          <Text className='text-2xl font-semibold text-center'>{id as string}</Text>
          <View className='flex flex-row items-center w-full'>
            <View className='w-1/2'>
              <Button type="outline" onPress={() => copyToClipboard()}>COPY</Button>
            </View>
            <View className='w-1/2'>
              <Button onPress={() => onShare()}>SEND</Button>
            </View>
          </View>
        </View>
      </Dialog>
      <View className='h-full'>
        <Text>Helpers</Text>
        <FAB placement='right' onPress={() => setVisible(true)} icon={<AntDesign name="plus" size={24} color="black" />} />
      </View>
    </>
  )
}