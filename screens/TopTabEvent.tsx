import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect } from 'react';
import { Image } from '@rneui/themed';
import { FAB } from '@rneui/themed';
import { AntDesign, Feather } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc, onSnapshot, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { RootTab } from './TabNavigator';
import { ParamsForTopTab, TopTabTabs } from './TabBudgetScreen';
import { LinearProgress } from '@rneui/themed';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type TopTabEventNavigationProp = StackNavigationProp<RootStack, 'BudgetModal'>;
type RouteProps = RouteProp<TopTabTabs<ParamsForTopTab>, 'Accessories'>;

const loadEventFn = async ({ queryKey }: any) => {
  const [_key, eventId] = queryKey;
  const docRef = doc(db, `events/${eventId}`);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return {};
  }
  return docSnap.data();
}

export default function TopTabEvent() {

  const [visible, setVisible] = React.useState(true);
  const navigation = useNavigation<TopTabEventNavigationProp>();
  const route = useRoute<RouteProps>();
  const [items, setItems] = React.useState<any[]>([]);
  const [isLongPressed, setIsLongPressed] = React.useState(false);
  const [selectedItems, setSelected] = React.useState<any[] | null>(null);
  const [backgroundStyles, setBackgroundStyles] = React.useState({
    backgroundColor: "orange",
    opacity: 0.5
  });

  const queryClient = useQueryClient();

  const eventId = queryClient.getQueryData(['currentEventId'], {
    exact: true
  })

  const loadEvent = useQuery(['currentEvent', eventId], loadEventFn, {
    enabled: !!eventId,
  })

  const handleEditPress = () => {
    selectedItems?.map((item) => {
      navigation.push("BudgetModal", {
        title: route.params.title,
        id: item.id,
        category: item.category,
        name: item.name,
        amount: item.amount,
        paid: item.paid,
        note: item.note,
        pending: item.pending,
        edit: true,
      })
    })
    setIsLongPressed(false);
  }

  const handleDelete = async () => {
    try {
      const eventId = await AsyncStorage.getItem('currentEventId');
      if (eventId === null) {
        return;
      }
      if (selectedItems === null || selectedItems.length === 0) {
        return;
      }
      const batch = writeBatch(db);
      selectedItems.forEach((item) => {
        const docRef = doc(db, `events/${eventId}/budget/${item.id}`)
        batch.delete(docRef);
      })
      await batch.commit();
      setIsLongPressed(false);
      setSelected([]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    navigation.addListener("beforeRemove", (e: any) => {
      if (!isLongPressed) {
        return;
      }
      e.preventDefault();
      setIsLongPressed(false);
      setSelected([]);
    })
  }, [isLongPressed, navigation])

  useEffect(() => {
    navigation.addListener("blur", () => {
      setIsLongPressed(false);
      setSelected([]);
    })
  }, [navigation, isLongPressed])

  useLayoutEffect(() => {
    if (!isLongPressed) {
      route.params.tabNavigatorNavigationProp.setOptions({
        headerStyle: {

        },
        headerRight: () => (<></>),
        headerTitle: () => (<Text className='text-xl'>Budget</Text>),
        headerLeft: undefined
      })
      return;
    }
    route.params.tabNavigatorNavigationProp.setOptions({
      headerRight: () => (
        <View className='flex flex-row w-1/3 justify-between items-center'>
          <TouchableOpacity onPress={handleEditPress}>
            <Feather name="edit-2" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <AntDesign name="delete" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
      headerRightContainerStyle: {
        marginRight: 10,
      },
      headerStyle: {
        backgroundColor: 'orange',
      },
      headerTitle: () => (<Text className='text-black text-lg'>{selectedItems && selectedItems.length} Selected</Text>),
      headerLeft: () => (
        <TouchableOpacity onPress={() => {
          setIsLongPressed(false);
          setSelected([]);
        }}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      )
    })
  }, [selectedItems, route.params.tabNavigatorNavigationProp, isLongPressed])

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

  const handleLongPress = async (firstSubtask: any) => {
    setIsLongPressed(true);

    setBackgroundStyles({
      backgroundColor: "orange",
      opacity: 0.5
    })

    setSelected((items) => {
      return [firstSubtask];
    })
  }

  return (
    <>
      {items.length > 0 ? (
        items.map((item) => (
          <TouchableOpacity key={item.id} style={{
            backgroundColor: selectedItems && selectedItems.includes(item) ? backgroundStyles.backgroundColor : "white",
            opacity: selectedItems && selectedItems.includes(item) ? backgroundStyles.opacity : 1,
          }} onLongPress={() => handleLongPress(item)} onPress={() => {
            if (isLongPressed) {
              if (selectedItems === null) {
                return setSelected((items) => {
                  return [item];
                })
              } else if (selectedItems.includes(item)) {
                return setSelected((items) => {
                  return items!.filter((item2) => item2 !== item);
                })
              } else {
                return setSelected((items) => {
                  return [...items!, item];
                })
              }
            }
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
                <Text className='text-gray-500 text-lg'>Paid {item.paid.toLocaleString("en-US", {
                  style: 'currency',
                  currency: loadEvent.data?.currency.value || 'INR',
                  currencyDisplay: 'narrowSymbol',
                  useGrouping: true
                }) as string}</Text>
                <Text className='text-gray-500 text-lg'>Amount: {item.amount.toLocaleString("en-US", {
                  style: 'currency',
                  currency: loadEvent.data?.currency.value || 'INR',
                  currencyDisplay: 'narrowSymbol',
                  useGrouping: true
                })}</Text>
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
        navigation.navigate('BudgetModal', {
          edit: false,
        });
      }} placement='right' color="orange" icon={<AntDesign name="plus" size={24} color="black" />} />
    </>
  )
}