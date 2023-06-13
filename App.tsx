/// <reference types="nativewind/types" />
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './screens/StartScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider } from "@clerk/clerk-expo";
import { CLERK_PUBLISHABLE_KEY } from "@env"
import * as SecureStore from "expo-secure-store";
import StartNewScreen from './screens/StartNewScreen';
import TabNavigator from './screens/TabNavigator';
import Vendors from './screens/Vendors';
import Settings from './screens/Settings';
import Messages from './screens/Messages';
import Helpers from './screens/Helpers';
import Events from './screens/Events';
import Schedule from './screens/Schedule';

export type RootStack = {
  Home: undefined;
  Start: undefined;
  StartNew: undefined;
  Vendors: undefined;
  Settings: undefined;
  Messages: undefined;
  Helpers: undefined;
  Events: undefined;
  Schedule: undefined;
}

const Stack = createStackNavigator<RootStack>();

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function App() {

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.CLERK_PUBLISHABLE_KEY}>
      <NavigationContainer>
        <SafeAreaProvider>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" component={TabNavigator} options={{
              headerShown: false
            }} />
            <Stack.Screen name="Start" component={StartScreen} options={{
              headerShown: false
            }} />
            <Stack.Screen name="StartNew" component={StartNewScreen} options={{
              headerShown: false,
            }} />
            <Stack.Screen name="Vendors" component={Vendors} options={{
              presentation: "modal"
            }} />
            <Stack.Screen name="Settings" component={Settings} options={{
              presentation: "modal"
            }} />
            <Stack.Screen name="Messages" component={Messages} options={{
              presentation: "modal"
            }} />
            <Stack.Screen name="Helpers" component={Helpers} options={{
              presentation: "modal"
            }} />
            <Stack.Screen name="Events" component={Events} options={{
              presentation: "modal"
            }} />
            <Stack.Screen name="Schedule" component={Schedule} options={{
              presentation: "modal"
            }} />
          </Stack.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </ClerkProvider>
  );
}
