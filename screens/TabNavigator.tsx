import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabHomeScreen from './TabHomeScreen';
import TabCheckListScreen from './TabCheckListScreen';
import TabGuestScreen from './TabGuestScreen';
import TabBudgetScreen from './TabBudgetScreen';
import TabMenuScreen from './TabMenuScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator initialRouteName='First'>
            <Tab.Screen name="First" component={TabHomeScreen} />
            <Tab.Screen name="Checklist" component={TabCheckListScreen} />
            <Tab.Screen name="Guests" component={TabGuestScreen} />
            <Tab.Screen name="Budget" component={TabBudgetScreen} />
            <Tab.Screen name="Menu" component={TabMenuScreen} />
        </Tab.Navigator>
    )
}

export default TabNavigator;