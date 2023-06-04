import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from '@rneui/themed';
import { Button } from '@rneui/themed';
import ButtonTitle from '../components/ButtonTitle';

export default function StartScreen() {
    return (
        <SafeAreaView>
            <Text className='text-2xl text-center text-gray-500'>All-in-one Event Planner</Text>
            <Text className='text-lg text-center'>
                Keeps track of tasks manage guest list, control expenses, invite helpers and more
            </Text>
            {/* <Image source={require("../assets/partyArt.jpg")} style={{
                aspectRatio: 1,
                resizeMode: 'contain',
                width: '100%',
                height: '100%',
            }} /> */}
            {/* <Button title={<ButtonTitle />} icon={} /> */}
            <Image source={require("../assets/carnivalMask.svg")} />
            <StatusBar style="dark" />
        </SafeAreaView>
    )
}