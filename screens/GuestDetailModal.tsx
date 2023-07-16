import { View, Text } from 'react-native'
import React from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStack } from '../App';
import { AntDesign } from '@expo/vector-icons';
import { Divider, FAB } from '@rneui/themed';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ScrollView } from 'react-native-gesture-handler';
import { SimpleLineIcons, EvilIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

type RProps = RouteProp<RootStack, "GuestDetailModal">;
type NProps = StackNavigationProp<RootStack, "GuestDetailModal">;

const getGuest = async ({ queryKey }: any) => {
    const [_key, { guestId, eventId }] = queryKey;
    const docRef = doc(db, `events/${eventId}/guests/${guestId}`);
    const guest = await getDoc(docRef);
    return guest.data();
}

export default function GuestDetailModal() {

    const route = useRoute<RProps>();
    const queryClient = useQueryClient();
    const eventId = queryClient.getQueryData(['currentEventId'], {
        exact: true
    });

    const guest = useQuery(['guest', { guestId: route.params.guestId, eventId }], getGuest, {
        enabled: !!route.params.guestId && !!eventId
    })

    const navigation = useNavigation<NProps>();

    return (
        <ScrollView>
            <View className='bg-white border border-transparent rounded-lg overflow-hidden p-2 m-2'>
                <View className='flex flex-row gap-x-4 items-center'>
                    <AntDesign name="infocirlceo" size={24} color="black" />
                    <Text>Details</Text>
                </View>
                <Divider style={{
                    marginVertical: 10
                }} />
                <View className='flex flex-row justify-between'>
                    <View className='flex flex-col gap-y-4 w-1/2'>
                        <Text>Name</Text>
                        <Text>Note</Text>
                        <Text>Age</Text>
                        <Text>Gender</Text>
                        <Text>Invitation</Text>
                        <Text>Status</Text>
                    </View>
                    <View className='flex flex-col gap-y-4 w-1/2'>
                        <Text>{guest.data?.firstname}</Text>
                        <Text>{guest.data?.notes}</Text>
                        <Text>{guest.data?.ageType}</Text>
                        <Text>{guest.data?.gender}</Text>
                        <Text>{guest.data?.invitationSent ? "Sent" : "Not Send"}</Text>
                        <Text>{guest.data?.invitationAccepted}</Text>
                    </View>
                </View>
                <FAB placement='right' icon={<EvilIcons name="pencil" size={24} color="black" />} onPress={() => {
                    navigation.navigate("GuestModal", {
                        edit: true,
                        guestId: route.params.guestId,
                        address: guest.data?.address,
                        age: guest.data?.ageType,
                        email: guest.data?.email,
                        firstname: guest.data?.firstname,
                        gender: guest.data?.gender,
                        invitationSent: guest.data?.invitationSent,
                        invitationAccepted: guest.data?.invitationAccepted,
                        lastname: guest.data?.lastname,
                        notes: guest.data?.notes,
                        phone: guest.data?.phone,
                    })
                }} />
            </View>
            <View className='bg-white border border-transparent rounded-lg overflow-hidden p-2 m-2'>
                <View className='flex flex-row gap-x-4 items-center'>
                    <SimpleLineIcons name="pencil" size={24} color="black" />
                    <Text>Contacts</Text>
                </View>
                <Divider style={{
                    marginVertical: 10
                }} />
                <View className='flex flex-row justify-between'>
                    <View className='flex flex-col gap-y-4 w-1/2'>
                        <Text>Phone</Text>
                        <Text>E-mail</Text>
                        <Text>Address</Text>
                    </View>
                    <View className='flex flex-col gap-y-4 w-1/2'>
                        <Text>{guest.data?.phone}</Text>
                        <Text>{guest.data?.email}</Text>
                        <Text>{guest.data?.address}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}