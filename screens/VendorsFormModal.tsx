import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from '@rneui/themed';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { Category } from './CheckListScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';

interface Form {
    name: string;
    note?: string;
    category: Category | null;
    phone: string;
    email?: string;
    website?: string;
    address?: string;
    amount: string;
    status: string;
}

export default function VendorsFormModal() {

    const { control, handleSubmit, formState: { errors }, setValue: setFormValue } = useForm<Form>({
        defaultValues: {
            name: '',
            note: '',
            category: Category.Attire,
            phone: '',
            email: '',
            website: '',
            address: '',
            amount: '',
            status: 'Pending',
        }
    });

    const navigation = useNavigation();

    const [items2, setItems2] = useState([
        { label: 'Attire & Accessories', value: 'Attire', },
        { label: 'Health & Beauty', value: 'Health', },
        { label: 'Music', value: 'Music' },
        { label: 'Flower', value: 'Flower' },
        { label: 'Photo', value: 'Photo' },
        { label: 'Accessories', value: 'Accessories' },
        { label: 'Reception', value: 'Reception' },
        { label: 'Transpotation', value: 'Transpotation' },
        { label: 'Accomodation', value: 'Accomodation' },
        { label: 'Unassigned', value: 'Unassigned' },
    ])

    const [open2, setOpen2] = useState(false)
    const [value2, setValue2] = useState(null);

    const [items, setItems] = useState([
        { label: 'Reserved', value: 'Reserved' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Rejected', value: 'Rejected' }
    ]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);

    const onSubmit = async (data: Form) => {
        setFormValue("category", value2);
        setFormValue("status", value === null ? "Reserved" : value);
        try {
            const eventId = await AsyncStorage.getItem('currentEventId');
            if (!eventId) return;
            const colRef = collection(db, 'events', eventId, 'vendors');
            await addDoc(colRef, data);
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ScrollView>
            <View className='bg-white p-2 h-full'>
                <Controller name='name' control={control} render={({ field: { onChange, onBlur, value } }) => (
                    <Input label='Name' onBlur={onBlur} onChangeText={onChange} value={value} />
                )} rules={{ required: true }} />

                <Controller name='note' control={control} render={({ field: { onChange, onBlur, value } }) => (
                    <Input label='Note' onBlur={onBlur} onChangeText={onChange} value={value} />
                )} />
                <View className='z-50'>
                    <DropDownPicker placeholder='Select Category' listMode="SCROLLVIEW" open={open2} setOpen={setOpen2}
                        setValue={setValue2} value={value2}
                        setItems={setItems2} items={items2} />
                </View>
                <Controller name='phone' control={control} render={({ field: { onChange, onBlur, value } }) => (
                    <Input label='Phone' onBlur={onBlur} onChangeText={onChange} value={value} keyboardType='number-pad' />
                )} rules={{ required: true }} />
                <Controller name='email' control={control} render={({ field: { onChange, onBlur, value } }) => (
                    <Input label='Email' onBlur={onBlur} onChangeText={onChange} value={value} />
                )} />
                <Controller name='website' control={control} render={({ field: { onChange, onBlur, value } }) => (
                    <Input label='Website' onBlur={onBlur} onChangeText={onChange} value={value} />
                )} />
                <Controller name='address' control={control} render={({ field: { onChange, onBlur, value } }) => (
                    <Input label='Address' onBlur={onBlur} onChangeText={onChange} value={value} />
                )} />
                <Controller name='amount' control={control} render={({ field: { onChange, onBlur, value } }) => (
                    <Input label='Amount' onBlur={onBlur} onChangeText={onChange} value={value} keyboardType='number-pad' />
                )} rules={{ required: true }} />
                <View className='z-50'>
                    <DropDownPicker listMode="SCROLLVIEW" placeholder='Select status of vendor' open={open} setOpen={setOpen} setValue={setValue} value={value}
                        setItems={setItems} items={items}
                    />
                </View>
                <View className='mt-5'>
                    <Button title="ADD" onPress={handleSubmit(onSubmit)} />
                </View>
            </View>
        </ScrollView>
    )
}