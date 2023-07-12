import { View, Text } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStack } from '../App';
import { Button, Input } from '@rneui/themed';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import DropDownPicker from 'react-native-dropdown-picker';

interface Form {
    budget: string;
    currency: string;
}

type RProps = RouteProp<RootStack, "BudgetSettingsModal">;
type NavProps = StackNavigationProp<RootStack, "BudgetSummaryModal">;

const getEventDetails = async ({ queryKey }: any) => {
    const [_key, { id }] = queryKey;
    const event = await getDoc(doc(db, "events", id));
    return event.data();
}

export default function BudgetSettingsModal() {

    const { control, setValue: setFormValue, handleSubmit } = useForm<Form>({
        defaultValues: {
            budget: "",
            currency: ""
        }
    });

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'US dollar (USD)', value: 'US dollar (USD)' },
        { label: 'Euro (EUR)', value: 'Euro (EUR)' },
        { label: "British Pound (GBP)", value: "British Pound (GBP)" },
        { label: "Japanese yen (JPY)", value: "Japanese yen (JPY)" },
        { label: "Indian Rupee (INR)", value: "Indian Rupee (INR)" },
        { label: "Australian dollar (AUD)", value: "Australian dollar (AUD)" },
        { label: "Canadian dollar (CAD)", value: "Canadian dollar (CAD)" },
        { label: "Swiss franc (CHF)", value: "Swiss franc (CHF)" },
    ]);

    const queryClient = useQueryClient();
    const id = queryClient.getQueryData(['currentEventId'], {
        exact: true
    });

    const navigation = useNavigation<NavProps>();
    const event = useQuery(['currentEvent', { id }], getEventDetails);

    const route = useRoute<RProps>();

    useEffect(() => {
        if (event.status === 'success') {
            setFormValue('budget', event.data?.Budget);
        }
    }, [event.status])

    const onSubmit = async (data: Form) => {
        setFormValue("currency", value === null ? "" : value);
        try {
            const eventRef = doc(db, "events", id as string);
            await updateDoc(eventRef, {
                Budget: data.budget,
                Currency: data.currency
            })
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View className='bg-white flex flex-col gap-y-5 p-2 m-2 h-full border border-transparent rounded-lg overflow-hidden'>
            <Controller control={control} name="budget" render={({ field: { onChange, onBlur, value } }) => (
                <Input label="Budget" onBlur={onBlur} onChangeText={onChange} value={value} />
            )} />
            <View>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    autoScroll={true}
                    containerStyle={{
                        zIndex: 1000,
                        position: "relative",
                    }}
                    style={{
                        marginBottom: 10
                    }}
                    placeholder='Select Currency'
                    listMode="SCROLLVIEW"
                />
            </View>
            <Button style={{
                width: "100%",
            }} radius="md" onPress={() => handleSubmit(onSubmit)} title="Save" />
        </View>
    )
}