import { View, Text } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { Button, Input } from '@rneui/themed';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStack } from '../App';
import { addDoc, collection, doc, getDoc, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

interface Form {
    name: string;
    note: string;
    amount: string;
    paidDate: string;
    paid: string;
}

type RouteTypes = RouteProp<RootStack, 'PaymentModal'>;

export default function PaymentModal() {

    const { control, formState: { errors }, handleSubmit, setValue: setFormValue } = useForm({
        defaultValues: {
            name: '',
            note: '',
            amount: '',
            paidDate: '',
            paid: "Paid",
        }
    })
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Paid', value: 'Paid' },
        { label: 'Pending', value: 'Pending' }
    ]);

    const route = useRoute<RouteTypes>();
    const navigation = useNavigation();

    useEffect(() => {
        if (route.params && route.params.paymentSubmit === false) {
            async function getPayment() {
                const eventId = await AsyncStorage.getItem('currentEventId');
                const docRef = doc(db, `events/${eventId}/budget/${route.params.id}/payments/${route.params.paymentId}`);
                const querySnapshot = await getDoc(docRef);
                const payment = querySnapshot.data();
                console.log(payment);
                setFormValue("name", payment?.name);
                setFormValue("note", payment?.note);
                setFormValue("amount", payment?.amount);
                setFormValue("paidDate", payment?.paidDate);
                setFormValue("paid", payment?.paid);
                setValue(payment?.paid);
            }
            getPayment();
        }
    }, [route.params])

    useLayoutEffect(() => {
        if (route.params && route.params.paymentSubmit === false) {
            navigation.setOptions({
                title: "Edit Payment"
            });
            return;
        }
    }, [route.params])

    const onSubmit = async (data: Form) => {
        try {
            const eventId = await AsyncStorage.getItem('currentEventId');
            const budgetItemId = route.params.id;

            if (eventId === null) {
                return;
            }
            const colRef = collection(db, `events/${eventId}/budget/${budgetItemId}/payments`);
            const docRef = await addDoc(colRef, {
                name: data.name,
                note: data.note,
                amount: data.amount,
                paidDate: data.paidDate,
                paid: data.paid,
            })
            const docRef2 = doc(db, `events/${eventId}/budget/${budgetItemId}`);
            const budgetItemDoc = await getDoc(docRef2);
            if (data.paid === "Paid") {
                await updateDoc(docRef2, {
                    paid: budgetItemDoc.data()?.paid + parseInt(data.amount),
                })
            } else {
                await updateDoc(docRef2, {
                    pending: budgetItemDoc.data()?.pending + parseInt(data.amount),
                })
            }
            console.log("Document written with ID: ", docRef.id);
            navigation.goBack();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        console.log(data)
    }

    async function editPayment(data: Form) {
        try {
            const eventId = await AsyncStorage.getItem('currentEventId');
            const budgetItemId = route.params.id;

            if (eventId === null) {
                return;
            }
            const docRef = doc(db, `events/${eventId}/budget/${budgetItemId}/payments/${route.params.paymentId}`);
            await updateDoc(docRef, {
                name: data.name,
                note: data.note,
                amount: data.amount,
                paidDate: data.paidDate,
                paid: data.paid,
            })
            navigation.goBack();
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    }

    return (
        <View className='bg-white p-2 flex flex-col gap-y-4'>
            <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                <Input label='Name' value={value} onChangeText={onChange} onBlur={onBlur} />
            )} name='name' rules={{ required: true }} />
            {errors.name && <Text>This is required.</Text>}
            <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                <Input label='Note' value={value} onChangeText={onChange} onBlur={onBlur} />
            )} name='note' rules={{ required: true }} />
            {errors.note && <Text>This is required.</Text>}
            <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                <Input label='Amount' value={value} onChangeText={onChange} onBlur={onBlur} />
            )} name='amount' rules={{ required: true }} />
            {errors.amount && <Text>This is required.</Text>}
            <DropDownPicker open={open} value={value} items={items} setOpen={setOpen} setValue={setValue}
                setItems={setItems} onChangeValue={(value) => setFormValue("paid", value || "Paid")} />
            {route.params.paymentSubmit ? <Button title='Submit' onPress={handleSubmit(onSubmit)} /> : (
                <Button title='Edit' onPress={handleSubmit(editPayment)} />
            )}
        </View>
    )
}