import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp, } from '@react-navigation/stack';
import { RootStack } from '../App';
import { AntDesign } from '@expo/vector-icons';
import { Divider, FAB, Image, LinearProgress } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';

type NavigationProps = StackNavigationProp<RootStack, 'VendorsDetailModal'>;
type RProps = RouteProp<RootStack, "VendorsDetailModal">;

export default function VendorDetails() {

    const [vendorDetails, setVendorDetails] = useState<any>(null);
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<RProps>();

    useEffect(() => {
        async function getVendorDetail() {
            const eventId = await AsyncStorage.getItem('currentEventId');
            if (!eventId) return;
            if (!route.params.id) return;
            const docRef = doc(db, "events", eventId, "vendors", route.params.id);
            const unsubscribe = onSnapshot(docRef, (doc) => {
                setVendorDetails(doc.data());
            })
            return unsubscribe;
        }
        getVendorDetail();
    }, [])

    return (
        <ScrollView>
            <View className='bg-white m-2 p-2 rounded-lg border border-transparent overflow-hidden'>
                <View className='flex flex-row items-center gap-x-4 mb-2'>
                    <AntDesign name="infocirlceo" size={24} color="black" />
                    <Text>DETAILS</Text>
                </View>
                <Divider width={1} />
                <View className='flex flex-row justify-between items-center mt-2'>
                    <View className='flex flex-col gap-y-4'>
                        <Text>Name</Text>
                        <Text>Note</Text>
                        <Text>Category</Text>
                        <Text>Status</Text>
                    </View>
                    <View className='flex flex-col gap-y-4'>
                        <Text>{vendorDetails && vendorDetails.name || "Name is not defined"}</Text>
                        <Text>{vendorDetails && vendorDetails.note || "Note is not defined"}</Text>
                        <Text>{vendorDetails && vendorDetails.category || "Category is not defined"}</Text>
                        <Text>{vendorDetails && vendorDetails.status || "Status is not defined"}</Text>
                    </View>
                </View>
                <FAB color="orange" placement='right' icon={<AntDesign name="edit" size={24} color="white" />} onPress={() => {
                    navigation.navigate("VendorsForm", {
                        id: route.params.id,
                        name: vendorDetails.name,
                        note: vendorDetails.note,
                        category: vendorDetails.category,
                        phone: vendorDetails.phone,
                        email: vendorDetails.email,
                        website: vendorDetails.website,
                        address: vendorDetails.address,
                        amount: vendorDetails.amount,
                        status: vendorDetails.status,
                        edit: true
                    })
                }} />
            </View>
            <View className='bg-white m-2 p-2 rounded-lg border border-transparent overflow-hidden'>
                <View className='flex flex-row items-center gap-x-4 mb-2'>
                    <FontAwesome name="paper-plane-o" size={24} color="black" />
                    <Text>CONTACTS</Text>
                </View>
                <Divider width={1} />
                <View className='flex flex-row justify-between items-center mt-2'>
                    <View className='flex flex-col gap-y-4'>
                        <Text>Phone</Text>
                        <Text>E-mail</Text>
                        <Text>Site</Text>
                        <Text>Address</Text>
                    </View>
                    <View className='flex flex-col gap-y-4'>
                        <View className='flex flex-row items-center gap-x-2'>
                            <Feather name="phone" size={20} color="black" />
                            <Text>{vendorDetails && vendorDetails.phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3") || "Phone is not defined"}</Text>
                        </View>
                        <View className='flex flex-row items-center gap-x-2'>
                            <MaterialCommunityIcons name="email-outline" size={20} color="black" />
                            <Text>{vendorDetails && vendorDetails.email || "Address is not defined"}</Text>
                        </View>
                        <Text>{vendorDetails && vendorDetails.site || "Site is not defined"}</Text>
                        <Text>{vendorDetails && vendorDetails.address || "Address was not defined"} </Text>
                    </View>
                </View>
            </View>

            <View className='bg-white m-2 p-2 rounded-lg border border-transparent overflow-hidden'>
                <View className='flex flex-row items-center gap-x-4 mb-2'>
                    <FontAwesome name="money" size={24} color="black" />
                    <Text>BALANCE</Text>
                </View>
                <Divider width={1} />
                <View className='flex flex-row justify-between items-center mt-2'>
                    <View className='flex flex-col gap-y-4'>
                        <Text>Amount</Text>
                        <Text>Paid</Text>
                        <Text>Pending</Text>
                    </View>
                    <View className='flex flex-col gap-y-4'>
                        <Text>{vendorDetails && vendorDetails.amount || "0"}</Text>
                        <Text>{vendorDetails && vendorDetails.paid || "0"}</Text>
                        <Text>{vendorDetails && vendorDetails.pending || "0"}</Text>
                    </View>
                </View>
                <LinearProgress value={vendorDetails && vendorDetails.paid / vendorDetails.amount || 0} />
            </View>

            <View className='bg-white m-2 p-2 rounded-lg border border-transparent overflow-hidden'>
                <View className='flex flex-row items-center gap-x-4 mb-2'>
                    <Ionicons name="wallet-outline" size={24} color="black" />
                    <Text>PAYMENTS</Text>
                </View>
                <Divider width={1} />
                <View className='flex flex-col items-center justify-center gap-y-2'>
                    <Image source={require("../assets/not_found.png")} style={{
                        width: 70,
                        height: 70,
                        alignSelf: 'center'
                    }} />
                    <Text className='text-center'>There are on payments</Text>
                    <Text className='text-gray-400'>Click + to add a new item</Text>
                </View>
                <FAB color="orange" placement='right' icon={<AntDesign name="plus" size={24} color="white" />} onPress={() => {
                    navigation.navigate("PaymentVendorForm");
                }} />
            </View>
        </ScrollView>
    )
}