import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { Divider, Image } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { AntDesign, Octicons, MaterialIcons } from '@expo/vector-icons';
import CarnivalMask from '../assets/carnivalMask.svg';

export default function TabMenuScreen() {
  return (
    <ScrollView>
      {/* Upper part */}
      <View className='bg-white rounded-md overflow-hidden m-2'>
        <View className='flex flex-col gap-y-0.5 items-center p-3'>
          <Image source={{ uri: 'https://i.imgur.com/2xRJYUS.png' }} style={{
            width: 100,
            height: 100,
            borderRadius: 100,
            borderColor: 'gray',
            borderWidth: 2,
          }} />
          <Text className='text-lg font-semibold'>Username</Text>
          <Text className='text-sm font-light'>Email</Text>
        </View>
        <Divider />
        <View className='flex flex-row justify-between items-center w-full p-2 bg-white'>
          <View className=' flex flex-row gap-x-3'>
            <Image source={require("../assets/event_icon.jpg")}
              style={{ width: 50, height: 50, borderRadius: 50 / 2 }}
            />
            <View>
              <Text className='text-lg text-black'>Event title</Text>
              <View className='flex flex-row gap-x-2'>
                <Text className='text-gray-400'>Date</Text>
                <Text className='text-gray-400'>Your event</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity>
            <Feather name="refresh-ccw" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Middle part */}
      <View className='bg-white m-2 rounded-lg overflow-hidden'>
        <TouchableOpacity>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <AntDesign name="home" size={24} color="black" />
              <Text className='text-lg font-light'>Home</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <Octicons name="checklist" size={24} color="black" />
              <Text className='text-lg font-light'>Checklist</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <AntDesign name="team" size={24} color="black" />
              <Text className='text-lg font-light'>Guests</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <AntDesign name="creditcard" size={24} color="black" />
              <Text className='text-lg font-light'>Budget</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <AntDesign name="contacts" size={24} color="black" />
              <Text className='text-lg font-light'>Vendors</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <MaterialIcons name="schedule" size={24} color="black" />
              <Text className='text-lg font-light'>Schedule</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <View className='bg-white m-2 rounded-lg overflow-hidden'>
        <TouchableOpacity>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <AntDesign name="staro" size={24} color="black" />
              <Text className='text-lg font-light'>Events</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <MaterialIcons name="groups" size={24} color="black" />
              <Text className='text-lg font-light'>Helpers</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <AntDesign name="message1" size={24} color="black" />
              <Text className='text-lg font-light'>Messages</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <AntDesign name="setting" size={24} color="black" />
              <Text className='text-lg font-light'>Settings</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <View className='bg-white m-2 rounded-lg overflow-hidden p-4'>
        <View className='flex flex-row justify-around items-center'>
          <CarnivalMask width={100} height={100} />
          <Text className='text-4xl text-black'>TopEvent</Text>
        </View>
      </View>
    </ScrollView>
  )
}