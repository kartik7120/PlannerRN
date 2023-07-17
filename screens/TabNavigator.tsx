import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabHomeScreen from './TabHomeScreen';
import TabCheckListScreen from './TabCheckListScreen';
import TabBudgetScreen from './TabBudgetScreen';
import TabMenuScreen from './TabMenuScreen';
import { AntDesign, Octicons } from '@expo/vector-icons';
import GuestScreen from './GuestScreen';

export type RootTab = {
    First: undefined;
    Checklist: undefined;
    Guests: undefined;
    Budget: undefined;
    Menu: undefined;
}

const Tab = createBottomTabNavigator<RootTab>();

const TabNavigator = () => {
    return (
        <Tab.Navigator initialRouteName='First'>
            <Tab.Screen name="First" component={TabHomeScreen} options={{
                tabBarIcon: () => (<AntDesign name="home" size={24} color="black" />),
                headerLeft: () => <AntDesign name="home" size={24} color="black" />,
                headerLeftContainerStyle: {
                    marginLeft: 10,
                },
                headerRight: (() => (
                    <TouchableOpacity>
                        <AntDesign name="message1" size={24} color="black" />
                    </TouchableOpacity>
                )),
                headerRightContainerStyle: {
                    marginRight: 10,
                },
                title: 'Home',
            }} />
            <Tab.Screen name="Checklist" component={TabCheckListScreen} options={{
                tabBarIcon: () => (<Octicons name="checklist" size={24} color="black" />),
                headerLeft: () => (<Octicons name="checklist" size={24} color="black" />),
                headerLeftContainerStyle: {
                    marginLeft: 10,
                },
            }} />
            <Tab.Screen name="Guests" component={GuestScreen} options={{
                tabBarIcon: () => (<AntDesign name="team" size={24} color="black" />),
                headerLeft: () => <AntDesign name="team" size={24} color="black" />,
                headerLeftContainerStyle: {
                    marginLeft: 10,
                },
                title:"Guests"
            }} />
            <Tab.Screen name="Budget" component={TabBudgetScreen} options={{
                tabBarIcon: () => (<AntDesign name="creditcard" size={24} color="black" />),
                headerLeft: () => <AntDesign name="creditcard" size={24} color="black" />,
                headerLeftContainerStyle: {
                    marginLeft: 10,
                },
                headerRight: (() => (
                    <TouchableOpacity>
                        <AntDesign name="message1" size={24} color="black" />
                    </TouchableOpacity>
                )),
                headerRightContainerStyle: {
                    marginRight: 10,
                },
            }} />
            <Tab.Screen name="Menu" component={TabMenuScreen} options={{
                tabBarIcon: () => (<AntDesign name="menufold" size={24} color="black" />),
                headerLeft: () => <AntDesign name="menufold" size={24} color="black" />,
                headerLeftContainerStyle: {
                    marginLeft: 10,
                },
            }} />
        </Tab.Navigator>
    )
}

export default TabNavigator;