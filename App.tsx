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
import BudgetModal from './screens/BudgetModal';
import GuestModal from './screens/GuestModal';
import GuestContactModal from './screens/GuestContactModal';
import BudgetItemModal from './screens/BudgetItemModal';
import PaymentModal from './screens/PaymentModal';
import CheckListScreen from './screens/CheckListScreen';
import CheckListDetail from './screens/CheckListDetail';
import SubtaskScreen from './components/SubtaskScreen';
import VendorsFormModal from './screens/VendorsFormModal';
import VendorDetails from './screens/VendorDetails';
import PaymentVendorForm from './screens/PaymentVendorForm';
import ChangeNameModal from './screens/ChangeNameModal';
import { TouchableOpacity } from "react-native";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import CheckListSummaryModal from './screens/CheckListSummaryModal';
import BudgetSummaryModal from './screens/BudgetSummaryModal';
import { Feather } from '@expo/vector-icons';
import BudgetSettingsModal from './screens/BudgetSettingsModal';

export type RootStack = {
  Home: {
    screen?: string;
  };
  Start: undefined;
  StartNew: undefined;
  Vendors: undefined;
  Settings: undefined;
  Messages: undefined;
  Helpers: undefined;
  Events: undefined;
  Schedule: undefined;
  BudgetModal: undefined;
  GuestModal: undefined;
  GuestContactModal: undefined;
  BudgetItemModal: {
    title: string;
    id: string;
    category: string;
    name: string;
    amount: string;
    paid: string;
    pending: string;
    note: string;
    edit?: boolean;
  };
  PaymentModal: {
    id: string;
    paymentSubmit: boolean;
    paymentId: string;
    name?: string;
    note?: string;
    amount?: string;
    paidDate?: string;
    paid?: string;
    category?: string;
    pending?: string;
  };
  CheckListModal: {
    name?: string;
    note?: string;
    category?: string;
    date?: string;
    completed?: boolean;
    id?: string;
    edit?: boolean;
  },
  CheckListDetail: {
    name?: string;
    note?: string;
    category?: string;
    date?: string;
    completed?: boolean;
    id?: string;
  },
  SubTask: {
    name?: string;
    note?: string;
    completed?: boolean;
    taskId?: string;
    id?: string;
    edit?: boolean;
  },
  VendorsForm: {
    name?: string;
    note?: string;
    category?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    amount?: string;
    status?: string;
    id?: string;
    edit?: boolean;
  },
  VendorsDetailModal: {
    name?: string;
    note?: string;
    category?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    amount?: string;
    status?: string;
    id?: string;
  },
  PaymentVendorForm: {
    name?: string;
    note?: string;
    amount?: string;
    paidDate?: string;
    paid?: boolean;
    id: string;
    edit?: boolean;
    paymentId?: string;
  },
  ChainNameSettings: undefined,
  CheckListSummaryModal: undefined,
  BudgetSummaryModal: undefined,
  BudgetSettingsModal: {
    budget: string;
  }
}

const Stack = createStackNavigator<RootStack>();
const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.CLERK_PUBLISHABLE_KEY}>
        <NavigationContainer>
          <SafeAreaProvider>
            <Stack.Navigator initialRouteName='Start'>
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
              <Stack.Screen name="BudgetModal" component={BudgetModal} options={{
                presentation: "modal",
                title: "Add a new cost"
              }} />
              <Stack.Screen name="GuestModal" component={GuestModal} options={{
                presentation: "modal",
                title: "Add a new guest"
              }} />
              <Stack.Screen name='GuestContactModal' component={GuestContactModal} options={{
                presentation: "modal",
                title: "Add a new guest"
              }} />
              <Stack.Screen name="BudgetItemModal" component={BudgetItemModal} options={{
                presentation: "modal",
              }} />
              <Stack.Screen name="PaymentModal" component={PaymentModal} options={{
                presentation: "modal",
                title: "Add a new payment"
              }} />
              <Stack.Screen name="CheckListModal" component={CheckListScreen} options={{
                presentation: "modal",
                title: "Add a new task"
              }} />
              <Stack.Screen name="CheckListDetail" component={CheckListDetail} options={{
                presentation: "modal",
                title: "Task Details"
              }} />
              <Stack.Screen name="SubTask" component={SubtaskScreen} options={{
                presentation: "modal",
                title: "Add a new subtask"
              }} />
              <Stack.Screen name="VendorsForm" component={VendorsFormModal} options={{
                presentation: "modal",
                title: "Add a new vendor"
              }} />
              <Stack.Screen name="VendorsDetailModal" component={VendorDetails} options={{
                presentation: "modal",
                title: "Vendor Details"
              }} />
              <Stack.Screen name="PaymentVendorForm" component={PaymentVendorForm} options={{
                presentation: "modal",
                title: "Add a new payment"
              }} />
              <Stack.Screen name="ChainNameSettings" component={ChangeNameModal} options={{
                presentation: "modal",
                title: "User"
              }} />
              <Stack.Screen name="CheckListSummaryModal" component={CheckListSummaryModal} options={{
                presentation: "modal",
                title: "Summary"
              }} />
              <Stack.Screen name="BudgetSummaryModal" component={BudgetSummaryModal} options={{
                presentation: "modal",
                title: "Summary",
                headerRight: () => (
                  <TouchableOpacity>
                    <Feather name="settings" size={24} color="black" />
                  </TouchableOpacity>
                ),
                headerRightContainerStyle: {
                  marginRight: 10
                }
              }} />
              <Stack.Screen name="BudgetSettingsModal" component={BudgetSettingsModal} options={{
                presentation: "modal",
                title: "Settings"
              }} />
            </Stack.Navigator>
          </SafeAreaProvider>
        </NavigationContainer>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
