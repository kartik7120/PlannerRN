import { View, Text } from 'react-native'
import React from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { Button, Input } from '@rneui/themed';
import { addDoc, collection } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Form {
    name: string;
    note: string;
    completed: "Completed" | "Pending";
}

export default function SubtaskScreen() {

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<Form>({
        defaultValues: {
            name: '',
            note: '',
            completed: 'Pending',
        }
    });

    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const [styles, setStyles] = React.useState({
        backgroundColor: 'white',
        inactiveBackgroundColor: 'orange',
    });

    const completed = useWatch({
        control,
        name: 'completed',
    })

    const onSubmit = async (data: Form) => {
        try {
            const eventId = await AsyncStorage.getItem('currentEventId');
            if (!eventId) throw new Error('No event id found');
            await addDoc(collection(db, 'events', eventId, "checklist", route.params.taskId, "subtask"), {
                name: data.name,
                note: data.note,
                completed: data.completed,
            })
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View className='bg-white m-2 h-full'>
            <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                <Input placeholder='Name' onBlur={onBlur} onChangeText={onChange} value={value} />
            )} name='name' rules={{ required: true }} />
            {errors.name && <Text>This is required.</Text>}
            <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                <Input placeholder='Note' onBlur={onBlur} onChangeText={onChange} value={value} />
            )} name='note' rules={{ required: true }} />
            {errors.note && <Text>This is required.</Text>}
            <View className='flex flex-row w-full items-center gap-x-1'>
                <Text className='text-center p-3 border border-gray-500' onPress={() => {
                    setValue('completed', 'Completed');
                    setStyles({
                        backgroundColor: 'orange',
                        inactiveBackgroundColor: 'white',
                    })
                }} style={{
                    width: '50%',
                    backgroundColor: completed === 'Completed' ? "orange" : 'white',
                }}>Completed</Text>
                <Text className='text-center p-3 border border-gray-500' onPress={() => {
                    setValue('completed', 'Pending');
                    setStyles({
                        backgroundColor: 'white',
                        inactiveBackgroundColor: 'orange',
                    })
                }} style={{
                    width: '50%',
                    backgroundColor: completed === 'Pending' ? "orange" : 'white',
                }}>Pending</Text>
            </View>
            <View className='mt-3'>
                <Button title="ADD" onPress={handleSubmit(onSubmit)} />
            </View>
        </View>
    )
}