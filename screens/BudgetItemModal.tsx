import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect } from "react"
import { AntDesign } from '@expo/vector-icons';
import { Divider, FAB, Image, LinearProgress, ListItem } from '@rneui/themed';
import { SimpleLineIcons } from '@expo/vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EvilIcons } from '@expo/vector-icons';

type RouteTypes = RouteProp<RootStack, 'PaymentModal'>;

export default function BudgetItemModal() {

    const navigation = useNavigation<StackNavigationProp<RootStack, 'BudgetModal'>>();
    const route = useRoute<RouteTypes>();
    const [payments, setPayments] = React.useState([]) as any;
    const [checked, setChecked] = React.useState(false);
    const isFocused = useIsFocused();
    const [isLongPressed, setIsLongPressed] = React.useState(false);
    const [selected, setSelected] = React.useState<any[]>([]);
    const [total, setTotal] = React.useState(0);

    const selectedStyles = 'bg-orange-500'

    useLayoutEffect(() => {
        // if(route.params && route.params.title === undefined) {
        //     return;
        // }
        // navigation.setOptions({
        //     title: route.params.title || 'Budget Item',
        // });
    }, [])

    useEffect(() => {
        async function getPayments() {
            const eventId = await AsyncStorage.getItem('currentEventId');
            const colRef = collection(db, `events/${eventId}/budget/${route.params && route.params.id}/payments`);
            const unsubscribe = onSnapshot(colRef, (snapshot) => {
                setPayments(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data()
                })))
            })

            return unsubscribe;
        }
        getPayments();
    }, [])

    useEffect(() => {
        navigation.addListener("beforeRemove", (e) => {
            if (!isLongPressed) {
                return;
            }
            e.preventDefault();
            navigation.setOptions({
                headerStyle: {

                },
                headerRight: () => (<></>),
                headerTitle: () => (<Text className='text-xl'>{route.params.name}</Text>)
            })
            setIsLongPressed(false);
            setSelected([]);
        })
    }, [isLongPressed, navigation])

    async function setPaid() {
        try {
            const eventId = await AsyncStorage.getItem('currentEventId');
            const colRef = collection(db, `events/${eventId}/budget/${route.params && route.params.id}`);
            const unsubscribe = onSnapshot(colRef, (snapshot) => {
                setPayments(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data()
                })))
            })
            return unsubscribe;
        } catch (error) {
            console.log(error);
        }
    }

    function handleItemLongPress() {
        setIsLongPressed(true);
        navigation.setOptions({
            headerStyle: {
                backgroundColor: 'orange'
            },
            headerRight: () => (
                <View className='flex flex-row justify-between items-center gap-x-3'>
                    <TouchableOpacity onPress={() => {
                        console.log(selected);
                        selected.forEach((item) => {
                            navigation.push("PaymentModal", {
                                id: route.params && route.params.id,
                                paymentSubmit: false,
                                paymentId: item.id
                            })
                        })
                        // navigation.navigate("PaymentModal", {
                        //     id: route.params && route.params.id,
                        //     paymentSubmit: false,
                        //     paymentId: selected[0].id
                        // })
                    }}>
                        <EvilIcons name="pencil" size={40} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <AntDesign name="delete" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            ),
            headerRightContainerStyle: {
                marginRight: 4,
            },
            headerTitle: () => (
                <Text className='text-black text-lg'>{selected.length} Selected</Text>
            )
        })
    }

    function isItemSelected(item: any) {
        return selected.includes(item);
    }

    function setItemSelected(item: any) {
        setSelected([...selected, item]);
    }

    function deSelectItem(item: any) {
        setSelected(selected.filter((selectedItem) => selectedItem !== item));
    }

    return (
        <View className='m-2'>
            <View className='bg-white flex flex-col gap-y-2 p-2 m-2 rounded-lg overflow-hidden'>
                <View className='flex flex-row gap-x-3 items-center'>
                    <AntDesign name="infocirlceo" size={24} color="black" />
                    <Text className='text-lg'>DETAILS</Text>
                </View>
                <Divider width={2} />
                <View className='w-full gap-y-0.5'>
                    <View className='flex flex-row justify-between items-center'>
                        <Text className='text-black text-lg'>Name</Text>
                        <Text className='text-black text-lg'>{route.params && route.params.name}</Text>
                    </View>
                    <View className='flex flex-row justify-between items-center'>
                        <Text className='text-black text-lg'>Note</Text>
                        <Text className='text-black text-lg'>{route.params && route.params.note}</Text>
                    </View>
                    <View className='flex flex-row justify-between items-center'>
                        <Text className='text-black text-lg'>Category</Text>
                        <Text className='text-black text-lg'>{route.params && route.params.category}</Text>
                    </View>
                </View>
            </View>
            <View className='bg-white flex flex-col gap-y-3 p-2 m-2 rounded-lg overflow-hidden'>
                <View className='flex flex-row gap-x-3 items-center'>
                    <SimpleLineIcons name="calculator" size={24} color="black" />
                    <Text className='text-lg'>BALANCE</Text>
                </View>
                <Divider width={2} />
                <View className='w-full gap-y-0.5'>
                    <View className='flex flex-row justify-between items-center'>
                        <Text className='text-black text-lg'>Amount</Text>
                        <Text className='text-black text-lg'>{route.params && route.params.amount}</Text>
                    </View>
                    <View className='flex flex-row justify-between items-center'>
                        <Text className='text-black text-lg'>Paid</Text>
                        <Text className='text-black text-lg'>{route.params && route.params.paid}</Text>
                    </View>
                    <View className='flex flex-row justify-between items-center'>
                        <Text className='text-black text-lg'>Pending</Text>
                        <Text className='text-black text-lg'>{route.params && route.params.pending}</Text>
                    </View>
                    <View>
                        <LinearProgress  value={Number((Number(route.params.paid) / Number(route.params.amount)).toFixed(2))} />
                    </View>
                </View>
            </View>
            <View className='bg-white flex flex-col gap-y-3 p-2 m-2 h-fit rounded-lg overflow-hidden'>
                <View className='flex flex-row gap-x-3 items-center'>
                    <AntDesign name="wallet" size={24} color="black" />
                    <Text>PAYMENTS</Text>
                </View>
                <Divider width={2} />
                <View className='relative'>
                    {/* Payments */}
                    {payments.length <= 0 ? (
                        <>
                            <Image source={{
                                uri: "../assets/analytics.png"
                            }} style={{
                                width: 100,
                                height: 100,
                                resizeMode: 'contain',
                            }} />
                            <Text className='text-lg text-center'>There are no payments</Text>
                            <Text className='text-gray-500 text-center'>Click + to add a new item</Text>
                        </>
                    ) : (
                        <>
                            <FlatList data={payments}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={{
                                        backgroundColor: isItemSelected(item) ? 'orange' : 'white'
                                    }} onLongPress={handleItemLongPress} onPress={() => {
                                        if (isLongPressed) {
                                            if (isItemSelected(item)) {
                                                deSelectItem(item);
                                            } else {
                                                setItemSelected(item);
                                            }
                                            console.log(selected)
                                            return;
                                        }
                                        navigation.navigate("PaymentModal", {
                                            id: route.params && route.params.id,
                                            paymentSubmit: false,
                                            paymentId: item.id
                                        })
                                    }}>
                                        <ListItem>
                                            <ListItem.CheckBox checked={checked} onPress={() => {
                                                setChecked(!checked);
                                            }} />
                                            <ListItem.Content>
                                                <View className='flex flex-col justify-between items-start'>
                                                    <Text className='text-black text-lg'>{item.data.name}</Text>
                                                    <Text className='text-gray-500 text-lg'>{item.data.paid}: {item.data.amount}</Text>
                                                </View>
                                            </ListItem.Content>
                                        </ListItem>
                                    </TouchableOpacity>
                                )} />
                        </>
                    )}
                    <FAB visible={true} onPress={() => {
                        navigation.navigate("PaymentModal", {
                            id: route.params && route.params.id,
                            paymentSubmit: true,
                            paymentId: ""
                        })
                    }} icon={
                        <AntDesign name="plus" size={24} color="white" />
                    } style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                    }} />
                </View>
            </View>
        </View>
    )
}