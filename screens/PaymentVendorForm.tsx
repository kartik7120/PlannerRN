import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { Button, Input } from '@rneui/themed';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

type NavProps = StackNavigationProp<RootStack, 'PaymentVendorForm'>;
type RProps = RouteProp<RootStack, "PaymentVendorForm">;


interface Form {
    name: string;
    note: string;
    amount: string;
    paidDate: string;
    paid: boolean;
}

export default function PaymentVendorForm() {

    const { control, setValue, handleSubmit } = useForm<Form>({
        defaultValues: {
            name: '',
            note: '',
            amount: '',
            paidDate: '',
            paid: false,
        }
    })

    const navigation = useNavigation<NavProps>();
    const route = useRoute<RProps>();
    const [open, setOpen] = useState(false);
    const [value, setDropDownValue] = useState(false);
    const [items, setItems] = useState([
        { label: 'Paid', value: true },
        { label: 'Pending', value: false },
    ]);

    useEffect(() => {
        if (route.params && route.params.edit) {
            setValue('name', route.params.name || "");
            setValue('note', route.params.note || "");
            setValue('amount', route.params.amount || "");
            setValue('paidDate', route.params.paidDate || "");
            setValue('paid', route.params.paid || false);
        }
    }, [route.params])

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: any) => {
        setValue('paidDate', date);
        console.warn("A date has been picked: ", date);
        hideDatePicker();
    };

    const onsubmit = async (data: Form) => {
        setValue('paid', value);
        try {
            const eventId = await AsyncStorage.getItem('currentEventId');
            if (!eventId) return;
            const colRef = collection(db, 'events', eventId, 'vendors', route.params.id, 'payments');
            await addDoc(colRef, data);
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    }

    const onEdit = async (data: Form) => {
        try {
            const eventId = await AsyncStorage.getItem('currentEventId');
            if (!eventId) return;
            if (!route.params.paymentId) return;
            const docRef = doc(db, 'events', eventId, 'vendors', route.params.id, 'payments', route.params.paymentId);
            await updateDoc(docRef, {
                name: data.name,
                note: data.note,
                amount: data.amount,
                paidDate: data.paidDate,
                paid: data.paid,
            });
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View className='h-full p-4'>
            <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Name"
                />
            )} name="name" rules={{ required: true }} />
            <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Note"
                />
            )} name="note" rules={{ required: true }} />
            <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Amount"
                    keyboardType='number-pad'
                />
            )} name="amount" rules={{ required: true }} />

            <View className='z-40'>
                <DropDownPicker items={items} containerStyle={{ height: 40 }} value={value} open={open}
                    setOpen={setOpen} setValue={setDropDownValue} setItems={setItems} />
            </View>

            <Button title="Set Date" type='outline' style={{
                marginBottom: 20
            }} onPress={() => setDatePickerVisibility(true)} />

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            {
                route.params.edit ?
                    <Button title="Edit" onPress={handleSubmit(onEdit)} />
                    : <Button title="Submit" onPress={handleSubmit(onsubmit)} />
            }
        </View>
    )
}