import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '@clerk/clerk-expo';
import { Button, Image } from '@rneui/themed';
import { useLayoutEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { RootStack } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Confetti from '../components/Confetti';
import NewEvent from '../components/NewEvent';
import { StatusBar } from 'expo-status-bar';

type StartNewScreenNavigationProps = StackNavigationProp<RootStack, "StartNew">;

export default function StartNewScreen() {

    const { isLoaded, signOut, isSignedIn } = useAuth();
    const navigation = useNavigation<StartNewScreenNavigationProps>();
    const [visible, setVisible] = useState(false);

    if (!isLoaded) {
        return null;
    }

    return (
        <SafeAreaView>
            <View className='flex flex-col justify-center items-center h-full gap-5'>
                <Image source={require("../assets/gift_image.png")} style={{
                    width: 150,
                    height: 150,
                    resizeMode: "contain",
                    borderRadius: 20,
                }} />
                <View>
                    <Text className='text-black text-3xl text-center'>Congratulations</Text>
                    <Text className='text-black text-lg text-center'>You have successfully registered.</Text>
                    <Text className='text-black text-lg text-center'>Create your first event or join a friend's event</Text>
                </View>
                <View className='border-2 border-red-600 flex flex-col gap-5'>
                    <Button title="CREATE A NEW EVENT" className='mt-5' onPress={() => setVisible(true)} />
                    <Button title="JOIN AN EXISTING EVENT" />
                </View>
                <Confetti />
                <NewEvent visible={visible} setVisible={setVisible} />
            </View>
            {/* <Button title="Sign Out" onPress={() => signOut()} /> */}
            <StatusBar style="dark" />
        </SafeAreaView>
    )
}