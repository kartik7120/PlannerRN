import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TopTabEvent from './TopTabEvent';

type TopTabTabs<T> = {
  Attire: {
    [key in keyof T]: T[key]
  };
  Health: {
    [key in keyof T]: T[key]
  };
  Music: {
    [key in keyof T]: T[key]
  };
  Flower: {
    [key in keyof T]: T[key]
  };
  Photo: {
    [key in keyof T]: T[key]
  };
  Accessories: {
    [key in keyof T]: T[key]
  };
  Reception: {
    [key in keyof T]: T[key]
  };
  Transpotation: {
    [key in keyof T]: T[key]
  };
  Accomodation: {
    [key in keyof T]: T[key]
  };
  Unassigned: {
    [key in keyof T]: T[key]
  };
}

type ParamsForTopTab = {
  title: string;
}

const TopTab = createMaterialTopTabNavigator<TopTabTabs<ParamsForTopTab>>();

export default function TabBudgetScreen() {
  return (
    <TopTab.Navigator screenOptions={{
      tabBarScrollEnabled: true,
    }}>
      <TopTab.Screen name="Attire" component={TopTabEvent} initialParams={{
        title: 'Attire',
      }} />
      <TopTab.Screen name="Health" component={TopTabEvent} initialParams={{
        title: 'Health',
      }} />
      <TopTab.Screen name="Music" component={TopTabEvent} initialParams={{
        title: 'Music',
      }} />
      <TopTab.Screen name="Flower" component={TopTabEvent} initialParams={{
        title: 'Flower',
      }} />
      <TopTab.Screen name="Photo" component={TopTabEvent} initialParams={{
        title: 'Photo',
      }} />
      <TopTab.Screen name="Accessories" component={TopTabEvent} initialParams={{
        title: 'Accessories',
      }} />
      <TopTab.Screen name="Reception" component={TopTabEvent} initialParams={{
        title: 'Reception',
      }} />
      <TopTab.Screen name="Transpotation" component={TopTabEvent} initialParams={{
        title: 'Transpotation',
      }} />
      <TopTab.Screen name="Accomodation" component={TopTabEvent} initialParams={{
        title: 'Accomodation',
      }} />
      <TopTab.Screen name="Unassigned" component={TopTabEvent} initialParams={{
        title: 'Unassigned',
      }} />
    </TopTab.Navigator>
  )
}