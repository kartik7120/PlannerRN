import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Button, Dialog, Image, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { RootStack } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewEvent from '../components/NewEvent';
import { StatusBar } from 'expo-status-bar';
import SignOutDialog from '../components/SignOutDialog';
import { Controller, useForm } from 'react-hook-form';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useQueryClient } from '@tanstack/react-query';

interface Form {
    name: string;
    code: string;
}

export default function StartNewScreen() {

    const { isLoaded, signOut, isSignedIn } = useAuth();
    const [visible, setVisible] = useState(false);
    const { user } = useUser();
    const [isVisible, setIsVisible] = useState(false);
    const navigation = useNavigation<StackNavigationProp<RootStack, 'StartNew'>>();
    const setIsVisibleCallack = useCallback(setIsVisible, []);
    const [visible2, setVisible2] = useState(false);
    const queryClient = useQueryClient();
    const { control, formState: { errors }, handleSubmit } = useForm<Form>({
        defaultValues: {
            name: "",
            code: "",
        }
    })

    if (!isLoaded) {
        return null;
    }

    const onSubmit = async (data: Form) => {
        try {
            const colRef = collection(db, "events", data.code, "helpers");
            await addDoc(colRef, {
                name: data.name,
                email: user && user.emailAddresses[0].emailAddress,
                userId: user && user.id,
            })
            const docRef = doc(db, "events", data.code);
            await updateDoc(docRef, {
                userId: arrayUnion(user && user.id),
            })
            setVisible2(false);
            queryClient.setQueryData(['currentEventId'], data.code);
            queryClient.invalidateQueries(['currentEventId']);
            navigation.navigate("Home", {})
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView>
            <Dialog isVisible={visible2} onBackdropPress={() => setVisible2(false)} style={{
                borderRadius: 20,
            }}>
                <View className='flex flex-col gap-y-2 items-center'>
                    <Image source={require("../assets/Chat.jpg")} style={{
                        width: 150,
                        height: 150,
                        resizeMode: "contain",
                        borderRadius: 20,
                    }} />
                    <Text className='text-xl text-center'>Join an existing event</Text>
                    <Text className='text-center'>Enter event code. You can get this code from the event owner</Text>
                </View>
                <Controller control={control} name="name" render={({ field: { onChange, onBlur, value } }) => (
                    <Input placeholder="Your name"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                    />
                )} />
                {errors.name && <Text className='text-red-600'>This is required.</Text>}
                <Controller control={control} name="code" render={({ field: { onChange, onBlur, value } }) => (
                    <Input placeholder="Event code"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                    />
                )} />
                {errors.code && <Text className='text-red-600'>This is required.</Text>}
                <Button title="JOIN" onPress={handleSubmit(onSubmit)} />
            </Dialog>
            <View className='flex flex-col justify-center items-center h-full gap-y-5 border border-red-700'>
                <Image source={require("../assets/gift_image.png")} style={{
                    width: 150,
                    height: 150,
                    resizeMode: "contain",
                    borderRadius: 20,
                }} />
                <View>
                    <Text className='text-black text-3xl text-center'>Congratulations</Text>
                    <Text className='text-black text-lg text-center'>You have successfully registered.</Text>
                    <Text className='text-black text-lg text-center'>Create your first event or join a friend's event</Text>
                </View>
                <View className='border-2 border-red-600 flex flex-col max-h-max gap-y-5'>
                    <Button title="CREATE A NEW EVENT" className='mt-5' onPress={() => setVisible(true)} />
                    <Button title="JOIN AN EXISTING EVENT" onPress={() => setVisible2(true)} />
                </View>
                <NewEvent visible={visible} setVisible={setVisible} />
                <View className='flex flex-col gap-y-2 justify-end items-center  justify-self-end border border-red-600'>
                    <Text className='text-black'>{user && user.emailAddresses[0].emailAddress}</Text>
                    <Text className='text-gray-500 underline' onPress={() => {
                        setIsVisible(true);
                    }}>
                        Log out
                    </Text>
                    <SignOutDialog visible={isVisible} setVisible={setIsVisibleCallack} />
                </View>
                {/* <Button title="Sign Out" onPress={() => {
                    signOut()
                    navigation.replace('Start')
                }} /> */}
            </View>
            <StatusBar style="dark" />
        </SafeAreaView>
    )
}