import { View, Text } from 'react-native'
import React from 'react'

export default function ButtonTitle() {
    return (
        <View className='flex flex-col gap-1'>
            <Text className='text-xl text-white font-medium'>Start Planning</Text>
            <Text className='text-sm text-white '>Create an account for free</Text>
        </View>
    )
}