import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { Button, Dialog, Divider, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import DateTimePickerModal from "react-native-modal-datetime-picker";

type NavProps = StackNavigationProp<RootStack>;

interface Form {
  name: string;
  time?: Date;
}

const setEventName = async ({ eventId, newName }: any) => {
  const docRef = doc(db, 'events', eventId)
  await updateDoc(docRef, {
    name: newName
  })
}

const loadEvent = async ({ queryKey }: any) => {
  const [key, eventId] = queryKey;
  const docRef = doc(db, 'events', eventId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists() === true) {
    return docSnap.data()
  }
  else return null;
}

export default function Settings() {

  const navigation = useNavigation<NavProps>();
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const queryClient = useQueryClient();
  const { control, setValue, getValues } = useForm<Form>({
    defaultValues: {
      name: "",
      time: new Date()
    }
  })

  const eventId = queryClient.getQueryData(['currentEventId'], {
    exact: true
  }) as string

  const event = useQuery(['event', eventId], loadEvent, {
    enabled: !!eventId
  })

  if (event.status === "success") {
    if (event.data !== null && event.data !== undefined) {
      if (getValues("name") === "" && getValues("name") !== event.data.name) setValue('name', event.data.name)
    }
  }

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  }

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  }

  const handleTimeConfirm = async (time: any) => {
    setValue("time", time)
    await updateDoc(doc(db, 'events', eventId), {
      time: time
    })
    hideTimePicker();
  }

  const changeName = useMutation({
    mutationFn: setEventName,
  })

  return (
    <ScrollView>
      <Dialog isVisible={visible1} onBackdropPress={() => setVisible1(false)}>
        <Controller control={control} name="name" render={({ field: { onChange, onBlur, value } }) => (
          <Input placeholder="Event Name" value={value} onChangeText={onChange} onBlur={onBlur} />
        )} />
        <Button onPress={() => {
          changeName.mutate({ eventId, newName: getValues("name") })
          setVisible1(false)
          queryClient.invalidateQueries(['currentEventId'])
        }} title="SAVE" />
      </Dialog>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
            onChange={onChange}
          />
        )}
        name="time"
        rules={{ required: true }}
      />
      <View className='bg-white border border-transparent rounded-lg overflow-hidden m-2 p-2'>
        <View className='flex flex-row items-center gap-x-3'>
          <AntDesign name="user" size={24} color="black" />
          <Text>USER</Text>
        </View>
        <Divider width={1} style={{
          marginVertical: 5
        }} />
        <View className='flex flex-col justify-center items-start w-full gap-y-3'>
          <View className='flex flex-col gap-y-1'>
            <Text>Photo</Text>
            <Text className='text-sm text-gray-500'>Upload your photo</Text>
          </View>
          <Divider width={1} style={{
            marginVertical: 5
          }} />
          <TouchableOpacity onPress={() => {
            navigation.navigate('ChainNameSettings')
          }}>
            <View className='flex flex-row items-center justify-between w-full'>
              <View className='flex flex-col gap-y-1'>
                <Text>Name</Text>
                <Text className='text-sm text-gray-500'>username</Text>
              </View>
              <AntDesign name="right" size={24} color="black" />
            </View>
          </TouchableOpacity>
          <Divider width={1} style={{
            marginVertical: 5
          }} />
          <View className='flex flex-col gap-y-1 bg-gray-100 w-full'>
            <Text>E-mail</Text>
            <Text className='text-sm text-gray-500'>email id</Text>
          </View>
          <Divider width={1} style={{
            marginVertical: 5
          }} />
          <View className='flex flex-row items-center w-full justify-between'>
            <View className='flex flex-col gap-y-1'>
              <Text>Password</Text>
              <Text className='text-sm text-gray-500'>change your password</Text>
            </View>
            <AntDesign name="right" size={20} color="black" />
          </View>
          <Divider width={1} style={{
            marginVertical: 5
          }} />
          <View className='flex flex-row items-center w-full justify-between'>
            <View className='flex flex-col gap-y-1'>
              <Text>Log Out</Text>
              <Text className='text-sm text-gray-500'>Log out of the app</Text>
            </View>
            <Button title="LOG OUT" />
          </View>
        </View>
      </View>
      <View className='bg-white border border-transparent rounded-lg m-2 p-2'>
        <View className='flex flex-row items-center gap-x-3'>
          <AntDesign name="staro" size={24} color="black" />
          <Text>EVENT</Text>
        </View>
        <Divider width={1} style={{
          marginVertical: 5
        }} />
        <View className='flex flex-col justify-center items-start w-full gap-y-3'>
          <View className='flex flex-col gap-y-1'>
            <Text>Image</Text>
            <Text className='text-sm text-gray-500'>Upload the event photo</Text>
          </View>
          {/* <Avatar size='large' /> */}
        </View>
        <Divider width={1} style={{
          marginVertical: 5
        }} />
        <TouchableOpacity onPress={() => {
          setVisible1(true)
        }}>
          <View className='flex flex-row justify-between items-center w-full gap-y-3'>
            <View className='flex flex-col gap-y-1'>
              <Text>Name</Text>
              <Text className='text-sm text-gray-500'>{event.data && event.data.name}</Text>
            </View>
            <AntDesign name="right" size={20} color="black" />
          </View>
        </TouchableOpacity>
        <Divider width={1} style={{
          marginVertical: 5
        }} />
        <TouchableOpacity onPress={() => {
          setVisible2(true)
        }}>
          <View className='flex flex-row justify-between items-center w-full gap-y-3'>
            <View className='flex flex-col gap-y-1'>
              <Text>Time</Text>
              <Text className='text-sm text-gray-500'>Event Time here</Text>
            </View>
            <AntDesign name="right" size={20} color="black" />
          </View>
        </TouchableOpacity>
        <Divider width={1} style={{
          marginVertical: 5
        }} />
        <View className='flex flex-row justify-between items-center w-full gap-y-3'>
          <View className='flex flex-col gap-y-1'>
            <Text>Budget</Text>
            <Text className='text-sm text-gray-500'>Event Budget here</Text>
          </View>
          <AntDesign name="right" size={20} color="black" />
        </View>
        <Divider width={1} style={{
          marginVertical: 5
        }} />
        <View className='flex flex-row justify-between items-center w-full gap-y-3'>
          <View className='flex flex-col gap-y-1'>
            <Text>Currency</Text>
            <Text className='text-sm text-gray-500'>Event Currency here</Text>
          </View>
          <AntDesign name="right" size={20} color="black" />
        </View>
        <Divider width={1} style={{
          marginVertical: 5
        }} />
        <View className='flex flex-row justify-between items-center w-full gap-y-3'>
          <View className='flex flex-col gap-y-1'>
            <Text>Export</Text>
            <Text className='text-sm text-gray-500'>Export event data</Text>
          </View>
          <Button title="DOWNLOAD" />
        </View>
      </View>
      <View>
        <Button title="DELETE YOUR ACCOUNT" />
      </View>
    </ScrollView>
  )
}   