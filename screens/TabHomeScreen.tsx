import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import Timer from '../components/Timer'
import { Button, Image } from '@rneui/themed'
import { Feather, AntDesign } from '@expo/vector-icons';
import { Divider } from '@rneui/themed';

export default function TabHomeScreen() {
  return (
    <ScrollView>
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
      {/* Menu */}
      <View className='bg-white p-3 border rounded-lg border-transparent overflow-hidden m-2'>
        <View className='flex flex-row justify-between items-center'>
          <View className='flex flex-row gap-x-3 items-center'>
            <Feather name="menu" size={24} color="black" />
            <Text className='text-lg'>Menu</Text>
          </View>
          <TouchableOpacity className='flex flex-row gap-x-1 items-center justify-center'>
            <Text className='text-black text-lg'>More</Text>
            <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>
        </View>
        <Divider width={0.8} />
        <View>
          <View className='flex flex-col gap-y-4 mt-3'>
            <View className='flex flex-row items-center justify-evenly'>
              <TouchableOpacity className='flex flex-col justify-center items-center max-w-fit gap-y-2'>
                <Image source={require("../assets/task_list.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
                <Text>Checklist</Text>
              </TouchableOpacity>
              <TouchableOpacity className='flex flex-col justify-center items-center max-w-fit gap-y-2'>
                <Image source={require("../assets/guest.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
                <Text>Guest</Text>
              </TouchableOpacity>
              <TouchableOpacity className='flex flex-col justify-center items-center max-w-fit gap-y-2'>
                <Image source={require("../assets/budget.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
                <Text>Budget</Text>
              </TouchableOpacity>
              <TouchableOpacity className='flex flex-col justify-center items-center max-w-fit gap-y-2'>
                <Image source={require("../assets/vendor.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
                <Text>Vendors</Text>
              </TouchableOpacity>
            </View>
            <View className='flex flex-row items-center justify-evenly'>
              <TouchableOpacity className='flex flex-col justify-center items-center max-w-fit gap-y-2'>
                <Image source={require("../assets/schedule.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
                <Text>Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity className='flex flex-col justify-center items-center max-w-fit gap-y-2'>
                <Image source={require("../assets/billboard.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
                <Text>Events</Text>
              </TouchableOpacity>
              <TouchableOpacity className='flex flex-col justify-center items-center max-w-fit gap-y-2'>
                <Image source={require("../assets/support.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
                <Text>Support</Text>
              </TouchableOpacity>
              <TouchableOpacity className='flex flex-col justify-center items-center max-w-fit gap-y-2'>
                <Image source={require("../assets/messaging.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
                <Text>Messages</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}