import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Avatar, Dialog, FAB, Image } from '@rneui/themed'
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Feather, Octicons } from '@expo/vector-icons'

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

    const [isLongPressed, setIsLongPressed] = React.useState(false);
    const [selectedItems, setSelectedItems] = useState<any[] | null>(null);
    const [backgroundStyles, setBackgroundStyles] = React.useState({
        backgroundColor: "orange",
        opacity: 0.5
    });

    const eventId = queryClient.getQueryData(['currentEventId'], {
        exact: true
    })

    const guests = useQuery(['guests', { eventId }], getAllGuests, {
        enabled: !!eventId
    })

    useLayoutEffect(() => {
        if (!isLongPressed) {
            navigation.setOptions({
                headerStyle: {

                },
                headerRight: () => (<></>),
                headerLeft: () => (<Octicons name="checklist" size={24} color="black" />),
                headerTitle: () => (<Text className='text-black text-lg'>Checklist</Text>),
            })
            return;
        }
        navigation.setOptions({
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
            headerLeft: () => (
                <AntDesign name="close" size={24} color="black" onPress={() => {
                    setIsLongPressed(false);
                    setSelectedItems(null);
                }} />
            ),
            headerTitle: () => (<Text className='text-black text-lg'>{selectedItems && selectedItems.length} Selected</Text>)
        })
    }, [selectedItems, navigation, isLongPressed])

    const handleEditPress = () => {
        if (selectedItems === null) return;
        selectedItems.map((guest) => {
            console.log(guest)
            navigation.push("GuestModal", {
                edit: true,
                guestId: guest.id,
                firstname: guest.firstname,
                lastname: guest.lastname,
                age: guest.ageType,
                address: guest.address,
                email: guest.email,
                gender: guest.gender,
                invitation: guest.invitation,
                invitationAccepted: guest.invitationAccepted,
                invitationSent: guest.invitationSent,
                notes: guest.notes,
                phone: guest.phone,
            })
        })
        setIsLongPressed(false);
        setSelectedItems(null);
    }

    const handleDelete = async () => {
        const batch = writeBatch(db);
        if (!selectedItems) return;
        selectedItems.map((guest) => {
            if (!eventId) return;
            const docRef = doc(db, "events", eventId as any, "guests", guest.id);
            batch.delete(docRef);
        })

        await batch.commit();
        setIsLongPressed(false);
        setSelectedItems(null);
    }

    const handleLongPress = (firstSubtask: any) => {
        setIsLongPressed(true);

        setBackgroundStyles({
            backgroundColor: "orange",
            opacity: 0.5
        })

        setSelectedItems((items) => {
            return [firstSubtask];
        })
    }

    return (
        <>
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
                    <TouchableOpacity style={{
                        backgroundColor: selectedItems && selectedItems.includes(guest) ? backgroundStyles.backgroundColor : 'white',
                        opacity: selectedItems && selectedItems.includes(guest) ? backgroundStyles.opacity : 1,
                    }} key={guest.id} onLongPress={() => handleLongPress(guest)} onPress={() => {
                        if (isLongPressed) {
                            if (selectedItems === null) {
                                return setSelectedItems((items) => {
                                    return [guest];
                                })
                            } else if (selectedItems.includes(guest)) {
                                return setSelectedItems((todos) => {
                                    return todos!.filter((todo) => todo !== guest);
                                })
                            } else {
                                return setSelectedItems((items) => {
                                    return [...items!, guest];
                                })
                            }
                        }
                        navigation.navigate("GuestDetailModal", {
                            guestId: guest.id
                        })
                    }} className='bg-white border border-transparent rounded-lg overflow-hidden mt-2'>
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
                            {guest.invitationAccepted === "Declined"
                                && <Text className='text-red-500 justify-self-end self-center'>Declined</Text>}
                            {guest.invitationAccepted === "Accepted"
                                && <Text className='text-green-500'>Accepted</Text>}
                            {guest.invitationAccepted === "Pending"
                                && <Text className='text-yellow-500'>Pending</Text>}
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
                </View>}
            </ScrollView>
            <FAB color="orange" onPress={() => {
                setvisible(true);
            }} icon={
                <AntDesign name="plus" size={24} color="black" />
            } placement='right' />
            <StatusBar style="dark" />
        </>
    )
}