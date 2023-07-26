import { View, Text, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Divider, LinearProgress } from '@rneui/themed'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';

type NavProps = StackNavigationProp<RootStack, "BudgetSummaryModal">;

const getEventDetails = async ({ queryKey }: any) => {
    const [_key, { id }] = queryKey;
    const event = await getDoc(doc(db, "events", id));
    return event.data();
}

export default function BudgetSummaryModal() {

    const queryClient = useQueryClient();
    const id = queryClient.getQueryData(['currentEventId'], {
        exact: true
    });

    const navigation = useNavigation<NavProps>();
    const event = useQuery(['currentEvent', { id }], getEventDetails, {
        enabled: !!id
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => {
                    navigation.navigate("BudgetSettingsModal", {
                        budget: event.data?.Budget,
                    })
                }}>
                    <Feather name="settings" size={24} color="black" />
                </TouchableOpacity>
            ),
            headerRightContainerStyle: {
                marginRight: 10
            }
        })
    }, [])

    return (
        <View>
            <View className='bg-white border border-transparent overflow-hidden rounded-lg p-2 m-2'>
                <View className='flex flex-col gap-y-5 items-center justify-center'>
                    <Text className='text-lg'>0 spend out of {(event.data && event.data?.Budget.toString().toLocaleString("en-US", {
                        style: 'currency',
                        currency: event.data && event.data?.currency.value || 'INR',
                        currencyDisplay: 'narrowSymbol',
                        useGrouping: true
                    }))}</Text>
                    <LinearProgress value={0.5} style={{
                        height: 10
                    }} />
                </View>
            </View>
            <View className='bg-white border border-transparent overflow-hidden rounded-lg p-2 m-2'>
                <View className='flex flex-row items-center gap-x-5'>
                    <SimpleLineIcons name="calculator" size={24} color="black" />
                    <Text>BALANCE</Text>
                </View>
                <Divider width={1} />
                <View className='p-6'>
                    <View className='flex flex-row justify-between items-center'>
                        <Text>Budget</Text>
                        <View className='flex flex-row justify-between items-center gap-x-2'>
                            <View className='w-2 h-2 rounded-full bg-gray-500'></View>
                            <Text>{(event.data && event.data?.Budget.toString().toLocaleString("en-US", {
                                style: 'currency',
                                currency: event.data && event.data?.currency.value || 'INR',
                                currencyDisplay: 'narrowSymbol',
                                useGrouping: true
                            })) || 0}</Text>
                        </View>
                    </View>
                    <View className='flex flex-row justify-between items-center'>
                        <Text>Paid</Text>
                        <View className='flex flex-row justify-between items-center gap-x-2'>
                            <View className='w-2 h-2 rounded-full bg-rose-500'></View>
                            <Text>{(event.data && event.data?.paid.toString().toLocaleString("en-US", {
                                style: 'currency',
                                currency: event.data && event.data?.currency.value || 'INR',
                                currencyDisplay: 'narrowSymbol',
                                useGrouping: true
                            }))}</Text>
                        </View>
                    </View>
                    <View className='flex flex-row justify-between items-center'>
                        <Text>Pending</Text>
                        <View className='flex flex-row justify-between items-center gap-x-2'>
                            <View className='w-2 h-2 rounded-full bg-yellow-500'></View>
                            <Text>{(event.data && event.data?.pending.toString().toLocaleString("en-US", {
                                style: 'currency',
                                currency: event.data && event.data?.currency.value || 'INR',
                                currencyDisplay: 'narrowSymbol',
                                useGrouping: true
                            }))}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}