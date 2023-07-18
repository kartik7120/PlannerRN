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
import { DocumentData, collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore"
import { db } from '../firebase';
import Tick from "../assets/tick.svg";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@clerk/clerk-expo';

const getEventId = async () => {
  const currentEventId = await AsyncStorage.getItem('currentEventId');
  if (currentEventId === null) {
    return null;
  }
  return currentEventId;
}

const loadCurrentEvent = async ({ queryKey }: any) => {
  const [_key, currentEventId] = queryKey

  if (currentEventId === null) {
    return;
  }
  const docRef = doc(db, "events", currentEventId);
  const data = await getDoc(docRef);
  if (data.exists() === false) {
    return null;
  }
  return data.data();
}

const getVendorDetailsFn = async ({ queryKey }: any) => {
  const [_key, currentEventId] = queryKey;
  if (currentEventId === null) {
    return [] as any[];
  }

  const colRef = collection(db, "events", currentEventId, "vendors");
  const objVal = {
    reserved: 0,
    pending: 0,
    rejected: 0
  }
  const snapshot = await getDocs(colRef);
  const data = snapshot.docs.map((doc) => {
    const data = doc.data();
    if (data.status === "Reserved") objVal.reserved++;
    else if (data.status === "Pending") objVal.pending++;
    else objVal.rejected++;
    return objVal;
  })
  const arr = [
    {
      name: "Reserved",
      count: objVal.reserved + 100,
      color: "#F44336",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Pending",
      count: objVal.pending + 100,
      color: "#FFC107",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Rejected",
      count: objVal.rejected + 100,
      color: "#9C27B0",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }
  ]
  return arr;
}

const getCheckListCount = async ({ queryKey }: any) => {
  const [_key, currentEventId] = queryKey;
  if (currentEventId === null) {
    return {
      count: 0,
      completed: 0,
      unfinishedItem: []
    };
  }

  const colRef = collection(db, "events", currentEventId, "checklist");
  const snapshot = await getDocs(colRef);

  const obj = {
    count: 0,
    completed: 0,
    unfinishedItem: [] as DocumentData[]
  }

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    obj.count++;
    if (data.completed === "Completed") {
      obj.completed++;
    }
    if (data.completed === "Pending") {
      obj.unfinishedItem.push({ ...data, id: doc.id });
    }
  })

  return obj;
}

const loadUserEvents = async ({ queryKey }: any) => {
  const [_key, userId] = queryKey;
  if (userId === null) {
    return [];
  }

  const colRef = collection(db, "events");
  const q = query(colRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => {
    return {
      eventId: doc.id,
      ...doc.data()
    } as any
  })

  return data;
}

