import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { Button, Dialog, Divider, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from 'react-native-element-dropdown';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

type NavProps = StackNavigationProp<RootStack>;

interface Form {
  name: string;
  time?: Date;
  budget?: number;
  currency: string;
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
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [value, setDropDownValue] = useState<any>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [image, setImage] = useState<any>(null);

  const queryClient = useQueryClient();
  const { control, setValue, getValues } = useForm<Form>({
    defaultValues: {
      name: "",
      time: new Date(),
      budget: 0
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
      if (getValues("time") === new Date() && getValues("time") !== event.data.time) setValue('time', event.data.time)
      if (getValues("budget") === 0 && getValues("budget") !== event.data.budget) setValue('budget', event.data.budget)
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

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri)
    }
  };

  async function handleBudgetChange() {
    try {
      const docRef = doc(db, "events", eventId);
      updateDoc(docRef, {
        budget: getValues("budget")
      })
      setVisible3(false)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleCurrency() {
    try {
      const docRef = doc(db, "events", eventId);
      updateDoc(docRef, {
        currency: value
      })
      setVisible4(false)
    } catch (error) {
      console.log(error);
    }
  }

  const uploadImage = async (image: any) => {
    try {
      //upload image to firebase storage and save the image in firestore
      const storageRef = ref(storage, `events/${eventId}/images/`);
      await uploadBytes(storageRef, image).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        getDownloadURL(snapshot.ref).then(async (url) => {
          await updateDoc(doc(db, 'events', eventId), {
            image: url
          })
        })
      });
    } catch (error) {
      console.log(error)
    }
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
      <Dialog isVisible={visible3} onBackdropPress={() => setVisible3(false)}>
        <Controller control={control} name="budget" render={({ field: { onChange, onBlur, value } }) => (
          <Input placeholder="Event Budget" value={value?.toString()} onChangeText={onChange} onBlur={onBlur} />
        )} />
        <Button title="Change Budget" onPress={handleBudgetChange} />
      </Dialog>
      <Dialog isVisible={visible4} onBackdropPress={() => setVisible4(false)}>
        <Dropdown labelField="label" valueField='value' value={value} onChange={(value) => setDropDownValue(value)}
          data={[{ label: "INR", value: "INR" }, { label: "USD", value: "USD" }]} />
        <Button title="Change Currency" onPress={handleCurrency} />
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
        <TouchableOpacity onPress={pickImage}>
          <View className='flex flex-col justify-center items-start w-full gap-y-3'>
            <View className='flex flex-col gap-y-1'>
              <Text>Image</Text>
              <Text className='text-sm text-gray-500'>Upload the event photo</Text>
            </View>
            {/* <Avatar size='large' /> */}
          </View>
        </TouchableOpacity>
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
          showTimePicker()
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
        <TouchableOpacity onPress={() => {
          setVisible3(true)
        }}>
          <View className='flex flex-row justify-between items-center w-full gap-y-3'>
            <View className='flex flex-col gap-y-1'>
              <Text>Budget</Text>
              <Text className='text-sm text-gray-500'>{event.data && event.data.budget}</Text>
            </View>
            <AntDesign name="right" size={20} color="black" />
          </View>
        </TouchableOpacity>
        <Divider width={1} style={{
          marginVertical: 5
        }} />
        <TouchableOpacity onPress={() => {
          setVisible4(true)
        }}>
          <View className='flex flex-row justify-between items-center w-full gap-y-3'>
            <View className='flex flex-col gap-y-1'>
              <Text>Currency</Text>
              <Text className='text-sm text-gray-500'>{event.data && event.data.currency.value}</Text>
            </View>
            <AntDesign name="right" size={20} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <Button title="DELETE YOUR ACCOUNT" />
      </View>
    </ScrollView>
  )
}   