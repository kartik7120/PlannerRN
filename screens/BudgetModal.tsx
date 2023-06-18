import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Button, Input } from '@rneui/themed'
import { useForm, Controller } from 'react-hook-form'
import DropDownPicker from 'react-native-dropdown-picker';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTab } from './TabNavigator';

type TabBudgetTypes = BottomTabNavigationProp<RootTab, 'Budget'>


enum Category {
    Attire = 'Attire',
    Health = 'Health',
    Music = 'Music',
    Flower = 'Flower',
    Photo = 'Photo',
    Accessories = 'Accessories',
    Reception = 'Reception',
    Transpotation = 'Transpotation',
    Accomodation = 'Accomodation',
    Unassigned = 'Unassigned',
}

interface BudgetFormFields {
    name: string;
    note: string;
    category: Category | null;
    amount: number;
}

export default function BudgetModal() {

    const { register, control, formState: { errors }, handleSubmit, setValue: setFormField } = useForm<BudgetFormFields>({
        defaultValues: {
            name: '',
            note: '',
            category: Category.Unassigned,
            amount: 0,
        }
    });
    const navigation = useNavigation<TabBudgetTypes>();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
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
    ]);

    const onSubmit = async (data: BudgetFormFields) => {
        try {
            const eventId = await AsyncStorage.getItem('currentEventId')
            if (eventId == null) {
                console.log("eventId is null")
                return
            }
            const colRef = collection(db, 'events', eventId, 'budget');
            const docRef = await addDoc(colRef, {
                category: data.category == null ? Category.Unassigned : data.category,
                name: data.name,
                note: data.note,
                amount: data.amount,
                paid: 0,
                pending: 0,
            });
            navigation.navigate("Budget");
        } catch (error) {
            console.log('Error adding document: ')
            console.log(error)
        }
    }

    return (
        <View className='h-full flex flex-col justify-start'>
            <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                <Input placeholder="Name" onChangeText={onChange} onBlur={onBlur} value={value}
                />
            )} name="name" rules={{ required: true }} />
            <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                <Input placeholder="Note" onChangeText={onChange} onBlur={onBlur} value={value}
                />
            )} name="note" />
            <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                <Input placeholder="Amount" keyboardType='number-pad' onChangeText={onChange} onBlur={onBlur} value={value.toString()}
                />
            )} name="amount" rules={{ required: true }} />
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                onChangeValue={(value) => {
                    if (value == null) {
                        return;
                    }
                    setFormField('category', value as Category);
                }}
            />
            <Button title="Submit" onPress={handleSubmit(onSubmit)} style={{
                marginTop: 10,
            }} />
        </View>
    )
}