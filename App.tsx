/// <reference types="nativewind/types" />
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './screens/StartScreen';
import HomeScreen from './screens/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider } from "@clerk/clerk-expo";
import { CLERK_PUBLISHABLE_KEY } from "@env"
type RootStack = {
  Home: undefined;
  Start: undefined;
}

const Stack = createStackNavigator<RootStack>();

export default function App() {

  return (
    <ClerkProvider publishableKey={process.env.CLERK_PUBLISHABLE_KEY} >
      <NavigationContainer>
        <SafeAreaProvider>
          <Stack.Navigator initialRouteName='Start'>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Start" component={StartScreen} options={{
              headerShown: false
            }} />
          </Stack.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </ClerkProvider>
  );
}
