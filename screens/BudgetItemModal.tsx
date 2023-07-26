import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect } from "react"
import { AntDesign } from '@expo/vector-icons';
import { Divider, FAB, Image, LinearProgress, ListItem } from '@rneui/themed';
import { SimpleLineIcons } from '@expo/vector-icons';
import { collection, doc, getDoc, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EvilIcons, Feather, Octicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type RouteTypes = RouteProp<RootStack, 'PaymentModal'>;

const loadEventFn = async ({ queryKey }: any) => {
    const [_key, eventId] = queryKey;
    const docRef = doc(db, `events/${eventId}`);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return {};
    }
    return docSnap.data();
}

export default function BudgetItemModal() {

    const navigation = useNavigation<StackNavigationProp<RootStack, 'BudgetModal'>>();
    const route = useRoute<RouteTypes>();
    const [payments, setPayments] = React.useState([]) as any;
    const [checked, setChecked] = React.useState(false);
    const isFocused = useIsFocused();
    const [backgroundStyles, setBackgroundStyles] = React.useState({
        backgroundColor: "orange",
        opacity: 0.5
    })
    const [isLongPressed, setIsLongPressed] = React.useState(false);
    const [selectedItems, setSelectedItems] = React.useState<any[]>([]);
    const [total, setTotal] = React.useState(0);
    const [balanceDetail, setBalanceDetail] = React.useState({
        paid: 0,
        pending: 0,
        amount: 0
    });

    const queryClient = useQueryClient();

    const eventId = queryClient.getQueryData(['currentEventId'], {
        exact: true
    })

    const loadEvent = useQuery(['currentEvent', eventId], loadEventFn, {
        enabled: !!eventId,
    })

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
        async function getBalanceInfo() {
            try {
                const eventId = await AsyncStorage.getItem('currentEventId');
                if (!eventId) throw new Error('No event id found');
                const docRef = doc(db, 'events', eventId, "budget", route.params.id);
                const unsubscribe = onSnapshot(docRef, (doc) => {
                    const data = doc.data();
                    if (!data) return;
                    setBalanceDetail({
                        paid: data.paid,
                        pending: data.pending,
                        amount: data.amount
                    })
                })
            } catch (error) {
                console.log(error);
            }
        }
        getBalanceInfo();
    }, [])

    useEffect(() => {
        navigation.addListener("beforeRemove", (e) => {
            if (!isLongPressed) {
                return;
            }
            setIsLongPressed(false);
            setSelectedItems([]);
        })
    }, [isLongPressed, navigation])

    async function setPaid(paidItem: any) {
        try {
            console.log(`inside the setPaid`)
            const eventId = await AsyncStorage.getItem('currentEventId');
            if (!eventId) throw new Error('No event id found');
            const docRef = doc(db, 'events', eventId, "budget", route.params.id, "payments", paidItem.id);
            await updateDoc(docRef, {
                paid: paidItem.paid === "Paid" ? "Pending" : "Paid"
            })
            const docRef2 = doc(db, 'events', eventId, "budget", route.params.id);

            if (paidItem.paid === "Paid") {
                await updateDoc(docRef2, {
                    paid: Number(balanceDetail.paid) - Number(paidItem.amount),
                    pending: Number(balanceDetail.pending) + Number(paidItem.amount)
                })
            } else if (paidItem.paid === "Pending") {
                await updateDoc(docRef2, {
                    paid: Number(balanceDetail.paid) + Number(paidItem.amount),
                    pending: Number(balanceDetail.pending) - Number(paidItem.amount)
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleEditPress() {
        if (!selectedItems) return;
        selectedItems.forEach(item => {
            navigation.push("PaymentModal", {
                id: route.params && route.params.id,
                paymentSubmit: false,
                paymentId: item.id
            })
        })
        setIsLongPressed(false);
        setSelectedItems([]);
    }
    // Needs some thinking for deletion logic

    async function handleDelete() {
        if (!selectedItems) return;
        try {
            const eventId = await AsyncStorage.getItem('currentEventId');
            if (!eventId) throw new Error('No event id found');
            const totalBudgetDeleted = selectedItems.reduce((acc, item) => {
                return acc + Number(item.data.amount);
            }, 0)

            const paidItems = selectedItems.filter((item) => item.data.paid === true);
            const pendingItems = selectedItems.filter((item) => item.data.paid === false);

            const batch = writeBatch(db);
            selectedItems.forEach(item => {
                const docRef = doc(db, 'events', eventId, "budget", route.params.id, "payments", item.id);
                batch.delete(docRef);
            })
            setIsLongPressed(false);
            const docRef = doc(db, 'events', eventId, "budget", route.params.id);
            await updateDoc(docRef, {
                paid: Number(balanceDetail.paid) - paidItems.reduce((acc, item) => {
                    return acc + Number(item.data.amount);
                }, 0),
                pending: Number(balanceDetail.pending) - pendingItems.reduce((acc, item) => {
                    return acc + Number(item.data.amount);
                }, 0)
            })
            await batch.commit();
            setSelectedItems([]);
        } catch (error) {
            console.log(error);
        }
    }

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

    function isItemSelected(item: any) {
        return selectedItems.includes(item);
    }

    function setItemSelected(item: any) {
        setSelectedItems((items) => [...items, item]);
    }

    function deSelectItem(selectedItem: any) {
        setSelectedItems((items) => items.filter((item) => item !== selectedItem));
    }

    return (
        <ScrollView className='m-2'>
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
                <View className='flex flex-row items-center justify-between'>
                    <View className='flex flex-row gap-x-3 items-center'>
                        <SimpleLineIcons name="calculator" size={24} color="black" />
                        <Text className='text-lg'>BALANCE</Text>
                    </View>
                    {balanceDetail.amount - (balanceDetail.paid + balanceDetail.pending) > 0 ?
                        <Text className='text-green-500 font-medium'>+ {(balanceDetail.amount - (balanceDetail.paid + balanceDetail.pending)).toLocaleString("en-US", {
                            style: 'currency',
                            currency: loadEvent.data?.currency.value || 'INR',
                            currencyDisplay: 'narrowSymbol',
                            useGrouping: true

                        })}
                        </Text> : (
                            <Text className='text-red-500 font-medium'>- {(balanceDetail.amount - (balanceDetail.paid + balanceDetail.pending)).toLocaleString("en-US", {
                                style: 'currency',
                                currency: loadEvent.data?.currency.value || 'INR',
                                currencyDisplay: 'narrowSymbol',
                                useGrouping: true
                            })}</Text>
                        )}
                </View>
                <Divider width={2} />
                <View className='w-full gap-y-0.5'>
                    <View className='flex flex-row justify-between items-center'>
                        <Text className='text-black text-lg'>Amount</Text>
                        <Text className='text-black text-lg'>{(balanceDetail.amount).toLocaleString("en-US", {
                            style: 'currency',
                            currency: loadEvent.data?.currency.value || 'INR',
                            currencyDisplay: 'narrowSymbol',
                            useGrouping: true
                        })}</Text>
                    </View>
                    <View className='flex flex-row justify-between items-center'>
                        <Text className='text-black text-lg'>Paid</Text>
                        <Text className='text-black text-lg'>{(balanceDetail.paid).toLocaleString("en-US", {
                            style: 'currency',
                            currency: loadEvent.data?.currency.value || 'INR',
                            currencyDisplay: 'narrowSymbol',
                            useGrouping: true
                        })}</Text>
                    </View>
                    <View className='flex flex-row justify-between items-center'>
                        <Text className='text-black text-lg'>Pending</Text>
                        <Text className='text-black text-lg'>{(balanceDetail.pending).toLocaleString("en-US", {
                            style: 'currency',
                            currency: loadEvent.data?.currency.value || 'INR',
                            currencyDisplay: 'narrowSymbol',
                            useGrouping: true
                        })}</Text>
                    </View>
                    <View>
                        <LinearProgress value={Number((Number(balanceDetail.paid) / Number(balanceDetail.amount)).toFixed(2))} />
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
                        <FlatList scrollEnabled data={payments}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={{
                                    backgroundColor: isItemSelected(item) ? backgroundStyles.backgroundColor : 'white',
                                    opacity: isItemSelected(item) ? backgroundStyles.opacity : 1,
                                }} onLongPress={() => handleItemLongPress(item)} onPress={() => {
                                    if (isLongPressed) {
                                        if (selectedItems === null) {
                                            return setSelectedItems((items) => {
                                                return [item];
                                            })
                                        } else if (selectedItems.includes(item)) {
                                            return setSelectedItems((todos) => {
                                                return todos!.filter((todo) => todo !== item);
                                            })
                                        } else {
                                            return setSelectedItems((items) => {
                                                return [...items!, item];
                                            })
                                        }
                                    }
                                    navigation.navigate("PaymentModal", {
                                        id: route.params && route.params.id,
                                        paymentSubmit: false,
                                        paymentId: item.id
                                    })
                                }}>
                                    <ListItem>
                                        <ListItem.CheckBox checked={item.paid === "Paid" ? true : false}
                                            onPress={() => setPaid(item)} />
                                        <ListItem.Content>
                                            <View className='flex flex-col justify-between items-start'>
                                                <Text className='text-black text-lg'>{item.data.name}</Text>
                                                <Text className='text-gray-500 text-lg'>{(item.data.paid).toLocaleString("en-US", {
                                                    style: 'currency',
                                                    currency: loadEvent.data?.currency.value || 'INR',
                                                    currencyDisplay: 'narrowSymbol',
                                                    useGrouping: true
                                                })}: {(item.data.amount).toLocaleString("en-US", {
                                                    style: 'currency',
                                                    currency: loadEvent.data?.currency.value || 'INR',
                                                    currencyDisplay: 'narrowSymbol',
                                                    useGrouping: true
                                                })}</Text>
                                            </View>
                                        </ListItem.Content>
                                    </ListItem>
                                </TouchableOpacity>
                            )} />
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
        </ScrollView>
    )
}