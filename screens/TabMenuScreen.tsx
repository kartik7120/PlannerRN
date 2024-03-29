import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { Divider, Image } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { AntDesign, Octicons, MaterialIcons } from '@expo/vector-icons';
import CarnivalMask from '../assets/carnivalMask.svg';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { RootTab } from './TabNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStack } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';

type MenuScreenProps = CompositeNavigationProp<
  BottomTabNavigationProp<RootTab, 'Menu'>,
  StackNavigationProp<RootStack>
>

const loadEvent = async ({ queryKey }: any) => {
  const [_key, { id }] = queryKey;
  const docRef = doc(db, 'events', id);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export default function TabMenuScreen() {

  const navigation = useNavigation<MenuScreenProps>();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const id = queryClient.getQueryData(['currentEventId'], {
    exact: true
  });

  const event = useQuery(['event', { id }], loadEvent, {
    enabled: !!id
  })

  return (
    <ScrollView>
      {/* Upper part */}
      <View className='bg-white rounded-md overflow-hidden m-2'>
        <View className='flex flex-col gap-y-0.5 items-center p-3'>
          <Image source={{ uri: event.data && event.data.image || null }} style={{
            width: 100,
            height: 100,
            borderRadius: 100,
            borderColor: 'gray',
            borderWidth: 2,
          }} />
          <Text className='text-lg font-semibold'>{user?.username}</Text>
          <Text className='text-sm font-light'>{user?.emailAddresses[0].emailAddress}</Text>
        </View>
        <Divider />
        <View className='flex flex-row justify-between items-center w-full p-2 bg-white'>
          <View className=' flex flex-row gap-x-3'>
            <Image source={require("../assets/event_icon.jpg")}
              style={{ width: 50, height: 50, borderRadius: 50 / 2 }}
            />
            <View>
              <Text className='text-lg text-black'>{event.data && event.data.name}</Text>
              <View className='flex flex-row gap-x-2'>
                <Text className='text-gray-400'>{event.data && new Date(event.data.date.seconds * 1000).toDateString()}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => {
            queryClient.invalidateQueries(["currentEventId"], {
              exact: true
            });
          }}>
            <Feather name="refresh-ccw" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Middle part */}
      <View className='bg-white m-2 rounded-lg overflow-hidden'>
        <TouchableOpacity onPress={() => {
          navigation.navigate('First');
        }}>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <AntDesign name="home" size={24} color="black" />
              <Text className='text-lg font-light'>Home</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity onPress={() => {
          navigation.navigate('Checklist');
        }}>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <Octicons name="checklist" size={24} color="black" />
              <Text className='text-lg font-light'>Checklist</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity onPress={() => {
          navigation.navigate("Guests")
        }}>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <AntDesign name="team" size={24} color="black" />
              <Text className='text-lg font-light'>Guests</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity onPress={() => {
          navigation.navigate('Budget', {
            tabNavigationNavigation: navigation
          });
        }}>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <AntDesign name="creditcard" size={24} color="black" />
              <Text className='text-lg font-light'>Budget</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity onPress={() => {
          navigation.navigate('Vendors');
        }}>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <AntDesign name="contacts" size={24} color="black" />
              <Text className='text-lg font-light'>Vendors</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <View className='bg-white m-2 rounded-lg overflow-hidden'>
        <TouchableOpacity onPress={() => {
          navigation.navigate('Events');
        }}>
          <View className='flex flex-row justify-between items-center p-2'>
            <View className='flex flex-row gap-x-3 items-center'>
              <AntDesign name="staro" size={24} color="black" />
              <Text className='text-lg font-light'>Events</Text>
            </View>
            <AntDesign name="right" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity onPress={() => {
          navigation.navigate('Settings');
        }}>
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