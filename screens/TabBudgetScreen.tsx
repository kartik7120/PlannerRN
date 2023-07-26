import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TopTabEvent from './TopTabEvent';

export type TopTabTabs<T> = {
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

export type ParamsForTopTab = {
  title: string;
  tabNavigatorNavigationProp: any;
}

const TopTab = createMaterialTopTabNavigator<TopTabTabs<ParamsForTopTab>>();

export default function TabBudgetScreen(props: any) {
  const navigation = props.navigation;
  return (
    <TopTab.Navigator screenOptions={{
      tabBarScrollEnabled: true,
    }}>
      <TopTab.Screen name="Attire" component={TopTabEvent} initialParams={{
        title: 'Attire',
        tabNavigatorNavigationProp: navigation
      }} options={{
        title: "Attire & Accessories"
      }} />
      <TopTab.Screen name="Health" component={TopTabEvent} options={{
        title: "Health & Beauty"
      }} initialParams={{
        title: 'Health',
        tabNavigatorNavigationProp: navigation
      }} />
      <TopTab.Screen name="Music" options={{
        title: "Music & Show"
      }} component={TopTabEvent} initialParams={{
        title: 'Music',
        tabNavigatorNavigationProp: navigation
      }} />
      <TopTab.Screen name="Flower" options={{
        title: "Flower & Decor"
      }} component={TopTabEvent} initialParams={{
        title: 'Flower',
        tabNavigatorNavigationProp: navigation
      }} />
      <TopTab.Screen name="Photo" options={{
        title: "Photo & Video"
      }} component={TopTabEvent} initialParams={{
        title: 'Photo',
        tabNavigatorNavigationProp: navigation
      }} />
      <TopTab.Screen name="Accessories" options={{
        title: "Accessories"
      }} component={TopTabEvent} initialParams={{
        title: 'Accessories',
        tabNavigatorNavigationProp: navigation
      }} />
      <TopTab.Screen name="Reception" options={{
        title: "Reception"
      }} component={TopTabEvent} initialParams={{
        title: 'Reception',
        tabNavigatorNavigationProp: navigation
      }} />
      <TopTab.Screen name="Transpotation" component={TopTabEvent} initialParams={{
        title: 'Transpotation',
        tabNavigatorNavigationProp: navigation
      }} options={{
        title: "Transpotation"
      }} />
      <TopTab.Screen name="Accomodation" component={TopTabEvent} initialParams={{
        title: 'Accomodation',
        tabNavigatorNavigationProp: navigation
      }} options={{
        title: "Accomodation"
      }} />
      <TopTab.Screen name="Unassigned" component={TopTabEvent} initialParams={{
        title: 'Unassigned',
        tabNavigatorNavigationProp: navigation
      }} options={{
        title: "Unassigned Category"
      }} />
    </TopTab.Navigator>
  )
}