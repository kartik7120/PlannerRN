import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo';
import { Button } from '@rneui/themed';
import { useLayoutEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { RootStack } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';

type StartNewScreenNavigationProps = StackNavigationProp<RootStack, "StartNew">;

export default function StartNewScreen() {

    const { isLoaded, signOut, isSignedIn } = useAuth();
    const navigation = useNavigation<StartNewScreenNavigationProps>();

    if (!isLoaded) {
        return null;
    }

    useLayoutEffect(() => {
        if (!isSignedIn) {
            navigation.navigate("Start");
        }
    }, [isSignedIn])

    return (
        <View>
            <Text>StartNewScreen</Text>
            <Button title="Sign Out" onPress={() => signOut()} />
        </View>
    )
}