export default function TabHomeScreen() {

  const [event, setEvent] = useState<any>();
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStack, 'StartNew'>>();

  const queryClient = useQueryClient();
  const currentEventId = queryClient.getQueryData(["currentEventId"], {
    exact: true
  })

  const user = useUser();

  const checkListCount = useQuery({
    queryKey: ["checklistCount", currentEventId],
    queryFn: getCheckListCount,
    enabled: !!currentEventId
  })

  if (checkListCount.status === "success") {
    console.log(checkListCount.data)
  }

  const eventId = useQuery({
    queryKey: ["currentEventId"],
    queryFn: getEventId,
  })

  const loadEvent = useQuery({
    queryKey: ["currentEvent", eventId.data],
    queryFn: loadCurrentEvent,
    enabled: !!eventId.data
  })


  const loadEvents = useQuery({
    queryKey: ["userEvents", user.user?.id],
    queryFn: loadUserEvents,
    enabled: !!user.user?.id
  })

  const vendorDetailsFn = useQuery({
    queryKey: ["vendorDetails", eventId.data],
    queryFn: getVendorDetailsFn,
    enabled: !!eventId.data,
  })

  return (
    <ScrollView>
      <View className='border overflow-hidden border-transparent rounded-lg m-2'>
        <Timer />
        {!visible && <View className='flex flex-row justify-between items-center w-full p-2 bg-white'>
          <View className=' flex flex-row gap-x-3'>
            <Image source={require("../assets/event_icon.jpg")}
              style={{ width: 50, height: 50, borderRadius: 50 / 2 }}
            />
            <View>
              <Text className='text-lg text-black'>{loadEvent.data && loadEvent.data.name || "Event name"}</Text>
              <View className='flex flex-row gap-x-2'>
                <Text className='text-gray-400'>{loadEvent.data && new Date(loadEvent.data.date.seconds * 1000).toDateString()}</Text>
                <Text className='text-gray-400'>Your event</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => setVisible(!visible)}>
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>}
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
          {loadEvents.data && loadEvents.data.map((event) => (
            <TouchableOpacity key={event.eventId} onPress={() => {
              AsyncStorage.setItem("currentEventId", event.eventId);
              queryClient.invalidateQueries(["currentEventId"]);
              setVisible(false);
            }}>
              <View className='flex flex-row justify-between items-center w-full p-2 bg-white' >
                <View className=' flex flex-row gap-x-3'>
                  <Image source={require("../assets/event_icon.jpg")}
                    style={{ width: 50, height: 50, borderRadius: 50 / 2 }}
                  />
                  <View>
                    <Text className='text-lg text-black'>{event.name}</Text>
                    <View className='flex flex-row gap-x-2'>
                      <Text className='text-gray-400'>{new Date(event.date.seconds * 1000).toDateString()}</Text>
                      <Text className='text-gray-400'>Your event</Text>
                    </View>
                  </View>
                </View>
                {queryClient.getQueryData(['currentEventId']) === event.eventId && <Tick width={32} height={32} />}
              </View>
            </TouchableOpacity>
          ))}
          <View className='flex flex-row justify-between items-center bg-white mt-2 gap-x-1'>
            <View className='basis-1/2'>
              <Button title="JOIN" type='outline' />
            </View>
            <View className='basis-1/2'>
              <Button type='solid' title="CREATE" onPress={() => {
                navigation.navigate("Events")
              }} />
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
              <TouchableOpacity className='flex flex-col justify-center items-center max-w-fit gap-y-2' onPress={() => {
                navigation.navigate("Home", {
                  screen: "Checklist"
                })
              }}>
                <Image source={require("../assets/task_list.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
                <Text>Checklist</Text>
              </TouchableOpacity>
              <TouchableOpacity className='flex flex-col justify-center items-center max-w-fit gap-y-2'>
                <Image source={require("../assets/guest.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
                <Text>Guest</Text>
              </TouchableOpacity>
              <TouchableOpacity className='flex flex-col justify-center items-center max-w-fit gap-y-2' onPress={() => {
                navigation.navigate("Home", {
                  screen: "Budget"
                })
              }}>
                <Image source={require("../assets/budget.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
                <Text>Budget</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                navigation.navigate("Vendors")
              }} className='flex flex-col justify-center items-center max-w-fit gap-y-2'>
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
            <Octicons name="checklist" size={20} color="black" />
            <Text className='text-sm'>CHECKLIST</Text>
          </View>
          <TouchableOpacity className='flex flex-row gap-x-1 items-center justify-center'
            onPress={() => navigation.navigate("CheckListSummaryModal")}>
            <Text className='text-black text-lg'>Summary</Text>
            <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>
        </View>
        <Divider width={0.8} style={{
          marginTop: 5,
        }} />
        <View className='flex flex-col justify-around gap-y-3 mt-1'>
          {checkListCount.data && checkListCount.data.unfinishedItem.map((item: any) => (
            <TouchableOpacity key={item.id} onPress={() => {
              navigation.navigate("CheckListDetail", {
                name: item.name,
                note: item.note,
                category: item.category,
                date: item.date,
                completed: item.completed,
                id: item.id,
              })
            }}>
              <View className='flex flex-row justify-between items-center'>
                <View className='flex flex-row items-center gap-x-4'>
                  <AntDesign name="info" size={24} color="black" />
                  <Text className='text-lg'>{item.name}</Text>
                </View>
                <Text>{new Date(item.date.seconds * 1000).toDateString()}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View className='flex flex-col justify-between items-center gap-y-3'>
            <Image source={require("../assets/analytics.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
            <Text className='text-center'>There are no uncompleted tasks</Text>
          </View>
          <LinearProgress value={checkListCount.data && checkListCount.data.completed} color='red' style={{
            height: 15,
          }} />
          <View className='flex flex-row justify-between items-center'>
            <Text>{checkListCount.data && ((checkListCount.data.completed / checkListCount.data?.count) * 100)}% completed</Text>
            <Text>{checkListCount.data?.completed} out of {checkListCount.data && checkListCount.data.count}</Text>
          </View>
        </View>
      </View>
      {/* Pie charts */}
      <View className='flex flex-row justify-between items-center m-1'>
        <View className='bg-white w-1/2 border border-transparent rounded-lg overflow-hidden p-2'>
          <View className='flex flex-row gap-x-3 items-center'>
            <Ionicons name="person-outline" size={24} color="black" />
            <Text>GUESTS</Text>
          </View>
          <Divider width={0.8} style={{
            marginTop: 5,
          }} />
          <PieChart data={vendorDetailsFn.status === "success" ? vendorDetailsFn.data : [
            {
              name: "Seoul",
              count: 21500000,
              color: "rgba(131, 167, 234, 1)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15
            },
            {
              name: "Toronto",
              count: 2800000,
              color: "#F00",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15
            },
            {
              name: "Beijing",
              count: 527612,
              color: "red",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15
            },
            {
              name: "New York",
              count: 8538000,
              color: "#ffffff",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15
            },
            {
              name: "Moscow",
              count: 11920000,
              color: "rgb(0, 0, 255)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15
            }]
          }
            accessor='count' backgroundColor={"transparent"} hasLegend={false}
            paddingLeft='0' absolute width={Dimensions.get("window").width} height={120}
            chartConfig={{
              backgroundGradientFrom: "#1E2923",
              backgroundGradientFromOpacity: 0,
              backgroundGradientTo: "#08130D",
              backgroundGradientToOpacity: 0.5,
              color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              strokeWidth: 2, // optional, default 3
              barPercentage: 0.5,
              useShadowColorFromDataset: false // optional
            }}
          />
          <View className='flex flex-col justify-center items-center'>
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
        <View className='bg-white w-1/2 border border-transparent rounded-lg overflow-hidden p-2'>
          <View className='flex flex-row gap-x-3 items-center'>
            <Ionicons name="person-outline" size={24} color="black" />
            <Text>GUESTS</Text>
          </View>
          <Divider width={0.8} style={{
            marginTop: 5,
          }} />
          <PieChart data={vendorDetailsFn.status === "success" ? vendorDetailsFn.data : [
            {
              name: "Seoul",
              count: 21500000,
              color: "rgba(131, 167, 234, 1)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15
            },
            {
              name: "Toronto",
              count: 2800000,
              color: "#F00",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15
            },
            {
              name: "Beijing",
              count: 527612,
              color: "red",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15
            },
            {
              name: "New York",
              count: 8538000,
              color: "#ffffff",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15
            },
            {
              name: "Moscow",
              count: 11920000,
              color: "rgb(0, 0, 255)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15
            }]
          }
            accessor='count' backgroundColor={"transparent"} hasLegend={false}
            paddingLeft='0' absolute width={Dimensions.get("window").width} height={120}
            chartConfig={{
              backgroundGradientFrom: "#1E2923",
              backgroundGradientFromOpacity: 0,
              backgroundGradientTo: "#08130D",
              backgroundGradientToOpacity: 0.5,
              color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              strokeWidth: 2, // optional, default 3
              barPercentage: 0.5,
              useShadowColorFromDataset: false // optional
            }}
          />
          <View className='flex flex-col items-center justify-center'>
            <View className='flex flex-row justify-start gap-x-3 items-center'>
              <View className='bg-rose-600 w-2 h-2 rounded-full'></View>
              <Text>{vendorDetailsFn.data && vendorDetailsFn.data[0].count}</Text>
              <Text>reserved</Text>
            </View>
            <View className='flex flex-row justify-start gap-x-3 items-center'>
              <View className='bg-yellow-600 w-2 h-2 rounded-full'></View>
              <Text>{vendorDetailsFn.data && vendorDetailsFn.data[1].count}</Text>
              <Text>pending</Text>
            </View>
            <View className='flex flex-row justify-start gap-x-3 items-center'>
              <View className='bg-purple-600 w-2 h-2 rounded-full'></View>
              <Text>{vendorDetailsFn.data && vendorDetailsFn.data[2].count}</Text>
              <Text>denied</Text>
            </View>
          </View>
        </View>
      </View>
      <View className='bg-white m-2 rounded overflow-hidden p-2'>
        <View className='flex flex-row justify-between'>
          <View className='flex flex-row gap-x-2 items-center'>
            <AntDesign name="creditcard" size={24} color="black" />
            <Text>Budget</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("BudgetSummaryModal")}>
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
              <Text>{loadEvent.data?.Budget}</Text>
            </View>
          </View>
          <View className='flex flex-row justify-between items-center'>
            <Text>Paid</Text>
            <View className='flex flex-row justify-between items-center gap-x-2'>
              <View className='w-2 h-2 rounded-full bg-rose-500'></View>
              <Text>$ {loadEvent.data?.paid}</Text>
            </View>
          </View>
          <View className='flex flex-row justify-between items-center'>
            <Text>Pending</Text>
            <View className='flex flex-row justify-between items-center gap-x-2'>
              <View className='w-2 h-2 rounded-full bg-yellow-500'></View>
              <Text>$ {loadEvent.data?.pending}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}