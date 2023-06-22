import { View, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CheckListScreen from './CheckListScreen';
import { Divider, FAB, Image, ListItem } from '@rneui/themed';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import { Category } from "./CheckListScreen";
type TopTabCheckListTabs<T> = {
  [key in keyof T]: T[key]
};

type ParamsForTopTab = {
  title: string;
}

type NavTypes = StackNavigationProp<RootStack, 'CheckListModal'>;

const TopTab = createMaterialTopTabNavigator();

function returnCategoryIcon(category: string) {
  switch (category) {
    case Category.Attire:
      return <AntDesign name="skin" size={22} color="gray" />;
    case Category.Health:
      return <AntDesign name="medicinebox" size={22} color="gray" />;
    case Category.Music:
      return <AntDesign name="sound" size={22} color="gray" />;
    case Category.Flower:
      return <AntDesign name="enviromento" size={22} color="gray" />;
    case Category.Photo:
      return <AntDesign name="camera" size={22} color="gray" />;
    case Category.Accessories:
      return <AntDesign name="wallet" size={22} color="gray" />;
    case Category.Reception:
      return <AntDesign name="home" size={22} color="gray" />;
    case Category.Transpotation:
      return <AntDesign name="car" size={22} color="gray" />;
    case Category.Accomodation:
      return <AntDesign name="home" size={22} color="gray" />;
    case Category.Unassigned:
      return <AntDesign name="questioncircleo" size={22} color="gray" />;
    default:
      return <AntDesign name="questioncircleo" size={22} color="gray" />;
  }
}


export default function TabCheckListScreen() {

  const [event, setEvent] = React.useState<any[] | null>(null);
  const navigation = useNavigation<NavTypes>();

  useEffect(() => {
    async function getCheckList() {
      const eventId = await AsyncStorage.getItem('currentEventId');
      if (!eventId) throw new Error('No event id found');
      const docRef = collection(db, 'events', eventId, "checklist");
      const docSnap = await getDocs(docRef);
      onSnapshot(docRef, (doc) => {
        const setData = doc.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        })
        setEvent(setData);
      })
    }
    getCheckList();
  }, [])

  return (
    <ScrollView className='h-full'>
      {event && event?.length > 0 ? (
        <View className='flex flex-col gap-y-2 m-2'>
          {event.map((item, index) => (
            <ListItem key={item.id} bottomDivider>
              <ListItem.CheckBox checked={item.checked} />
              <ListItem.Content style={{
                width: "100%",
                borderRadius: 10,
              }}>
                <View key={item.id} className='bg-white rounded-lg overflow-hidden w-full p-2 flex flex-col gap-y-2'>
                  <Text className='text-lg '>{item.name}</Text>
                  <View className='flex flex-row justify-between items-center'>
                    <View className='flex flex-row gap-x-1'>
                      <Text> {returnCategoryIcon(item.category)}</Text>
                      <Text className='text-md text-gray-500'>{item.category}</Text>
                    </View>
                    <Text className='text-orange-500'>Date</Text>
                  </View>
                </View>
              </ListItem.Content>
            </ListItem>
          ))}
        </View>
      ) : (
        <View className='flex flex-col gap-y-1 items-center justify-center'>
          <Image source={require("../assets/not_found.png")} style={{
            width: 80,
            height: 80,
            resizeMode: 'contain',
          }} />
          <Text className='text-center text-xl font-bold'>There are no tasks</Text>
          <Text className='text-center text-lg text-gray-500 font-bold'>Click + to add a new item</Text>
        </View>
      )}
      <FAB icon={<AntDesign name="plus" size={24} color="white" />} placement='right' onPress={() => {
        navigation.navigate('CheckListModal', {

        })
      }} />
    </ScrollView>
  )
}