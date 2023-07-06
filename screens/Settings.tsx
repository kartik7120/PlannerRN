import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { Button, Divider } from '@rneui/themed';
import { Avatar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

type NavProps = StackNavigationProp<RootStack>;

export default function Settings() {

  const navigation = useNavigation<NavProps>();
  const [eventId, setEventId] = React.useState<string | null>(null);

 

  return (
    <ScrollView>
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
        <View className='flex flex-row justify-between items-center w-full gap-y-3'>
          <View className='flex flex-col gap-y-1'>
            <Text>Name</Text>
            <Text className='text-sm text-gray-500'>Event name</Text>
          </View>
          <AntDesign name="right" size={20} color="black" />
        </View>
        <Divider width={1} style={{
          marginVertical: 5
        }} />
        <View className='flex flex-row justify-between items-center w-full gap-y-3'>
          <View className='flex flex-col gap-y-1'>
            <Text>Time</Text>
            <Text className='text-sm text-gray-500'>Event Time here</Text>
          </View>
          <AntDesign name="right" size={20} color="black" />
        </View>
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