import { View, Text, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Button, Dialog, Image, Input } from '@rneui/themed';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from '@expo/vector-icons';
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';

interface Props {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Form {
    name: string;
    Budget: string;
}

export default function NewEvent(props: Props) {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [name, setName] = useState("");
    const [Budget, setBudget] = useState("");
    const { control, handleSubmit, setValue, register, setError, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            Budget: "",
            date: "",
            time: "",
        }
    });

    const navigation = useNavigation<StackNavigationProp<RootStack, 'StartNew'>>();

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: any) => {
        setValue("date", date);
        console.warn("A date has been picked: ", date);
        hideDatePicker();
    };

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    }

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    }

    const handleTimeConfirm = (time: any) => {
        setValue("time", time)
        console.warn("A time has been picked: ", time);
        hideTimePicker();
    }

    const toggle = () => {
        props.setVisible(!props.visible);
    }

    const submit = async (data: Form) => {
        try {
            
        } catch (error) {

        }
        navigation.navigate("Home")
        console.log(data);
    }

    return (
        <Dialog isVisible={props.visible} onBackdropPress={toggle}>
            <View className='flex flex-col justify-evenly items-center'>
                <Image source={require("../assets/calender.jpg")} style={{
                    width: 150,
                    height: 150,
                    resizeMode: "contain",
                }} />
                <Text className='text-black text-3xl text-center'>Create a new event</Text>
                <Text className='text-black text-lg text-center'>Set up an event and start planning it</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input onBlur={onBlur} value={value} placeholder='Name' onChangeText={onChange} />
                    )}
                    name="name"
                    rules={{ required: true }}
                />
                <View className='flex flex-row justify-between'>
                    <Button title="Select Date" onPress={showDatePicker} buttonStyle={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }} type="outline" iconPosition='right' icon={<AntDesign name="calendar" size={24} color="black" />} />
                    <Button title="Select Time" onPress={showTimePicker} buttonStyle={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 5,
                    }} type="outline" iconPosition='right' icon={<AntDesign name="clockcircleo" size={24} color="black" />} />
                </View>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input onBlur={onBlur} value={value} placeholder='Budget' keyboardType='numeric' defaultValue='0'
                            onChangeText={onChange} />
                    )}
                    name="Budget"
                    rules={{ required: true, pattern: /^[0-9]*$/ }}
                />
            </View>
            <Button title="Create" onPress={handleSubmit(submit)} />
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        onChange={onChange}
                    />
                )}
                name="date"
                rules={{ required: true }}
            />
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        onConfirm={handleTimeConfirm}
                        onCancel={hideTimePicker}
                        onChange={onChange}
                    />
                )}
                name="time"
                rules={{ required: true }}
            />
            {errors.date && <Text className='text-red-600 font-semibold text-lg'>Date is required.</Text>}
            {errors.time && <Text className='text-red-600 font-semibold text-lg'>Time is required.</Text>}
            {errors.name && <Text className='text-red-600 font-semibold text-lg'>Name is required.</Text>}
            {errors.Budget && <Text className='text-red-600 font-semibold text-lg'>Budget is required.</Text>}
        </Dialog>
    )
}