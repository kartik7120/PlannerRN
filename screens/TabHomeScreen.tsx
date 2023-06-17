import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Timer from '../components/Timer'
import { Button, ButtonGroup, Image } from '@rneui/themed'
import { Feather, AntDesign } from '@expo/vector-icons';
import { Divider } from '@rneui/themed';
import { LinearProgress } from '@rneui/themed';
import { Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {
  PieChart,
} from "react-native-chart-kit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { db } from '../firebase';
import Tick from "../assets/tick.svg";

export default function TabHomeScreen() {

  const [event, setEvent] = useState<any>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    (async function lloadCurrentEvent() {
      const currentEventId = await AsyncStorage.getItem('currentEventId');

      if (currentEventId === null) {
        return;
      }
      const docRef = doc(db, "events", currentEventId);

      const unsubscribe = onSnapshot(docRef, (doc) => {
        const data = doc.data();
        setEvent(data);
        console.log(`data for current event : ${JSON.stringify(data)}`);
      })

      return unsubscribe;
    })()
  }, [])

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
              <Text className='text-lg text-black'>{event && event.name || "Event name"}</Text>
              <View className='flex flex-row gap-x-2'>
                <Text className='text-gray-400'>Date</Text>
                <Text className='text-gray-400'>Your event</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => setVisible(!visible)}>
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {visible && <>
          <View className='bg-white flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-2 items-center'>
              <Octicons name="feed-star" size={24} color="black" />
              <Text className='text-black font-normal text-lg'>EVENTS</Text>
            </View>
            <TouchableOpacity onPress={() => {
              setVisible(false);
            }}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View className='flex flex-row justify-between items-center w-full p-2 bg-white'>
            <View className=' flex flex-row gap-x-3'>
              <Image source={require("../assets/event_icon.jpg")}
                style={{ width: 50, height: 50, borderRadius: 50 / 2 }}
              />
              <View>
                <Text className='text-lg text-black'>{event && event.name || "Event name"}</Text>
                <View className='flex flex-row gap-x-2'>
                  <Text className='text-gray-400'>Date</Text>
                  <Text className='text-gray-400'>Your event</Text>
                </View>
              </View>
            </View>
            <View>
              <Tick width={32} height={32} />
            </View>
          </View>
          <View className='flex flex-row justify-between items-center bg-white mt-2 gap-x-1'>
            <View className='basis-1/2'>
              <Button title="JOIN" type='outline' />
            </View>
            <View className='basis-1/2'>
              <Button type='solid' title="CREATE" />
            </View>
          </View>
        </>
        }
      </View>
      {/* Menu */}
      <View className='bg-white p-3 border rounded-lg border-transparent overflow-hidden m-2'>
        <View className='flex flex-row justify-between items-center'>
          <View className='flex flex-row gap-x-3 items-center'>
            <Feather name="menu" size={24} color="black" />
            <Text className='text-lg'>MENU</Text>
          </View>
          <TouchableOpacity className='flex flex-row gap-x-1 items-center justify-center'>
            <Text className='text-black text-lg'>More</Text>
            <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>
        </View>
        <Divider width={0.8} style={{
          marginTop: 5,
        }} />
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
      {/* CheckList */}
      <View className='bg-white rounded-lg overflow-hidden m-2 border-transparent p-4'>
        <View className='flex flex-row items-center justify-between'>
          <View className='flex flex-row gap-x-3 items-center'>
            <Octicons name="checklist" size={24} color="black" />
            <Text className='text-lg'>CHECKLIST</Text>
          </View>
          <TouchableOpacity className='flex flex-row gap-x-1 items-center justify-center'>
            <Text className='text-black text-lg'>Summary</Text>
            <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>
        </View>
        <Divider width={0.8} style={{
          marginTop: 5,
        }} />
        <View className='flex flex-col justify-around gap-y-3 mt-1'>
          <View className='flex flex-col justify-between items-center gap-y-3'>
            <Image source={require("../assets/analytics.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
            <Text className='text-center'>There are no uncompleted tasks</Text>
          </View>
          <LinearProgress value={0} color='red' style={{
            height: 15,
          }} />
          <View className='flex flex-row justify-between items-center'>
            <Text>0% completed</Text>
            <Text>0 out of 0</Text>
          </View>
        </View>
      </View>
      {/* Pie charts */}
      <View className='bg-white'>
        <View className='flex flex-row gap-x-3 items-center'>
          <Ionicons name="person-outline" size={24} color="black" />
          <Text>GUESTS</Text>
        </View>
        <Divider width={0.8} style={{
          marginTop: 5,
        }} />
        <View className='w-16 h-16 rounded-full bg-cyan-200'>
          <Text className='text-center'>Chart</Text>
        </View>
        <View>
          <View className='flex flex-row justify-start gap-x-3 items-center'>
            <View className='bg-rose-600 w-2 h-2 rounded-full'></View>
            <Text>0</Text>
            <Text>accepted</Text>
          </View>
          <View className='flex flex-row justify-start gap-x-3 items-center'>
            <View className='bg-yellow-600 w-2 h-2 rounded-full'></View>
            <Text>0</Text>
            <Text>pending</Text>
          </View>
          <View className='flex flex-row justify-start gap-x-3 items-center'>
            <View className='bg-purple-600 w-2 h-2 rounded-full'></View>
            <Text>0</Text>
            <Text>denied</Text>
          </View>
        </View>
      </View>
      <View className='bg-white m-2 rounded overflow-hidden'>
        <View className='flex flex-row justify-between'>
          <View className='flex flex-row gap-x-2 items-center'>
            <AntDesign name="creditcard" size={24} color="black" />
            <Text>Budget</Text>
          </View>
          <TouchableOpacity>
            <View className='flex flex-row gap-x-2 items-center'>
              <Text className='text-lg'>Summary</Text>
              <AntDesign name="right" size={18} color="black" />
            </View>
          </TouchableOpacity>
        </View>
        <Divider width={0.8} style={{
          marginTop: 5,
        }} />
        <View className='p-6'>
          <View className='flex flex-row justify-between items-center'>
            <Text>Budget</Text>
            <View className='flex flex-row justify-between items-center gap-x-2'>
              <View className='w-2 h-2 rounded-full bg-gray-500'></View>
              <Text>Not defined</Text>
            </View>
          </View>
          <View className='flex flex-row justify-between items-center'>
            <Text>Paid</Text>
            <View className='flex flex-row justify-between items-center gap-x-2'>
              <View className='w-2 h-2 rounded-full bg-rose-500'></View>
              <Text>$ 0</Text>
            </View>
          </View>
          <View className='flex flex-row justify-between items-center'>
            <Text>Pending</Text>
            <View className='flex flex-row justify-between items-center gap-x-2'>
              <View className='w-2 h-2 rounded-full bg-yellow-500'></View>
              <Text>$ 0</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}