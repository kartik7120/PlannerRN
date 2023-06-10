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

export type RootStack = {
  Home: undefined;
  Start: undefined;
  StartNew: undefined;
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
            }}/>
            <Stack.Screen name="Start" component={StartScreen} options={{
              headerShown: false
            }} />
            <Stack.Screen name="StartNew" component={StartNewScreen} options={{
              headerShown: false,
            }} />
          </Stack.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </ClerkProvider>
  );
}
