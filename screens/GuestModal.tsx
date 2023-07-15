import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { useForm, Controller, useWatch, useFormContext } from 'react-hook-form';
import { Button, Input } from '@rneui/themed';
import DropDownPicker from 'react-native-dropdown-picker';
import { useQueryClient } from '@tanstack/react-query';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStack } from '../App';

enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "Other"
}

enum AgeType {
    Adult = "Adult",
    Child = "Child",
    Baby = "Baby"
}

interface GuestForm {
    firstname: string;
    lastname: string;
    notes: string;
    gender: Gender;
    ageType: AgeType;
    tables: any,
    groups: any,
    menus: any,
    lists: any,
    phone: string;
    email: string;
    address: string;
    invitationSent: boolean;
    invitationAccepted: "Accepted" | "Declined" | "Pending";
}

type RProps = RouteProp<RootStack, 'GuestModal'>;

export default function GuestModal() {

    const { control, register, formState: { errors }, setValue: setFormValue, handleSubmit, } = useForm<GuestForm>({
        defaultValues: {
            firstname: "",
            lastname: "",
            notes: "",
            gender: Gender.Male,
            ageType: AgeType.Adult,
            tables: [],
            groups: [],
            menus: [],
            lists: [],
            phone: "",
            email: "",
            address: "",
            invitationSent: false,
            invitationAccepted: "Pending",
        }
    });

    const watch = useWatch({
        control,
        name: "invitationSent",
    })

    const watch2 = useWatch({
        control,
        name: "invitationAccepted",
    })

    const queryClient = useQueryClient();
    const id = queryClient.getQueryData(['currentEventId']);
    const navigation = useNavigation();
    const route = useRoute<RProps>();

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);
    const [items, setItems] = React.useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
    ]);

    const [open2, setOpen2] = React.useState(false);
    const [value2, setValue2] = React.useState(null);
    const [items2, setItems2] = React.useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
    ]);

    const style1 = "basis-1/2 p-3 text-center text-lg " + (watch === true ? "bg-orange-500 text-white" : "bg-white text-black");
    const style2 = "basis-1/2 p-3 text-center text-lg " + (watch === false ? "bg-orange-500 text-white" : "bg-white text-black");
    const style3 = "basis-1/3 p-3 text-center text-lg " + (watch2 === "Accepted" ? "bg-orange-500 text-white" : "bg-white text-black");
    const style4 = "basis-1/3 p-3 text-center text-lg " + (watch2 === "Pending" ? "bg-orange-500 text-white" : "bg-white text-black");
    const style5 = "basis-1/3 p-3 text-center text-lg " + (watch2 === "Declined" ? "bg-orange-500 text-white" : "bg-white text-black");

    const onSubmit = async (data: GuestForm) => {
        const colRef = collection(db, "events", id as string, "guests");
        await addDoc(colRef, data);
        navigation.goBack();
    }

    const onEdit = async (data: GuestForm) => {
        if (!route.params.guestId) {
            return;
        }
        const docRef = doc(db, "events", id as string, "guests", route.params.guestId);
        await updateDoc(docRef, {
            ...data
        });
        navigation.goBack();
    }

    return (
        <ScrollView>
            <View className='bg-white flex flex-col gap-y-5 h-full'>
                <View className='flex flex-row w-full'>
                    <View className='w-1/2'>
                        <Controller name="firstname" control={control} rules={{ required: true }} render={({ field: { onChange, onBlur, value } }) => (
                            <Input errorMessage={errors.firstname && errors.firstname.message} placeholder="First Name" onBlur={onBlur} onChangeText={onChange} value={value} />
                        )} />
                    </View>
                    <View className='w-1/2'>
                        <Controller name="lastname" control={control} rules={{ required: true }} render={({ field: { onChange, onBlur, value } }) => (
                            <Input errorMessage={errors.lastname && errors.lastname.message} placeholder="Last Name" onBlur={onBlur} onChangeText={onChange} value={value} />
                        )} />
                    </View>
                </View>

                <View>
                    <Controller name="notes" control={control} rules={{ required: true }} render={({ field: { onChange, onBlur, value } }) => (
                        <Input errorMessage={errors.notes && errors.notes.message} placeholder="Notes" onBlur={onBlur} onChangeText={onChange} value={value} />
                    )} />
                </View>

                <View className='z-50'>
                    <DropDownPicker open={open} value={value} setOpen={setOpen} setValue={setValue} mode='SIMPLE' listMode='SCROLLVIEW' items={[
                        { label: "Adult", value: AgeType.Adult },
                        { label: "Child", value: AgeType.Child },
                        { label: "Baby", value: AgeType.Baby },
                    ]} containerStyle={{ height: 40 }} placeholder='Select Size' style={{ backgroundColor: '#fafafa' }} dropDownDirection="TOP" />
                </View>

                <View className='z-50'>
                    <DropDownPicker open={open2} value={value2} setOpen={setOpen2} setValue={setValue2} mode='SIMPLE' items={[
                        { label: "Male", value: Gender.Male },
                        { label: "Female", value: Gender.Female },
                        { label: "Other", value: Gender.Other }
                    ]} dropDownContainerStyle={{
                        backgroundColor: 'white', zIndex: 1000, elevation: 1000
                    }} style={{ backgroundColor: '#fafafa' }} placeholder='Select Gender' />
                </View>

                <View>
                    <Controller name="phone" control={control} rules={{ required: true }} render={({ field: { onChange, onBlur, value } }) => (
                        <Input errorMessage={errors.phone && errors.phone.message} placeholder="Phone" keyboardType='number-pad' onBlur={onBlur} onChangeText={onChange} value={value} />
                    )} />
                </View>

                <View>

                    <Controller name="email" control={control} rules={{ required: true }} render={({ field: { onChange, onBlur, value } }) => (
                        <Input errorMessage={errors.email && errors.email.message} placeholder="Email" keyboardType='email-address' onBlur={onBlur} onChangeText={onChange} value={value} />
                    )} />

                </View>

                <View>
                    <Controller name="address" control={control} rules={{ required: true }} render={({ field: { onChange, onBlur, value } }) => (
                        <Input errorMessage={errors.address && errors.address.message} placeholder="Address" onBlur={onBlur} onChangeText={onChange} value={value} />
                    )} />
                </View>


                <View className='flex flex-row w-full gap-x-2'>
                    <TouchableOpacity className={style1} onPress={() => {
                        setFormValue("invitationSent", true);
                    }}>
                        <Text className='text-center text-lg'>Invitation sent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className={style2} onPress={() => {
                        setFormValue("invitationSent", false);
                    }}>
                        <Text className='text-center text-lg'>Not sent</Text>
                    </TouchableOpacity>
                </View>

                <View className='flex flex-row w-full gap-x-2'>
                    <TouchableOpacity className={style3} onPress={() => {
                        setFormValue("invitationAccepted", "Accepted");
                    }}>
                        <Text className='text-center text-lg'>Accepted</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className={style4} onPress={() => {
                        setFormValue("invitationAccepted", "Pending");
                    }}>
                        <Text className='text-center text-lg'>Pending</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className={style5} onPress={() => {
                        setFormValue("invitationAccepted", "Declined");
                    }}>
                        <Text className='text-center text-lg'>Declined</Text>
                    </TouchableOpacity>
                </View>

                <Button onPress={handleSubmit(onSubmit)}>Add</Button>
            </View>
        </ScrollView>
    )
}