import { View, Text, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { Image } from '@rneui/themed';
import * as Contacts from 'expo-contacts';

interface Props {
    image: string | null | undefined;
    name: string;
    phone: string | undefined;
    id: string;
    isContactSet: boolean;
}

export default function ContactNumber(props: Props) {

    const [selected, setSelected] = React.useState(false);

    const styles1 = "flex flex-row items-center gap-x-5 p-4 rounded-md " + (selected === true ? "bg-orange-500" : "bg-white");

    return (
        <View className='flex flex-row items-center gap-x-5 p-4 rounded-md'>
            <Image source={props.image ? { uri: props.image } : require("../assets/not_found.png")} alt="Not Found" style={{
                width: 30,
                height: 30,
                resizeMode: "contain",
                borderRadius: 50
            }} />
            <View className='flex flex-col justify-between'>
                <Text className='text-lg'>{props.name}</Text>
                <Text className='text-gray-500'>{props.phone ?? ""}</Text>
            </View>
        </View>
    )
}