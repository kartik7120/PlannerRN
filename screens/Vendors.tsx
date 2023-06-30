import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FAB } from '@rneui/themed'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Dialog } from '@rneui/themed';
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStack } from '../App'

type NavigationProp = StackNavigationProp<RootStack, 'VendorsForm'>;

export default function Vendors() {

    const [visible, setVisible] = useState(false);
    const navigation = useNavigation<NavigationProp>();

    return (
        <>
            <Dialog style={{
                padding: 20
            }} isVisible={visible} onBackdropPress={() => setVisible(() => false)}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("VendorsForm", {})
                    setVisible(() => false)
                }}>
                    <Text className='text-lg'>Add Manually</Text>
                </TouchableOpacity>
                <TouchableOpacity >
                    <Text className='text-lg'>Add Manually</Text>
                </TouchableOpacity>
            </Dialog>
            <View className='h-full'>
                <Text>Vendors</Text>
                <FAB placement='right' color="red" icon={<AntDesign name="plus" size={24} color="black" />}
                    onPress={() => setVisible(() => true)} />
            </View>
        </>
    )
}