import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Button, Input } from '@rneui/themed'
import { useForm, Controller } from 'react-hook-form'
import DropDownPicker from 'react-native-dropdown-picker';
import { AntDesign } from '@expo/vector-icons';

enum Category {
    Attire = 'Attire & Accessories',
    Health = 'Health & Beauty',
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

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Attire & Accessories', value: 'Attire & Accessories', },
        { label: 'Health & Beauty', value: 'Health & Beauty', },
        { label: 'Music', value: 'Music' },
        { label: 'Flower', value: 'Flower' },
        { label: 'Photo', value: 'Photo' },
        { label: 'Accessories', value: 'Accessories' },
        { label: 'Reception', value: 'Reception' },
        { label: 'Transpotation', value: 'Transpotation' },
        { label: 'Accomodation', value: 'Accomodation' },
        { label: 'Unassigned', value: 'Unassigned' },
    ]);

    const onSubmit = (data: BudgetFormFields) => {
        setFormField("category", value)
        console.log(data);
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
            />
            <Button title="Submit" onPress={handleSubmit(onSubmit)} style={{
                marginTop: 10,
            }} />
        </View>
    )
}