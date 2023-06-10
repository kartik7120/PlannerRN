import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import { useLayoutEffect } from "react";

type HomeScreenNavigationProps = StackNavigationProp<RootStack, "Home">;

export default function HomeScreen() {

  const { isLoaded, signOut, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  const navigation = useNavigation<HomeScreenNavigationProps>();

  if (!isLoaded) {
    return null;
  }

  return (
    <View>
      <Text>Home Screen</Text>
      <Button title="Sign Out" onPress={() => signOut()} />
      <Button title="Go to start new screen" onPress={() => navigation.navigate("StartNew")} />
    </View>
  )
}