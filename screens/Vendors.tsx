import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FAB, Image, ListItem } from '@rneui/themed'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Dialog } from '@rneui/themed';
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStack } from '../App'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { Ionicons } from '@expo/vector-icons'

type NavigationProp = StackNavigationProp<RootStack, 'VendorsForm'>;

export default function Vendors() {

    const [visible, setVisible] = useState(false);
    const navigation = useNavigation<NavigationProp>();
    const [vendors, setVendors] = useState<any[]>([]);

    useEffect(() => {
        async function getVendors() {
            const eventId = await AsyncStorage.getItem('currentEventId');
            if (!eventId) return;
            const colRef = collection(db, 'events', eventId, 'vendors');
            const unsubscribe = onSnapshot(colRef, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setVendors(data);
            })
            return unsubscribe;
        }
        getVendors();
    }, [])

    return (
        <>
            <Dialog style={{
                padding: 20
            }} isVisible={visible} onBackdropPress={() => setVisible(() => false)}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("VendorsForm", {})
                    setVisible(() => false)
                }}>
                    <Text className='text-lg'>Add Manually</Text>
                </TouchableOpacity>
                <TouchableOpacity >
                    <Text className='text-lg'>Add Manually</Text>
                </TouchableOpacity>
            </Dialog>
            <View className='h-full'>
                {vendors.length > 0 ? vendors.map((vendor, index) => (
                    <ListItem bottomDivider key={vendor.id} topDivider>
                        <ListItem.Content>
                            <TouchableOpacity className='w-full'>
                                <View className='flex flex-row justify-between items-center bg-white'>
                                    <View className='flex flex-row items-center gap-x-4'>
                                        {vendor.status === "Reserved" && <Image source={require("../assets/tick.svg")} style={{
                                            width: 20,
                                            height: 20,
                                            resizeMode: 'contain',
                                        }} />
                                        }
                                        {vendor.status === "Pending" && <Ionicons name="ios-time-outline" size={24} color="black" />}
                                        {vendor.status === "Rejected" && <AntDesign name="closecircleo" size={24} color="black" />}
                                        <Text className='text-lg'>{vendor.name}</Text>
                                    </View>
                                    <Text>{vendor.amount}</Text>
                                </View>
                            </TouchableOpacity>
                        </ListItem.Content>
                    </ListItem>
                ))
                    : (<View className='flex flex-col items-center justify-center gap-y-4'>
                        <Text>No Vendors</Text>
                        <Image source={require("../assets/not_found.png")} style={{
                            width: 100,
                            height: 100,
                            resizeMode: 'contain',
                        }} />
                    </View>)
                }
                <FAB placement='right' color="red" icon={<AntDesign name="plus" size={24} color="black" />}
                    onPress={() => setVisible(() => true)} />
            </View>
        </>
    )
}