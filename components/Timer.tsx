import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const getEventDetail = async ({ queryKey }: any) => {
    const [_key, eventId] = queryKey;
    const docRef = doc(db, "events", eventId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as any;
    } else {
        return null;
    }
}

export default function Timer() {

    const [timer, setTimer] = React.useState({
        days: 0,
        hours: 0,
        mins: 0,
        secs: 0
    })

    const queryClient = useQueryClient();
    const eventId = queryClient.getQueryData(['currentEventId'], {
        exact: true
    });

    const eventDetailQuery = useQuery(['eventDetailTimer',eventId as string], getEventDetail);

    useEffect(() => {
        if (!eventDetailQuery.data) return;
        let date1 = new Date(eventDetailQuery.data.time.seconds * 1000);
        const clearIternval = setInterval(() => {
            const date2 = new Date();
            const diffTime = Math.abs(date2.getTime() - date1.getTime());
            let secs = Math.floor(diffTime / 1000);
            let mins = Math.floor(secs / 60);
            let hours = Math.floor(mins / 60);
            let days = Math.floor(hours / 24);
            hours %= 24;
            mins %= 60;
            secs %= 60;
            setTimer({
                days,
                hours,
                mins,
                secs
            })
        }, 1000)
        return () => {
            clearInterval(clearIternval);
        }
    }, [eventDetailQuery.data])

    return (
        <LinearGradient colors={["#ff7621", "#ff435c", "#ff0075"]} start={{
            x: 0,
            y: 1
        }} locations={[0.2, 0.5, 0.8]}>
            <View className='flex flex-row justify-center items-center gap-x-6 pt-2 pb-2 rounded'>
                <View className='flex flex-col justify-center items-center'>
                    <Text className='text-white'>Days</Text>
                    <Text className='text-3xl font-semibold text-white'>{timer.days}</Text>
                </View>
                <View className='flex flex-col justify-center items-center'>
                    <Text className='text-white'>Hours</Text>
                    <Text className='text-3xl font-semibold text-white'>{timer.hours}</Text>
                </View>
                <View className='flex flex-col justify-center items-center'>
                    <Text className='text-white'>Mins</Text>
                    <Text className='text-3xl font-semibold text-white'>{timer.mins}</Text>
                </View>
                <View className='flex flex-col justify-center items-center'>
                    <Text className='text-white'>Secs</Text>
                    <Text className='text-3xl font-semibold text-white'>{timer.secs}</Text>
                </View>
            </View>
        </LinearGradient>
    )
}