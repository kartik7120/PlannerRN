import { View, Text } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStack } from '../App';
import { Button, Input } from '@rneui/themed';

interface Form {
    budget: string;
    currency: string;
}

type RProps = RouteProp<RootStack, "BudgetSettingsModal">;

export default function BudgetSettingsModal() {

    const { control, setValue } = useForm<Form>({
        defaultValues: {
            budget: "",
            currency: ""
        }
    });

    const route = useRoute<RProps>();

    useLayoutEffect(() => {
        setValue("budget", route.params.budget);
    }, [route.params])

    return (
        <View className='bg-white flex flex-col gap-y-5 p-2 m-2 border border-transparent rounded-lg overflow-hidden'>
            <Controller control={control} name="budget" render={({ field: { onChange, onBlur, value } }) => (
                <Input label="Budget" onBlur={onBlur} onChangeText={onChange} value={value} />
            )} />
            <Controller control={control} name="currency" render={({ field: { onChange, onBlur, value } }) => (
                <Input label="Currency" onBlur={onBlur} onChangeText={onChange} value={value} />
            )} />
            <Button style={{
                width: "100%"
            }} onPress={() => { }} title="Save" />
        </View>
    )
}