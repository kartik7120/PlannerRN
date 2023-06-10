import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Button, Image } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { RootStack } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Confetti from '../components/Confetti';
import NewEvent from '../components/NewEvent';
import { StatusBar } from 'expo-status-bar';
import SignOutDialog from '../components/SignOutDialog';

export default function StartNewScreen() {

    const { isLoaded, signOut, isSignedIn } = useAuth();
    const [visible, setVisible] = useState(false);
    const { user } = useUser();
    const [isVisible, setIsVisible] = useState(false);
    const navigation = useNavigation<StackNavigationProp<RootStack, 'StartNew'>>();

    const setIsVisibleCallack = useCallback(setIsVisible, []);

    if (!isLoaded) {
        return null;
    }

    return (
        <SafeAreaView>
            <View className='flex flex-col justify-center items-center h-full gap-y-5 border border-red-700'>
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
                <View className='border-2 border-red-600 flex flex-col max-h-max gap-y-5'>
                    <Button title="CREATE A NEW EVENT" className='mt-5' onPress={() => setVisible(true)} />
                    <Button title="JOIN AN EXISTING EVENT" />
                </View>
                <Confetti />
                <NewEvent visible={visible} setVisible={setVisible} />
                <View className='flex flex-col gap-y-2 justify-end items-center  justify-self-end border border-red-600'>
                    <Text className='text-black'>{user && user.emailAddresses[0].emailAddress}</Text>
                    <Text className='text-gray-500 underline' onPress={() => {
                        setIsVisible(true);
                    }}>
                        Log out
                    </Text>
                    <SignOutDialog visible={isVisible} setVisible={setIsVisibleCallack} />
                </View>
                {/* <Button title="Sign Out" onPress={() => {
                    signOut()
                    navigation.replace('Start')
                }} /> */}
            </View>
            <StatusBar style="dark" />
        </SafeAreaView>
    )
}