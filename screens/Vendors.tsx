import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FAB, Image, ListItem } from '@rneui/themed'
import { AntDesign } from '@expo/vector-icons'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Dialog } from '@rneui/themed';
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStack } from '../App'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { collection, doc, onSnapshot, writeBatch } from 'firebase/firestore'
import { db } from '../firebase'
import { Ionicons } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'

type NavigationProp = StackNavigationProp<RootStack, 'VendorsForm'>;
type RProps = RouteProp<RootStack, "VendorsForm">;

export default function Vendors() {

    const [visible, setVisible] = useState(false);
    const navigation = useNavigation<NavigationProp>();
    const [vendors, setVendors] = useState<any[]>([]);
    const [backgroundStyles, setBackgroundStyles] = React.useState({
        backgroundColor: "orange",
        opacity: 0.5
    })
    const [isLongPressed, setIsLongPressed] = React.useState(false);
    const [selectedItems, setSelectedItems] = React.useState<any[]>([]);
    const route = useRoute<RProps>();

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

    useEffect(() => {
        navigation.addListener("beforeRemove", (e) => {
            console.log(`value of isLongPressed: ${isLongPressed}`)
            if (!isLongPressed) {
                return;
            }
            setIsLongPressed(false);
            setSelectedItems([]);
        })
    }, [isLongPressed, navigation])

    const handleEditPress = () => {
        selectedItems.map((item) => {
            navigation.push('VendorsForm', {
                id: item.id,
                name: item.name,
                note: item.note,
                category: item.category,
                phone: item.phone,
                email: item.email,
                website: item.website,
                address: item.address,
                amount: item.amount,
                status: item.status,
                edit: true
            })
        })
        setIsLongPressed(false);
        setSelectedItems([]);
    }

    const handleDelete = async () => {
        try {
            const eventId = await AsyncStorage.getItem('currentEventId');
            if (!eventId) return;
            const colRef = collection(db, 'events', eventId, 'vendors');
            const batch = writeBatch(db);
            selectedItems.map((item) => {
                batch.delete(doc(db, 'events', eventId, 'vendors', item.id))
            })
            await batch.commit();
            setIsLongPressed(false);
            setSelectedItems([]);
        } catch (error) {
            console.log(error);
        }
    }

    useLayoutEffect(() => {
        if (!isLongPressed) {
            navigation.setOptions({
                headerStyle: {

                },
                headerRight: () => (<></>),
                headerTitle: () => (<Text className='text-xl'>Vendors</Text>),
                headerLeft: undefined
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
                    setSelectedItems([]);
                }} />
            ),
            headerTitle: () => (<Text className='text-black text-lg'>{selectedItems && selectedItems.length} Selected</Text>),
            headerLeftContainerStyle: {
                marginLeft: 10,
            }
        })
    }, [selectedItems, navigation, isLongPressed])

    function handleItemLongPress(firstBudgetItem: any) {
        setIsLongPressed(true);

        setSelectedItems((items) => {
            return [firstBudgetItem];
        })

        setBackgroundStyles({
            backgroundColor: "orange",
            opacity: 0.5
        })
    }

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
                    <ListItem bottomDivider key={vendor.id} topDivider style={{
                        backgroundColor: selectedItems.includes(vendor) ? 'orange' : 'white',
                        opacity: selectedItems.includes(vendor) ? 0.5 : 1
                    }}>
                        <ListItem.Content>
                            <TouchableOpacity onLongPress={() => handleItemLongPress(vendor)} onPress={() => {
                                if (isLongPressed) {
                                    if (selectedItems === null) {
                                        return setSelectedItems((items) => {
                                            return [vendor];
                                        })
                                    } else if (selectedItems.includes(vendor)) {
                                        return setSelectedItems((todos) => {
                                            return todos!.filter((todo) => todo !== vendor);
                                        })
                                    } else {
                                        return setSelectedItems((items) => {
                                            return [...items!, vendor];
                                        })
                                    }
                                }
                                navigation.navigate("VendorsDetailModal", {
                                    id: vendor.id,
                                    name: vendor.name,
                                    note: vendor.note,
                                    category: vendor.category,
                                    phone: vendor.phone,
                                    email: vendor.email,
                                    website: vendor.website,
                                    address: vendor.address,
                                    amount: vendor.amount,
                                    status: vendor.status,
                                })
                            }} className='w-full'>
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