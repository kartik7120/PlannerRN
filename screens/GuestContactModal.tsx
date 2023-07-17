import { View, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import * as Contacts from 'expo-contacts';
import ContactNumber from '../components/ContactNumber';
import { Button } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';

type NProps = StackNavigationProp<RootStack, 'GuestContactModal'>;

export default function GuestContactModal() {

    const [contacts, setcontacts] = React.useState<Contacts.Contact[] | null>(null);
    const [setselected, setSetselected] = React.useState<Contacts.Contact | null>();
    const [isLongPressed, setIsLongPressed] = React.useState(false);
    const [selectedItems, setSelectedItems] = React.useState<any[] | null>(null);
    const [backgroundStyles, setBackgroundStyles] = React.useState({
        backgroundColor: "orange",
        opacity: 0.5
    });
    const navigation = useNavigation<NProps>();

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

    const handleContacts = async () => {
        if (selectedItems === null) {
            return;
        }
        selectedItems.map((contact: Contacts.Contact) => {
            navigation.push("GuestModal", {
                firstname: contact.firstName,
                lastname: contact.lastName,
                phone: contact.phoneNumbers ? contact.phoneNumbers[0].number : "",
            })
        })
        setSelectedItems(null);
    }

    return (
        <ScrollView className='h-full'>
            <View className='flex flex-col gap-y-4 m-2'>
                {contacts?.map((contact, index) => {
                    return (
                        <TouchableOpacity style={{
                            backgroundColor: selectedItems && selectedItems.includes(contact) ? backgroundStyles.backgroundColor : 'white',
                            opacity: selectedItems && selectedItems.includes(contact) ? backgroundStyles.opacity : 1,
                        }} onPress={() => {
                            if (selectedItems === null) {
                                return setSelectedItems((items) => {
                                    return [contact];
                                })
                            } else if (selectedItems.includes(contact)) {
                                return setSelectedItems((todos) => {
                                    return todos!.filter((todo) => todo !== contact);
                                })
                            } else {
                                return setSelectedItems((items) => {
                                    return [...items!, contact];
                                })
                            }
                        }}>
                            <ContactNumber isContactSet={isContactSet} id={contact.id}
                                key={index} name={contact.name ? contact.name : ""}
                                phone={contact.phoneNumbers ? contact.phoneNumbers[0].number : ""}
                                image={contact.imageAvailable ? contact.image?.uri : null} />
                        </TouchableOpacity>
                    )
                })}
            </View>
            <Button title="SELECT" onPress={handleContacts} />
        </ScrollView>
    )
}