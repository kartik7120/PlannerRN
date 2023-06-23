import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Input } from '@rneui/themed';
import { Controller, useForm, useWatch } from 'react-hook-form';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStack } from '../App';
import DropDownPicker from 'react-native-dropdown-picker';

export enum Category {
  Attire = 'Attire',
  Health = 'Health',
  Music = 'Music',
  Flower = 'Flower',
  Photo = 'Photo',
  Accessories = 'Accessories',
  Reception = 'Reception',
  Transpotation = 'Transpotation',
  Accomodation = 'Accomodation',
  Unassigned = 'Unassigned',
}

interface Form {
  name: string;
  note: string;
  category: Category;
  date: string;
  completed: "Completed" | "Pending";
}

type RouteProps = RouteProp<RootStack, "CheckListModal">;

export default function CheckListScreen() {

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<Form>({
    defaultValues: {
      name: '',
      note: '',
      category: Category.Unassigned,
      date: '',
      completed: 'Pending',
    }
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [styles, setStyles] = React.useState({
    backgroundColor: 'white',
    inactiveBackgroundColor: 'orange',
  });
  const [open, setOpen] = React.useState(false);
  const [value, setDropDownValue] = useState(Category.Unassigned);

  const navigation = useNavigation() as any;
  const route = useRoute<RouteProps>();

  useEffect(() => {
    if (route.params && route.params.edit) {
      setValue('name', route.params.name || "");
      setValue('note', route.params.note || "");
      setValue('category', route.params.category as Category || Category.Unassigned);
      setValue('date', route.params.date || "");
      setValue('completed', route.params.completed as any || "Pending");
      navigation.setOptions({
        headerTitle: 'Edit task',
      })
    }
  }, [route.params])

  const onSubmit = async (data: Form) => {
    try {
      const eventId = await AsyncStorage.getItem('currentEventId');
      if (!eventId) throw new Error('No event id found');
      const colRef = collection(db, 'events', eventId, 'checklist');
      await addDoc(colRef, { ...data, category: value });
      navigation.navigate("Home", {
        screen: "Checklist"
      })
    } catch (error) {
      console.log(error);
    }
    console.log(data);
  }

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

  const completed = useWatch({
    control,
    name: 'completed',
  })

  const onEdit = async (data: Form) => {
    try {
      const eventId = await AsyncStorage.getItem('currentEventId');
      if (!eventId) throw new Error('No event id found');
      if (route.params === undefined || route.params.id === undefined) throw new Error('No id found');
      const docRef = doc(db, 'events', eventId, 'checklist', route.params.id);
      await updateDoc(docRef, {
        name: data.name,
        note: data.note,
        category: value,
        date: data.date,
        completed: data.completed,
      });
      navigation.navigate("Home", {
        screen: "Checklist"
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View className='flex flex-col gap-y-3 m-2 h-full'>
      <Controller name='name' rules={{
        required: true,
      }} control={control} render={({ field: { onChange, onBlur, value } }) => (
        <Input placeholder='Name' onChangeText={onChange} onBlur={onBlur} value={value} />
      )} />
      {errors.name && <Text>This is required.</Text>}
      <Controller rules={{
        required: true,
      }} name='note' control={control} render={({ field: { onChange, onBlur, value } }) => (
        <Input placeholder='Note' onChangeText={onChange} onBlur={onBlur} value={value} />
      )} />
      {errors.note && <Text>This is required.</Text>}
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
      <Button title='Pick a date' onPress={showDatePicker} type='outline' />
      {<Text>{errors.date && errors.date.message}</Text>}
      <DropDownPicker
        open={open}
        value={value}
        items={[
          { label: 'Attire & Accessories', value: Category.Attire, },
          { label: 'Health & Beauty', value: Category.Health, },
          { label: 'Music', value: Category.Music },
          { label: 'Flower', value: Category.Flower },
          { label: 'Photo', value: Category.Photo },
          { label: 'Accessories', value: Category.Accessories },
          { label: 'Reception', value: Category.Reception },
          { label: 'Transpotation', value: Category.Transpotation },
          { label: 'Accomodation', value: Category.Accomodation },
          { label: 'Unassigned', value: Category.Unassigned },
        ]}
        setOpen={setOpen}
        setValue={setDropDownValue}
      />
      <View className='flex flex-row w-full items-center gap-x-3'>
        <Text className='text-center p-3' onPress={() => {
          setValue('completed', 'Completed');
          setStyles({
            backgroundColor: 'orange',
            inactiveBackgroundColor: 'white',
          })
        }} style={{
          width: '50%',
          backgroundColor: completed === 'Completed' ? "orange" : 'white',
        }}>Completed</Text>
        <Text className='text-center p-3' onPress={() => {
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
      {route.params && route.params.edit
        ?
        <Button title="Edit" onPress={handleSubmit(onEdit)} />
        : <Button title='Submit' onPress={handleSubmit(onSubmit)} />}
    </View>
  )
}