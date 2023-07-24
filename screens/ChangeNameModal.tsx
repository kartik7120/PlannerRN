import { View, Text } from 'react-native';
import React, { useLayoutEffect, useEffect } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStack } from '../App';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input } from '@rneui/themed';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase';
import { useUser } from '@clerk/clerk-expo';

interface Form {
    name: string;
}

type RProps = RouteProp<RootStack, 'ChainNameSettings'>;

export default function ChangeNameModal() {

    const route = useRoute<RProps>();
    const [eventId, setEventId] = React.useState<string | null>(null);
    const navigation = useNavigation();
    const { user } = useUser();

    const { control, formState: { errors }, handleSubmit, setValue } = useForm<Form>({
        defaultValues: {
            name: user?.username || ""
        }
    });

    console.log(user?.username)

    const onSubmit = async (data: Form) => {
        try {
            if (!eventId) return;
            if (!user) return;
            await user?.update({ username: data.name });
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View>
            <Controller control={control} render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                />
            )} name="name" rules={{ required: true }} />
            {errors.name && <Text>This is required.</Text>}
            <Button title="Change Name" onPress={handleSubmit(onSubmit)} />
        </View>
    )
}