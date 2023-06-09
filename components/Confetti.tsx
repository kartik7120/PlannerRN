import { View, Text } from 'react-native'
import React from 'react'
import ConfettiCannon from 'react-native-confetti-cannon';

export default function Confetti() {

    const ref = React.useRef(null);

    return (
        <ConfettiCannon ref={ref} count={200} origin={{ x: 50, y: 50 }} fallSpeed={4000} fadeOut={true} />
    )
}