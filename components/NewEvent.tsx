import { View, Text, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Button, Dialog, Image, Input } from '@rneui/themed';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from '@expo/vector-icons';

interface Props {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NewEvent(props: Props) {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [name, setName] = useState("");
    const [Budget, setBudget] = useState("");

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: any) => {
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
        console.warn("A time has been picked: ", time);
        hideTimePicker();
    }

    const toggle = () => {
        props.setVisible(!props.visible);
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
                <Input placeholder="Name" value={name} onChangeText={(text) => setName(() => text)} />
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
                <Input placeholder='Budget' keyboardType='numeric' defaultValue='0' value={Budget}
                    onChangeText={(text) => setBudget(() => {
                        if (text == "") {
                            return "";
                        }
                        return text;
                    })} />
            </View>
            <Button title="Create" />
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={hideTimePicker}
            />
        </Dialog>
    )
}