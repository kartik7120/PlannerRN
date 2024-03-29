import { View, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from '@rneui/themed';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { Category } from './CheckListScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStack } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationProps = StackNavigationProp<RootStack, 'VendorsDetailModal'>;
type RProps = RouteProp<RootStack, "VendorsForm">;


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

    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<RProps>();
    const oldVal = useRef<number>(0);

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
    const [value2, setValue2] = useState<any>(null);

    const [items, setItems] = useState([
        { label: 'Reserved', value: 'Reserved' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Rejected', value: 'Rejected' }
    ]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<any>(null);

    useEffect(() => {
        if (route.params && route.params.edit) {
            setFormValue("name", route.params.name || "");
            setFormValue("note", route.params.note);
            setFormValue("category", route.params.category as Category);
            setFormValue("phone", route.params.phone || "");
            setFormValue("email", route.params.email);
            setFormValue("website", route.params.website);
            setFormValue("address", route.params.address);
            setFormValue("amount", route.params.amount || "");
            setFormValue("status", route.params.status || "Pending");
            if (route.params.category) setValue2(route.params.category);
            if (route.params.status) setValue(route.params.status);
        }
    }, [route.params])

    useEffect(() => {
        oldVal.current = Number(route.params.amount)
    }, [route.params.amount])

    const onSubmit = async (data: Form) => {
        setFormValue("category", value2);
        setFormValue("status", value === null ? "Reserved" : value);
        try {
            const eventId = await AsyncStorage.getItem('currentEventId');
            if (!eventId) return;
            const colRef = collection(db, 'events', eventId, 'vendors');
            await addDoc(colRef, { ...data, category: data.category, status: data.status, paid: 0, pending: 0 });
            const docRef = doc(db, 'events', eventId, "vendors");
            const docData = await getDoc(docRef);
            const docRef2 = doc(db, 'events', eventId);
            const docData2 = await getDoc(docRef2);
            const objVal = () => {
                if (route.params.status === "Pending") return { pending: docData.data()?.pending + 1 }
                else if (route.params.status === "Reserved") return { reserved: docData.data()?.reserved + 1 }
                else return { rejected: docData.data()?.rejected + 1 }
            }
            await updateDoc(docRef, {
                ...docData.data(),
                ...objVal()
            })

            if (route.params.status === "Pending") {
                await updateDoc(docRef2, {
                    pending: docData2.data()?.pending + Number(data.amount)
                })
            } else if (route.params.status === "Reserved") {
                await updateDoc(docRef2, {
                    paid: docData2.data()?.paid + Number(data.amount)
                })
            }
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    }

    const onEdit = async (data: Form) => {
        setFormValue("category", value2);
        setFormValue("status", value === null ? "Reserved" : value);
        try {
            const eventId = await AsyncStorage.getItem('currentEventId');
            if (!eventId) return;
            if (!route.params.id) return;
            const docRef = doc(db, 'events', eventId, 'vendors', route.params.id);
            await updateDoc(docRef, {
                name: data.name,
                note: data.note,
                category: data.category,
                phone: data.phone,
                email: data.email,
                website: data.website,
                address: data.address,
                amount: data.amount,
                status: data.status,
            });
            const docRef2 = doc(db, 'events', eventId, "vendors");
            const docData = await getDoc(docRef2);
            const docRef3 = doc(db, 'events', eventId);
            const docData2 = await getDoc(docRef3);
            const objVal = () => {
                if (route.params.status === "Pending" && data.status === "Reserved") return { pending: docData.data()?.pending - 1, reserved: docData.data()?.reserved + 1 }
                else if (route.params.status === "Pending" && data.status === "Rejected") return { pending: docData.data()?.pending - 1, rejected: docData.data()?.rejected + 1 }
                else if (route.params.status === "Reserved" && data.status === "Pending") return { pending: docData.data()?.pending + 1, reserved: docData.data()?.reserved - 1 }
                else if (route.params.status === "Reserved" && data.status === "Rejected") return { reserved: docData.data()?.reserved - 1, rejected: docData.data()?.rejected + 1 }
                else if (route.params.status === "Rejected" && data.status === "Pending") return { pending: docData.data()?.pending + 1, rejected: docData.data()?.rejected - 1 }
                else if (route.params.status === "Rejected" && data.status === "Reserved") return { reserved: docData.data()?.reserved + 1, rejected: docData.data()?.rejected - 1 }
                else return {}
            }
            await updateDoc(docRef2, {
                ...docData.data(),
                ...objVal()
            })
            if (route.params.status === "Pending" && data.status === "Reserved") {
                await updateDoc(docRef3, {
                    pending: docData2.data()?.pending - Number(data.amount),
                    paid: docData2.data()?.paid + Number(data.amount)
                })
            } else if (route.params.status === "Pending" && data.status === "Rejected") {
                await updateDoc(docRef3, {
                    pending: docData2.data()?.pending - Number(data.amount),
                })
            } else if (route.params.status === "Reserved" && data.status === "Pending") {
                await updateDoc(docRef3, {
                    pending: docData2.data()?.pending + Number(data.amount),
                    paid: docData2.data()?.paid - Number(data.amount)
                })
            } else if (route.params.status === "Reserved" && data.status === "Rejected") {
                await updateDoc(docRef3, {
                    paid: docData2.data()?.paid - Number(data.amount)
                })
            } else if (route.params.status === "Rejected" && data.status === "Pending") {
                await updateDoc(docRef3, {
                    pending: docData2.data()?.pending + Number(data.amount),
                })
            } else if (route.params.status === "Rejected" && data.status === "Reserved") {
                await updateDoc(docRef3, {
                    paid: docData2.data()?.paid + data.amount
                })
            }
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
                    <DropDownPicker listMode="SCROLLVIEW" placeholder='Select status of vendor'
                        open={open} setOpen={setOpen} setValue={setValue} value={value}
                        setItems={setItems} items={items}
                    />
                </View>
                {route.params && route.params.edit === true ? (
                    <View className='mt-5'>
                        <Button title="EDIT" onPress={handleSubmit(onEdit)} />
                    </View>
                )
                    :
                    <View className='mt-5'>
                        <Button title="ADD" onPress={handleSubmit(onSubmit)} />
                    </View>
                }
            </View>
        </ScrollView>
    )
}