import { View, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import * as Contacts from 'expo-contacts';
import ContactNumber from '../components/ContactNumber';
import { Button } from '@rneui/themed';

export default function GuestContactModal() {

    const [contacts, setcontacts] = React.useState<Contacts.Contact[] | null>(null);
    const [setselected, setSetselected] = React.useState<Contacts.Contact | null>();

    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    sort: Contacts.SortTypes.FirstName,
                });

                if (data.length > 0) {
                    const contact = data[0];
                    setcontacts(data);
                }
            }
        })();
    }, []);

    const isContactSet = React.useMemo(() => {
        if (setselected === null) {
            return false;
        }
        return true;
    }, [setselected])

    const handleSelect = React.useCallback((contact: Contacts.Contact | null) => {
        if (contact === null) {
            setSetselected(null);
            return;
        }
        setSetselected(contact);
    }, [])

    return (
        <ScrollView className='h-full'>
            <View className='flex flex-col gap-y-4 m-2'>
                {contacts?.map((contact, index) => {
                    return <ContactNumber isContactSet={isContactSet} id={contact.id} setContact={handleSelect} key={index} name={contact.name ? contact.name : ""} phone={contact.phoneNumbers ? contact.phoneNumbers[0].number : ""} image={contact.imageAvailable ? contact.image?.uri : null} />
                })}
            </View>
            <Button title="SELECT" onPress={() => { }} />
        </ScrollView>
    )
}