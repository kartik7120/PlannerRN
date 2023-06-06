import { View, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Dialog, Image, Divider } from '@rneui/themed';
import { Button } from '@rneui/themed';
import ButtonTitle from '../components/ButtonTitle';
import MaskLogo from "../assets/carnivalMask.svg";
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@rneui/themed';

interface LogInDialogProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    login: boolean;
}

const LogInDialog = (props: LogInDialogProps) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(props.login);

    const toggle = () => {
        props.setVisible((prev) => !prev);
    }

    const toggleLogIn = () => {
        setIsLogin((prev) => !prev);
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Dialog isVisible={props.visible} onBackdropPress={toggle} >
                <View className='flex flex-col gap-3'>
                    <Image source={require("../assets/loginVector.jpg")} style={{
                        aspectRatio: 1,
                        resizeMode: 'contain',
                        width: 256,
                        height: 256,
                    }} />
                    <View>
                        <Text className='text-xl font-normal text-center'>Authorization</Text>
                        <Text className='text-center'>Sign up or log in and start organizing your event</Text>
                    </View>
                    <View className='flex flex-row justify-evenly w-full items-center'>
                        <Button radius="md" title={<Text className='font-semibold text-black'>Google</Text>}
                            color="white" icon={<Ionicons name="logo-google" size={24} />} containerStyle={{
                                borderWidth: 1,
                                borderColor: 'gray',
                                width: 128,
                            }} buttonStyle={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                            }} />
                        <Button radius="md" title={<Text className='font-semibold text-black'>Facebook</Text>}
                            color="white" icon={<Ionicons name="logo-facebook" size={24} />} containerStyle={{
                                borderWidth: 1,
                                borderColor: 'gray',
                                width: 128,
                            }} buttonStyle={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                            }} />
                    </View>
                    <Divider width={1} />
                    <View>
                        <Input placeholder="Email" value={email} onChangeText={(text) => setEmail(() => text)} />
                        <Input placeholder="Password" secureTextEntry value={password} onChangeText={(text) => setPassword(() => text)} />
                        <Button title={isLogin ? "LOG IN" : "SIGN UP"} />
                        {isLogin ? <Text className='underline text-gray-600 text-center text-sm mt-2'>Forgot your password?</Text> : null}
                    </View>
                    <Divider width={1} />
                    <Text className='text-center'>{isLogin ? "Don't have an account?" : "Already have and account?"} <Text onPress={toggleLogIn} className='underline font-semibold'>{isLogin ? "Sign up" : "Log in"}</Text></Text>
                </View>
            </Dialog>
        </KeyboardAvoidingView>
    )
}

export default function StartScreen() {

    const [visible, setVisible] = React.useState(false);
    const [visible2, setVisible2] = useState(false);

    function LogIn() {
        setVisible((prev) => !prev);
    }

    return (
        <SafeAreaView className='flex flex-col justify-evenly '>
            <View>
                <Text className='text-2xl text-center text-gray-500'>All-in-one Event Planner</Text>
                <Text className='text-lg text-center'>
                    Keeps track of tasks manage guest list, control expenses, invite helpers and more
                </Text>
            </View>
            <Image source={require("../assets/party.png")} style={{
                aspectRatio: 1,
                resizeMode: 'contain',
                width: '100%',
                height: '75%',
            }} />
            <Button containerStyle={{
                display: 'flex',
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
            }} title={<ButtonTitle />} icon={<MaskLogo width={64} height={64} fill={"white"} />} onPress={() => {
                setVisible2((prev) => !prev);
            }}/>
            <Text className='text-center'>Already have an account? <Text onPress={LogIn} className='underline font-semibold '>Log in</Text></Text>
            <StatusBar style="dark" />
            <LogInDialog visible={visible} setVisible={setVisible} login={true} />
            <LogInDialog visible={visible2} setVisible={setVisible2} login={false} />
        </SafeAreaView>
    )
}