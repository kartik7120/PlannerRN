import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { db } from '../firebase'
import { useUser } from '@clerk/clerk-expo'
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { Button, Dialog, Image, Input } from '@rneui/themed';
import NewEvent from '../components/NewEvent';
import { FAB } from '@rneui/base';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from '@react-navigation/native';
import Tick from "../assets/tick.svg";
import { useQueryClient } from '@tanstack/react-query';

interface Form {
  name: string;
  Budget: string;
  date: string;
  time: string;
}

interface JoinForm {
  name: string;
  eventCode: string;
}

export default function Events({ route }: any) {

  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [name, setName] = useState("");
  const [Budget, setBudget] = useState("");
  const { control, handleSubmit, setValue, register, setError, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      Budget: "",
      date: "",
      time: "",
    }
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [joinEvent, setJoinEvent] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStack, 'StartNew'>>();
  const { user, isSignedIn } = useUser();
  const [currentEventId, setCurrentEventId] = useState("");
  const queryClient = useQueryClient();

  const { control: JoinFormControl, formState: { errors: JoinFormErrors }, handleSubmit: JoinFormHandleSubmit } = useForm<JoinForm>({
    defaultValues: {
      name: "",
      eventCode: "",
    }
  })

  useEffect(() => {
    if (isSignedIn === false) {
      return;
    }
    const colRef = collection(db, "events");
    const q = query(colRef, where("userId", "array-contains", user?.id))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }))
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New event: ", change.doc.data());
        }
        if (change.type === "modified") {
          console.log("Modified event: ", change.doc.data());
        }
        if (change.type === "removed") {
          console.log("Removed event: ", change.doc.data());
        }
      })
    })
    return unsubscribe;
  }, [isSignedIn, user?.id])

  useLayoutEffect(() => {
    const getEventId = async () => {
      try {
        const eventId = await AsyncStorage.getItem("currentEventId");
        if (eventId !== null) {
          setCurrentEventId(eventId);
        }
      } catch (error) {
        console.log('error occured while getting current event id');
        console.log(error);
      }
    }
    getEventId();
  }, [])


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    setValue("date", date);
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  }

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  }

  const handleTimeConfirm = (time: any) => {
    setValue("time", time)
    console.warn("A time has been picked: ", time);
    hideTimePicker();
  }

  const toggle = () => {
    setVisible(!visible);
  }

  const submit = async (data: Form) => {
    if (isSignedIn) {
      console.log('making a new event');
      try {
        const colRef = collection(db, "events");
        await addDoc(colRef, {
          name: data.name,
          Budget: data.Budget,
          date: data.date,
          time: data.time,
          userId: arrayUnion(user?.id),
          currency: "INR",
          paid: 0,
          pending: 0
        }).then(async (data) => {
          try {
            await AsyncStorage.setItem("currentEventId", data.id);
            queryClient.invalidateQueries({
              queryKey: ["currentEventId"],
              exact: true
            })
          } catch (error) {
            console.log('error occured while saving current event id');
            console.log(error);
          }
        })
      } catch (error) {
        console.log('error occured while creating event', error);
      }
      navigation.navigate("Home", {})
    }
  }

  const handleJoin = async (data: any) => {
    // try {
    //   if (!isSignedIn) {
    //     return;
    //   }
    //   const q = query(collection(db, "users"), where("userId", "==", user?.id));
    //   // check if the event exists in the database with the given event id
    //   const eventRef = doc(db, "events", data.eventCode);
    //   const eventSnap = await getDoc(eventRef);
    //   if (!eventSnap.exists()) {
    //     console.log('event does not exist');
    //     return;
    //   }

    //   const getUserDoc = await getDocs(q);
    //   if (getUserDoc.docs.length === 0) {
    //     console.log('user does not exist');
    //     return;
    //   }

    //   const userDoc = getUserDoc.docs[0];
    //   // add a events subcollection to the userDOc
    //   const userRef = doc(db, "users", userDoc.id, "events", data.eventCode);
    //   await updateDoc(userRef, {
    //     name: data.name,
    //     eventCode: data.eventCode,
    //     userId: user?.id
    //   })

    // } catch (error) {
    //   console.log('error occured while joining event');
    //   console.log(error);
    // }
  }

  const handleChangeEvent = async (eventId: string) => {
    try {
      await AsyncStorage.setItem("currentEventId", eventId);
      queryClient.invalidateQueries({
        queryKey: ["currentEventId"],
        exact: true
      })
      setCurrentEventId(eventId);
    } catch (error) {
      console.log('error occured while saving current event id');
      console.log(error);
    }
  }

  return (
    <>
      <Dialog isVisible={dialogVisible} onBackdropPress={() => {
        setDialogVisible(false);
      }}>
        <TouchableOpacity onPress={() => {
          setDialogVisible(false);
          setVisible(true);
        }} className='flex flex-col gap-y-4'>
          <Text className='text-lg text-black'>Create a new event</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setDialogVisible(false);
          setJoinEvent(true);
        }}>
          <Text className='text-lg text-black'>Join an existing event</Text>
        </TouchableOpacity>
      </Dialog>
      <Dialog isVisible={joinEvent} onBackdropPress={() => {
        setJoinEvent(false);
      }}>
        <View className='flex flex-col gap-y-2'>
          <Text className='text-black text-xl text-center'>Join an existing event</Text>
          <Text className='text-sm text-black text-center'>Enter event code of scan QR code. You can get this code from event owner</Text>
          <Controller control={JoinFormControl} render={({ field: { onChange, onBlur, value } }) => (
            <Input placeholder='Your name' value={value} onChangeText={onChange} onBlur={onBlur} />
          )} name="name" rules={{ required: true }} />
          <Controller control={JoinFormControl} render={({ field: { onChange, onBlur, value } }) => (
            <Input placeholder='Event Code' value={value} onChangeText={onChange} onBlur={onBlur} />
          )} name="eventCode" rules={{ required: true }} />
          <Button title="Join" onPress={JoinFormHandleSubmit(handleJoin)} />
        </View>
      </Dialog>
      <View className='h-full'>
        {events.map((event) => {
          return (
            <TouchableOpacity key={event.id} onPress={() => handleChangeEvent(event.id)}>
              <View className='flex flex-row justify-between items-center border rounded-lg border-transparent overflow-hidden p-2 m-2 bg-white'>
                <View className=' flex flex-row gap-x-3'>
                  <Image source={require("../assets/event_icon.jpg")}
                    style={{ width: 50, height: 50, borderRadius: 50 / 2 }}
                  />
                  <View>
                    <Text className='text-lg text-black'>{event.name}</Text>
                    <View className='flex flex-row justify-between items-center'>
                      <Text className='text-sm text-gray-500'>Your Event</Text>
                      <Text className='text-sm text-gray-500 ml-auto'>{new Date(event.date.seconds * 1000).toDateString()}</Text>
                    </View>
                  </View>
                </View>
                <View>
                  {currentEventId === event.id ? <Tick color="orange" width={30} height={30} /> : ""}
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
        <FAB onPress={() => setDialogVisible(true)} placement='right' color='orange'
          icon={<AntDesign name="plus" size={24} color="black" />} />
        <Dialog isVisible={visible} onBackdropPress={toggle}>
          <View className='flex flex-col justify-evenly items-center'>
            <Image source={require("../assets/calender.jpg")} style={{
              width: 150,
              height: 150,
              resizeMode: "contain",
            }} />
            <Text className='text-black text-3xl text-center'>Create a new event</Text>
            <Text className='text-black text-lg text-center'>Set up an event and start planning it</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input onBlur={onBlur} value={value} placeholder='Name' onChangeText={onChange} />
              )}
              name="name"
              rules={{ required: true }}
            />
            <View className='flex flex-row justify-between'>
              <Button title="Select Date" onPress={showDatePicker} buttonStyle={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }} type="outline" iconPosition='right' icon={<AntDesign name="calendar" size={24} color="black" />} />
              <Button title="Select Time" onPress={showTimePicker} buttonStyle={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 5,
              }} type="outline" iconPosition='right' icon={<AntDesign name="clockcircleo" size={24} color="black" />} />
            </View>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input onBlur={onBlur} value={value} placeholder='Budget' keyboardType='numeric' defaultValue='0'
                  onChangeText={onChange} />
              )}
              name="Budget"
              rules={{ required: true, pattern: /^[0-9]*$/ }}
            />
          </View>
          <Button title="Create" onPress={handleSubmit(submit)} />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                onChange={onChange}
              />
            )}
            name="date"
            rules={{ required: true }}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={hideTimePicker}
                onChange={onChange}
              />
            )}
            name="time"
            rules={{ required: true }}
          />
          {errors.date && <Text className='text-red-600 font-semibold text-lg'>Date is required.</Text>}
          {errors.time && <Text className='text-red-600 font-semibold text-lg'>Time is required.</Text>}
          {errors.name && <Text className='text-red-600 font-semibold text-lg'>Name is required.</Text>}
          {errors.Budget && <Text className='text-red-600 font-semibold text-lg'>Budget is required.</Text>}
        </Dialog>
      </View>
    </>
  )
}