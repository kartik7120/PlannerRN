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
import { SignedIn, SignedOut, useSignUp } from '@clerk/clerk-expo';

interface LogInDialogProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    login: boolean;
}

const LogInDialog = (props: LogInDialogProps) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(props.login);
    const { isLoaded, signUp, setActive } = useSignUp();
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");

    const toggle = () => {
        props.setVisible((prev) => !prev);
    }

    const toggleLogIn = () => {
        setIsLogin((prev) => !prev);
    }

    const handleGoogleLogin = async () => {
        console.log("Google login");
    }

    const signUpPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            await signUp.create({
                emailAddress: email,
                password: password,
            })

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            })

            setPendingVerification(true);
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        }
    }

    const onPressVerify = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignup = await signUp.attemptEmailAddressVerification({
                code
            })

            await setActive({ session: completeSignup.createdSessionId });

        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        }
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
                            color="white" onPress={handleGoogleLogin} icon={<Ionicons name="logo-google" size={24} />} containerStyle={{
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
                        {!pendingVerification && (
                            <>
                                <Input placeholder="Email" value={email} onChangeText={(text) => setEmail(() => text)} />
                                <Input placeholder="Password" secureTextEntry value={password} onChangeText={(text) => setPassword(() => text)} />
                                {isLogin ? <Button title="LOG IN" /> : <Button title={"SIGN UP"} onPress={signUpPress} />}
                            </>
                        )}
                        {pendingVerification && (
                            <>
                                <Input placeholder="Verification Code" value={code} onChangeText={(text) => setCode(() => text)} />
                                <Button title="VERIFY" onPress={onPressVerify} />
                            </>
                        )}
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
        <SafeAreaView className='flex flex-col justify-evenly h-full'>
            <View>
                <Text className='text-3xl text-center text-gray-500'>All-in-one Event Planner</Text>
                <Text className='text-lg text-center'>
                    Keeps track of tasks manage guest list, control expenses, invite helpers and more
                </Text>
            </View>
            <Image source={require("../assets/party.png")} style={{
                aspectRatio: 1,
                resizeMode: 'contain',
                width: '100%',
                height: "auto",
            }} />
            <View>
                <Button containerStyle={{
                    display: 'flex',
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }} title={<ButtonTitle />} buttonStyle={{
                    width: "75%",
                    display: 'flex',
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                }} icon={<MaskLogo width={64} height={64} fill={"white"} />} onPress={() => {
                    setVisible2((prev) => !prev);
                }} />
                <Text className='text-center mt-2'>Already have an account? <Text onPress={LogIn} className='underline font-semibold '>Log in</Text></Text>
                <StatusBar style="dark" />
                <LogInDialog visible={visible} setVisible={setVisible} login={true} />
                <LogInDialog visible={visible2} setVisible={setVisible2} login={false} />
                <SignedIn>
                    <Text className='text-center mt-2'>You are signed in</Text>
                </SignedIn>
                <SignedOut>
                    <Text className='text-center mt-2'>You are signed out</Text>
                </SignedOut>
            </View>
        </SafeAreaView>
    )
}