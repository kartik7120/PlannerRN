import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import GuestScreen from './GuestScreen';

type GuestTopTab<T> = {
    GuestsList: {
        [key in keyof T]: T[key]
    },
    Tables: undefined,
    Groups: undefined,
    Menus: undefined,
    Lists: undefined,
}

const TopTab = createMaterialTopTabNavigator<GuestTopTab<{}>>();

export default function TabGuestScreen() {
    return (
        <TopTab.Navigator screenOptions={{
            tabBarScrollEnabled: true,
        }}>
            <TopTab.Screen name="GuestsList" component={GuestScreen} options={{
                title:"Guests"
            }}/>
            <TopTab.Screen name="Tables" component={GuestScreen} />
            <TopTab.Screen name="Groups" component={GuestScreen} />
            <TopTab.Screen name="Menus" component={GuestScreen} />
            <TopTab.Screen name="Lists" component={GuestScreen} />
        </TopTab.Navigator>
    )
}