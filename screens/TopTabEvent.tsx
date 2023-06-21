import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { Image } from '@rneui/themed';
import { FAB } from '@rneui/themed';
import { AntDesign } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { RootTab } from './TabNavigator';
import { ParamsForTopTab, TopTabTabs } from './TabBudgetScreen';
import { LinearProgress } from '@rneui/themed';

type TopTabEventNavigationProp = StackNavigationProp<RootStack, 'BudgetModal'>;
type RouteProps = RouteProp<TopTabTabs<ParamsForTopTab>, 'Accessories'>;

export default function TopTabEvent() {

  const [visible, setVisible] = React.useState(true);
  const navigation = useNavigation<TopTabEventNavigationProp>();
  const route = useRoute<RouteProps>();
  const [items, setItems] = React.useState<any[]>([]);

  useEffect(() => {
    async function getItems() {
      try {
        const eventId = await AsyncStorage.getItem('currentEventId');
        if (eventId === null) {
          return;
        }
        const q = query(collection(db, `events/${eventId}/budget`), where("category", "==", route.params.title))
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setItems(() => {
            const data = snapshot.docs.map(doc => {
              return {
                id: doc.id,
                ...doc.data()
              }
            });
            return data;
          });
        });
        return () => unsubscribe();
      } catch (error) {
        console.log(error);
      }
    }
    getItems();
  }, [])

  return (
    <>
      {items.length > 0 ? (
        items.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => {
            navigation.navigate("BudgetItemModal", {
              title: route.params.title,
              id: item.id,
              category: item.category,
              name: item.name,
              amount: item.amount,
              paid: item.paid,
              note: item.note,
              pending: item.pending,
            })
          }}>
            <View className='bg-white p-2 rounded-lg overflow-hidden m-2 flex flex-col gap-y-2'>
              <Text className='text-xl'>{item.name}</Text>
              <LinearProgress value={Number((Number(item.paid) / Number(item.amount)).toFixed(2))} animation={{
                duration: 1000,
              }} />
              <View className='flex flex-row justify-between items-center'>
                <Text className='text-gray-500 text-lg'>Paid {item.paid}</Text>
                <Text className='text-gray-500 text-lg'>Amount: {item.amount}</Text>
              </View>
            </View>
          </TouchableOpacity>))) : (
        <View className='flex flex-col justify-center h-full items-center'>
          <Image source={require("../assets/not_found.png")} alt="Not Found" style={{
            width: 100,
            height: 100,
            resizeMode: "contain"
          }} />
          <Text className='text-black text-lg'>There are no cost</Text>
          <Text className='text-gray-500'>Click + to add a new item</Text>
        </View>
      )}
      <FAB className='mt-4' onPress={() => {
        navigation.navigate('BudgetModal');
      }} placement='right' color="orange" icon={<AntDesign name="plus" size={24} color="black" />} />
    </>
  )
}