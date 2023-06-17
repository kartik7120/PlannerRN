import { View, Text, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { Image } from '@rneui/themed';
import * as Contacts from 'expo-contacts';

interface Props {
    image: string | null | undefined;
    name: string;
    phone: string | undefined;
    setContact: (contact: Contacts.Contact | null) => void;
    id: string;
    isContactSet: boolean;
}

export default function ContactNumber(props: Props) {

    const [selected, setSelected] = React.useState(false);

    const styles1 = "flex flex-row items-center gap-x-5 p-4 rounded-md " + (selected === true ? "bg-orange-500" : "bg-white");

    return (
        <TouchableWithoutFeedback onPress={() => {
            if (selected === true) {
                setSelected(false);
                props.setContact(null);
                return;
            }
            if(selected === false) {
                if(props.isContactSet === true) {
                    
                    return;
                }
            }
            props.setContact({
                name: props.name,
                phoneNumbers: [{
                    id: props.id,
                    label: props.name,
                    number: props.phone ?? "",
                }],
                imageAvailable: props.image ? true : false,
                contactType: Contacts.ContactTypes.Person,
                id: props.id,
            })
            setSelected(true);
        }}>
            <View className={styles1}>
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
        </TouchableWithoutFeedback>
    )
}