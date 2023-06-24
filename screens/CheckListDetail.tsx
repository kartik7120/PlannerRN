import { View, Text } from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStack } from '../App'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Divider, Image, ListItem } from '@rneui/themed';
import { FAB } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

type NavProps = StackNavigationProp<RootStack, "CheckListDetail">;
type RouteProps = RouteProp<RootStack, "CheckListDetail">;

export default function CheckListDetail() {

  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const [subtasks, setSubtasks] = React.useState<any[] | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params && route.params.name,
    })
  }, [navigation])

  useEffect(() => {
    async function getSubtasks() {
      try {
        const eventId = await AsyncStorage.getItem('currentEventId');
        if (!eventId) throw new Error('No event id found');
        if (!route.params || !route.params.id) throw new Error('No task id found');
        const colRef = collection(db, 'events', eventId, 'checklist', route.params.id, 'subtask');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSubtasks(data);
        })
        return unsubscribe;
      } catch (error) {
        console.log(error);
      }
    }
    getSubtasks();
  }, [])

  return (
    <View>
      <View className='bg-white border rounded-lg overflow-hidden border-transparent m-2 p-2 relative'>
        <View className='flex flex-row items-center gap-x-3'>
          <AntDesign name="infocirlceo" size={24} color="black" />
          <Text className='text-lg'>DETAILS</Text>
        </View>
        <Divider width={1} style={{
          marginTop: 5,
          marginBottom: 5,
        }} />
        <View className='flex flex-row justify-between items-center'>
          <View className='flex flex-col gap-y-2'>
            <Text className='text-sm'>Name</Text>
            <Text className='text-sm'>Note</Text>
            <Text className='text-sm'>Category</Text>
            <Text className='text-sm'>Date</Text>
            <Text className='text-sm'>Status</Text>
          </View>
          <View className='flex flex-col gap-y-2'>
            <Text className='text-sm'>{route.params && route.params.name}</Text>
            <Text className='text-sm'>{route.params && route.params.note}</Text>
            <Text className='text-sm'>{route.params && route.params.category}</Text>
            {/* <Text className='text-sm'>{route.params && route.params.date}</Text> */}
            <Text>Date</Text>
            <Text className='text-sm'>{route.params && route.params.completed}</Text>
          </View>
        </View>
        <FAB icon={<AntDesign name="edit" size={24} color="white" />} style={{
          position: 'absolute',
        }} placement='right' onPress={() => {
          navigation.navigate("CheckListModal", {
            name: route.params && route.params.name,
            note: route.params && route.params.note,
            category: route.params && route.params.category,
            date: route.params && route.params.date,
            completed: route.params && route.params.completed,
            id: route.params && route.params.id,
            edit: true,
          })
        }} />
      </View>
      <View className='bg-white border border-transparent rounded-lg overflow-hidden m-2 p-2 relative'>
        <View className='flex flex-row items-center gap-x-3'>
          <FontAwesome name="list-alt" size={24} color="black" />
          <Text>SUBTASKS</Text>
        </View>
        <Divider width={1} style={{
          marginTop: 5,
          marginBottom: 5,
        }} />
        <View className='flex flex-col items-center gap-y-2'>
          {subtasks && subtasks?.length <= 0 ? (
            <>
              <Image source={require("../assets/not_found.png")} style={{
                width: 70,
                height: 70,
                resizeMode: 'contain',
              }} />
              <Text className='text-lg'>No Sutasks</Text>
              <Text className='text-gray-500'>Click + to add subtasks</Text>
            </>
          ) : (
            <View className='w-full'>
              {subtasks && subtasks?.map((subtask) => (
                <ListItem bottomDivider key={subtask.id}>
                  <ListItem.CheckBox checked={subtask.completed} />
                  <View className='flex flex-row justify-between items-center w-full' key={subtask.id}>
                    <Text className='text-sm' style={{
                      textDecorationLine: subtask.completed ? 'line-through' : 'none',
                    }}>{subtask.name}</Text>
                  </View>
                </ListItem>
              ))}
            </View>
          )}
        </View>
        <FAB icon={<AntDesign name="plus" size={24} color="white" />} placement='right' onPress={() => {
          navigation.navigate("SubTask", {
            taskId: route.params && route.params.id,
          });
        }} />
      </View>
    </View>
  )
}