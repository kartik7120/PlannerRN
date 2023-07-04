import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp, } from '@react-navigation/stack';
import { RootStack } from '../App';
import { AntDesign } from '@expo/vector-icons';
import { Divider, FAB, Image, LinearProgress, ListItem } from '@rneui/themed';
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
    const [unsubscribeFunc, setUnsubscribeFunc] = useState<any>(null);
    const [payments, setPayments] = useState<any>([]);
    const [isLongPressed, setIsLongPressed] = React.useState(false);
    const [selectedItems, setSelectedItems] = React.useState<any[]>([]);
    const [backgroundStyles, setBackgroundStyles] = React.useState({
        backgroundColor: "orange",
        opacity: 0.5
    })


    useEffect(() => {
        async function getVendorDetail() {
            const eventId = await AsyncStorage.getItem('currentEventId');
            if (!eventId) return;
            if (!route.params.id) return;
            const docRef = doc(db, "events", eventId, "vendors", route.params.id);
            const unsubscribe = onSnapshot(docRef, (doc) => {
                setVendorDetails({ ...doc.data(), id: doc.id });
            })
            setUnsubscribeFunc(() => unsubscribe);
        }
        getVendorDetail();
        return () => {
            unsubscribeFunc && unsubscribeFunc();
        }
    }, [])

    useEffect(() => {
        async function getPayments() {
            const eventId = await AsyncStorage.getItem('currentEventId');
            if (!eventId) return;
            if (!route.params.id) return;
            const docRef = collection(db, "events", eventId, "vendors", route.params.id, "payments");
            const unsubscribe = onSnapshot(docRef, (doc) => {
                setPayments(doc.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            })
            return unsubscribe;
        }
        getPayments();
    }, [])

    const handleEditPress = () => {
        selectedItems.map((item) => {
            navigation.push("PaymentVendorForm", {
                id: vendorDetails.id,
                paymentId: item.id,
                name: item.name,
                amount: item.amount,
                paid: item.paid,
                edit: true
            });
        })
    }

    const handleDelete = async () => {
        const eventId = await AsyncStorage.getItem('currentEventId');
        if (!eventId) return;
        if (!route.params.id) return;
        if (selectedItems.length === 0) return;
        if (route.params.id === undefined) return;
        const docRef = doc(db, "events", eventId, "vendors", route.params.id);
        const paidAmount = selectedItems.reduce((acc, item) => { if (item.paid === true) return acc + Number(item.amount) }, 0);
        const pendingAmount = selectedItems.reduce((acc, item) => { if (item.paid === false) return acc + Number(item.amount) }, 0);
        const batch = writeBatch(db);
        selectedItems.map(async (item: any) => {
            const docRef2 = doc(db, "events", eventId, "vendors", route.params.id!, "payments", item.id);
            batch.delete(docRef2);
        })
        batch.commit();
        await updateDoc(docRef, {
            paidAmount: (vendorDetails.paid || 0) - paidAmount,
            pendingAmount: (vendorDetails.pending || 0) - pendingAmount
        })
        setIsLongPressed(false);
        setSelectedItems([]);
    }

    useLayoutEffect(() => {
        if (!isLongPressed) {
            navigation.setOptions({
                headerStyle: {

                },
                headerRight: () => (<></>),
                headerTitle: () => (<Text className='text-xl'>{route.params.name}</Text>),
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

    const setPaid = async (id: string, paid: boolean, amount: string) => {
        try {
            const eventId = await AsyncStorage.getItem('currentEventId');
            if (!eventId) return;
            if (!route.params.id) return;
            const docRef2 = doc(db, "events", eventId, "vendors", route.params.id);
            if (paid === false) {
                await updateDoc(docRef2, {
                    paidAmount: (vendorDetails.paidAmount || 0) + Number(amount),
                    pendingAmount: (vendorDetails.pendingAmount || 0) - Number(amount)
                })
            } else {
                await updateDoc(docRef2, {
                    pendingAmount: Math.abs((vendorDetails.paidAmount || 0) - Number(amount)),
                    paidAmount: (vendorDetails.pendingAmount || 0) + Number(amount)
                })
            }
            const docRef = doc(db, "events", eventId, "vendors", route.params.id, "payments", id);
            await updateDoc(docRef, {
                paid: !paid
            })

        } catch (error) {
            console.log(error);
        }
    }

    function handleItemLongPress(firstVendorItem: any) {
        setIsLongPressed(true);

        setSelectedItems((items) => {
            return [firstVendorItem];
        })

        setBackgroundStyles({
            backgroundColor: "orange",
            opacity: 0.5
        })
    }

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
                <View className='flex flex-row items-center justify-between w-full'>
                    <View className='flex flex-row items-center gap-x-4 mb-2'>
                        <Ionicons name="wallet-outline" size={24} color="black" />
                        <Text>PAYMENTS</Text>
                    </View>
                    <Text className='text-lg'>{payments.length}</Text>
                </View>
                <Divider width={1} />
                {payments.length === 0 ? <View className='flex flex-col items-center justify-center gap-y-2'>
                    <Image source={require("../assets/not_found.png")} style={{
                        width: 70,
                        height: 70,
                        alignSelf: 'center'
                    }} />
                    <Text className='text-center'>There are on payments</Text>
                    <Text className='text-gray-400'>Click + to add a new item</Text>
                </View> : (
                    <>
                        {payments.map((payment: any) => (
                            <ListItem bottomDivider key={payment.id} style={{
                                backgroundColor: selectedItems.includes(payment) ? backgroundStyles.backgroundColor : "transparent",
                                opacity: selectedItems.includes(payment) ? backgroundStyles.opacity : 1,
                            }}>
                                <ListItem.CheckBox checked={payment.paid} onPress={() => setPaid(payment.id, payment.paid, payment.amount)} />
                                <ListItem.Content>
                                    <TouchableOpacity onLongPress={() => handleItemLongPress(payment)} onPress={() => {
                                        if (isLongPressed) {
                                            if (selectedItems === null) {
                                                return setSelectedItems((items) => {
                                                    return [payment];
                                                })
                                            } else if (selectedItems.includes(payment)) {
                                                return setSelectedItems((todos) => {
                                                    return todos!.filter((todo) => todo !== payment);
                                                })
                                            } else {
                                                return setSelectedItems((items) => {
                                                    return [...items!, payment];
                                                })
                                            }
                                        }
                                        navigation.navigate("PaymentVendorForm", {
                                            id: vendorDetails.id,
                                            paymentId: payment.id,
                                            name: payment.name,
                                            amount: payment.amount,
                                            paid: payment.paid,
                                            edit: true
                                        });
                                    }}>
                                        <View className='flex flex-col items-start gap-y-1 justify-center'>
                                            <Text className='text-black'>{payment.name}</Text>
                                            <Text className='text-gray-500 text-sm'>{payment.amount}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </ListItem.Content>
                            </ListItem>
                        ))}
                    </>
                )}
                <FAB color="orange" placement='right' icon={<AntDesign name="plus" size={24} color="white" />} onPress={() => {
                    navigation.navigate("PaymentVendorForm", {
                        id: vendorDetails.id,
                    });
                }} />
            </View>
        </ScrollView>
    )
}