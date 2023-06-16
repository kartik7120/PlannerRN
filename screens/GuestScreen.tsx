import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Dialog, FAB, Image } from '@rneui/themed'
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import { useNavigation } from '@react-navigation/native';

export default function GuestScreen() {

    const [visible, setvisible] = useState(false);
    const navigation = useNavigation<StackNavigationProp<RootStack, 'StartNew'>>();

    return (
        <>
            <Dialog isVisible={visible} onBackdropPress={() => {
                setvisible(false);
            }}>
                <TouchableOpacity onPress={() => {
                    setvisible(false);
                    navigation.navigate('GuestModal');
                }}>
                    <Text className='text-lg'>Add manually</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text className='text-lg'>Add from contacts</Text>
                </TouchableOpacity>
            </Dialog>
            <View className='flex flex-col justify-center items-center h-full'>
                <Image source={require("../assets/not_found.png")} alt="Not Found" style={{
                    width: 100,
                    height: 100,
                    resizeMode: "contain"
                }} />
                <Text className='text-black text-xl'>There are no guests</Text>
                <Text className='text-gray-600'>Click + to add a new guest</Text>
                <FAB color="orange" onPress={() => {
                    setvisible(true);
                }} icon={
                    <AntDesign name="plus" size={24} color="black" />
                } placement='right' />
            </View>
        </>
    )
}