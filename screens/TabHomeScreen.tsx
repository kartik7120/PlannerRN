import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Timer from '../components/Timer'
import { Image } from '@rneui/themed'
import { Feather } from '@expo/vector-icons';

export default function TabHomeScreen() {
  return (
    <View>
      <View className='border overflow-hidden border-transparent rounded-lg m-2'>
        <Timer />
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
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}