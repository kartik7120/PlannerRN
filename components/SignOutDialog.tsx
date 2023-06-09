import { View, Text } from 'react-native'
import React from 'react'
import { Button, Dialog, Image } from '@rneui/themed'
import { useAuth } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';

type StartNewScreenNavigationProps = StackNavigationProp<RootStack, "StartNew">;

interface Props {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignOutDialog(props: Props) {

    const { signOut } = useAuth();
    const navigate = useNavigation<StartNewScreenNavigationProps>();

    return (
        <Dialog isVisible={props.visible} onBackdropPress={() => {
            props.setVisible(false);
        }}>
            <View className='flex flex-col justify-evenly items-center'>
                <Image source={require("../assets/campaign.png")} style={{
                    width: 100,
                    height: 100,
                    resizeMode: "contain",
                }} />
                <Text className='text-black text-3xl text-center'>Confirmation</Text>
                <Text className='text-black text-center'>Are you sure you want to log out?</Text>
            </View>
            <View className='flex flex-row justify-between mt-2 gap-x-3 w-full'>
                <View className='w-1/2'>
                    <Button color="gray" title="NO" onPress={() => {
                        props.setVisible(false);
                    }} />
                </View>
                <View className='w-1/2'>
                    <Button color="gray" title="YES" onPress={() => {
                        signOut();
                        navigate.navigate("Start");
                    }} />
                </View>
            </View>
        </Dialog>
    )
}