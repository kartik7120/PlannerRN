import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function StartScreen() {
    return (
        <SafeAreaView>
            <Text className='text-2xl text-center text-gray-500'>All-in-one Event Planner</Text>
            <Text className='text-lg text-center'>
                Keeps track of tasks manage guest list, control expenses, invite helpers and more
            </Text>
            <StatusBar style="dark" />
        </SafeAreaView>
    )
}