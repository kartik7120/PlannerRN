import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Input } from '@rneui/themed'
import { useForm, Controller } from 'react-hook-form'
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTab } from './TabNavigator';
import { RouteProp } from "@react-navigation/native";
import { RootStack } from '../App';

type TabBudgetTypes = BottomTabNavigationProp<RootTab, 'Budget'>
type RoutePramsProps = RouteProp<RootStack, 'BudgetItemModal'>

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
    paid: number;
    pending: number;
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
    const route = useRoute<RoutePramsProps>();

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

    useEffect(() => {
        if (route.params && route.params.edit) {
            setFormField('name', route.params.name);
            setFormField('note', route.params.note);
            setFormField('amount', Number(route.params.amount));
            setFormField('category', route.params.category as Category);
            setFormField('paid', Number(route.params.paid));
            setFormField('pending', Number(route.params.pending));
        }
    }, [route.params])

    const onSubmit = async (data: BudgetFormFields) => {
        try {
            const eventId = await AsyncStorage.getItem('currentEventId')
            if (eventId == null) {
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
            navigation.goBack();
        } catch (error) {
            console.log(error)
        }
    }

    const onEdit = async (data: BudgetFormFields) => {
        try {
            const eventId = await AsyncStorage.getItem('currentEventId')
            if (eventId == null) {
                console.log("eventId is null")
                return
            }
            const docRef = doc(db, 'events', eventId, 'budget', route.params.id);
            await updateDoc(docRef, {
                category: data.category == null ? Category.Unassigned : data.category,
                name: data.name,
                note: data.note,
                amount: data.amount,
                paid: data.paid,
                pending: data.pending,
            });
            navigation.goBack();
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
            {route.params.edit ?
                <Button title="Edit" onPress={handleSubmit(onEdit)} /> :
                <Button title="Submit" onPress={handleSubmit(onSubmit)} style={{
                    marginTop: 10,
                }} />}
        </View>
    )
}