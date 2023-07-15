import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Avatar, Dialog, FAB, Image } from '@rneui/themed'
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const getAllGuests = async ({ queryKey }: any) => {

    const [, { eventId }] = queryKey;
    const colRef = collection(db, "events", eventId, "guests");
    const guests = await getDocs(colRef);
    return guests.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data()
        }
    }) as any[];
}

export default function GuestScreen() {

    const [visible, setvisible] = useState(false);
    const navigation = useNavigation<StackNavigationProp<RootStack, 'StartNew'>>();
    const queryClient = useQueryClient();
    const eventId = queryClient.getQueryData(['currentEventId'], {
        exact: true
    })

    const guests = useQuery(['guests', { eventId }], getAllGuests, {
        enabled: !!eventId
    })

    if (guests.status === "success") {
        console.log(guests.data);
    }

    return (
        <ScrollView>
            <Dialog isVisible={visible} onBackdropPress={() => {
                setvisible(false);
            }}>
                <TouchableOpacity onPress={() => {
                    setvisible(false);
                    navigation.navigate('GuestModal', {});
                }}>
                    <Text className='text-lg'>Add manually</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setvisible(false);
                    navigation.navigate('GuestContactModal');
                }}>
                    <Text className='text-lg'>Add from contacts</Text>
                </TouchableOpacity>
            </Dialog>
            {guests.data && guests.data.map((guest) => (
                <TouchableOpacity key={guest.id} className='bg-white border border-transparent rounded-lg overflow-hidden mt-2'>
                    <View className='flex flex-row justify-between items-center p-2'>
                        <View className='flex flex-row gap-x-5'>
                            <Avatar size="large" />
                            <View className='flex flex-col gap-y-2'>
                                <Text className='text-lg'>{guest.firstname}</Text>
                                <View className='flex flex-row items-center gap-x-4'>
                                    <Text className='text-gray-500'>{guest.ageType}</Text>
                                    <Text className='text-gray-500'>{guest.gender}</Text>
                                </View>
                            </View>
                        </View>
                        {guest.invitationAccepted === "Declined" && <Text className='text-red-500 justify-self-end self-center'>Declined</Text>}
                        {guest.invitationAccepted === "Accepted" && <Text className='text-green-500'>Accepted</Text>}
                        {guest.invitationAccepted === "Pending" && <Text className='text-yellow-500'>Pending</Text>}
                    </View>
                </TouchableOpacity>
            ))}
            {guests.data && guests.data?.length <= 0 && <View className='flex flex-col justify-center items-center h-full'>
                <Image source={require("../assets/not_found.png")} alt="Not Found" style={{
                    width: 100,
                    height: 100,
                    resizeMode: "contain"
                }} />
                <Text className='text-black text-xl'>There are no guests</Text>
                <Text className='text-gray-600'>Click + to add a new guest</Text>
                <FAB color="orange" onPress={() => {
                    setvisible(true);
                }} icon={
                    <AntDesign name="plus" size={24} color="black" />
                } placement='right' />
            </View>}
            <StatusBar style="dark" />
        </ScrollView>
    )
}